// routes/update.js
const express = require('express');
const Team = require('../models/Team');
const Match = require('../models/Match');
const router = express.Router();

// Rota para atualizar os pontos de Atletismo e Desfile
router.post('/update', async (req, res) => {
  const { team, year, modality } = req.body;

  if (!['atletismo_masculino', 'atletismo_feminino', 'desfile'].includes(modality)) {
    return res.status(400).json({ error: 'Modality must be atletismo or desfile' });
  }

  try {
    const matches = await Match.find({ year, modality, teamA: team });
    let totalScoreA = 0;

    matches.forEach(match => {
      totalScoreA += parseFloat(match.scoreA) || 0;
    });

    const updateResult = await Team.findOneAndUpdate(
      { teamId: team, year },
      {
        $inc: {
          totalPoints: totalScoreA  // Incrementa os pontos totais com scoreA do Atletismo ou Desfile
        }
      },
      { new: true }
    );

    res.status(200).json({ message: 'Total points updated successfully!', updateResult });
  } catch (error) {
    console.error('Error updating total points:', error);
    res.status(500).json({ error: 'Error updating total points' });
  }
});

module.exports = router;
