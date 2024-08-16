// routes/scores.js
const express = require('express');
const Score = require('../models/Score');
const Team = require('../models/Team');
const router = express.Router();

// Rota para salvar scores
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

    res.status(200).json({ message: 'Score updated successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'Error updating score' });
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

// Rota para buscar scores por ano e modalidade
router.get('/scores', async (req, res) => {
  const { year, modality } = req.query;
  try {
    const scores = await Score.find({ year, modality });
    res.status(200).json(scores);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar as posições dos scores' });
  }
});

module.exports = router;
