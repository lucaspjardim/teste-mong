const express = require('express');
const Score = require('../models/Score');
const Team = require('../models/Team');
const Match = require('../models/Match'); // Certifique-se de que o modelo Match esteja importado
const router = express.Router();

// Rota para salvar scores e atualizar os pontos totais
router.post('/scores', async (req, res) => {
  const { team, year, modality, position } = req.body;

  // Pontuações padrão para a maioria das modalidades
  const pointsByPosition = {
    1: 60,
    2: 50,
    3: 40,
    4: 30,
    5: 20,
    6: 10,
    7: 10,
    8: 10,
    9: 10,
  };

  // Pontuações especiais para xadrez e tênis de mesa
  const specialPointsByPosition = {
    1: 25,
    2: 15,
    3: 10,
    4: 5,
    5: 0,
    6: 0,
    7: 0,
    8: 0,
    9: 0,
  };

  // Verifica se a modalidade é xadrez ou tênis de mesa para aplicar pontuações especiais
  const isSpecialModality = [
    'xadrez_masculino', 
    'xadrez_feminino', 
    'tenis_de_mesa_masculino', 
    'tenis_de_mesa_feminino'
  ].includes(modality);

  const points = isSpecialModality ? (specialPointsByPosition[position] || 0) : (pointsByPosition[position] || 0);

  try {
    // Verifica se o score já existe para evitar duplicados
    const existingScore = await Score.findOne({ team, year, modality, position });
    if (existingScore) {
      return res.status(400).json({ message: 'Score já registrado para esta modalidade, posição e ano' });
    }

    // Salva o score na coleção de scores
    const score = new Score({ team, year, modality, position, points });
    await score.save();

    // Atualiza a pontuação na coleção de teams
    await Team.findOneAndUpdate(
      { teamId: team, year },
      {
        $inc: {
          [`modalityPoints.${modality}`]: points, // Incrementa os pontos da modalidade
          totalPoints: points  // Incrementa os pontos totais
        }
      },
      { upsert: true, new: true }
    );

    // Verifica se a modalidade é Atletismo ou Desfile e atualiza o totalPoints com o scoreA
    if (['atletismo_masculino', 'atletismo_feminino', 'desfile'].includes(modality)) {
      const matches = await Match.find({ year, modality, teamA: team });
      let totalScoreA = 0;

      matches.forEach(match => {
        totalScoreA += parseFloat(match.scoreA) || 0;
      });

      console.log(`Total scoreA for ${team} in ${modality}: `, totalScoreA);

      const updateResult = await Team.findOneAndUpdate(
        { teamId: team, year },
        {
          $inc: {
            totalPoints: totalScoreA  // Incrementa os pontos totais com scoreA do Atletismo ou Desfile
          }
        },
        { new: true }
      );

      console.log(`Updated totalPoints for ${team} in ${year} by adding ${totalScoreA}: `, updateResult);
    }

    res.status(200).json({ message: 'Score e pontos totais atualizados com sucesso!' });
  } catch (error) {
    console.error('Erro ao atualizar score e pontos totais:', error);
    res.status(500).json({ error: 'Erro ao atualizar score e pontos totais' });
  }
});

// Outras rotas...

module.exports = router;
