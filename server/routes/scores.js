// routes/scores.js
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

    res.status(200).json({ message: 'Score and total points updated successfully!' });
  } catch (error) {
    console.error('Error updating score and total points:', error);
    res.status(500).json({ error: 'Error updating score and total points' });
  }
});

// Rota para buscar turmas pelo ano
router.get('/teams', async (req, res) => {
  const { year } = req.query;
  try {
    const teams = await Team.find({ year });
    res.status(200).json(teams);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar as turmas' });
  }
});

// Rota para buscar scores por ano, modalidade e time
router.get('/scores', async (req, res) => {
  const { year, modality, team } = req.query; // Inclui o parâmetro team

  // Constrói o objeto de filtro dinâmico
  let filter = {};
  if (year) filter.year = year;
  if (modality) filter.modality = modality;
  if (team) filter.team = team; // Adiciona o filtro de team se fornecido

  try {
    const scores = await Score.find(filter); // Filtra com base nos parâmetros fornecidos
    res.status(200).json(scores);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar as posições dos scores' });
  }
});

module.exports = router;
