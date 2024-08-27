// routes/scores.js
const express = require('express');
const Score = require('../models/Score');
const Team = require('../models/Team');
const Match = require('../models/Match'); // Certifique-se de que o modelo Match esteja importado
const router = express.Router();

// Rota para salvar scores e atualizar os pontos totais
router.post('/scores', async (req, res) => {
  const { team, year, modality, position } = req.body;

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

  const points = pointsByPosition[position] || 0;

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

      await Team.findOneAndUpdate(
        { teamId: team, year },
        {
          $inc: {
            totalPoints: totalScoreA  // Incrementa os pontos totais com scoreA do Atletismo ou Desfile
          }
        },
        { new: true }
      );
    }

    res.status(200).json({ message: 'Score and total points updated successfully!' });
  } catch (error) {
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
