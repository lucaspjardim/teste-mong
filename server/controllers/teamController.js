const Team = require('../models/Team');

const pointsMap = {
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

const updateTeamPoints = async (req, res) => {
  try {
    const { teamId, year, position } = req.body;
    const points = pointsMap[position];

    if (!points) {
      return res.status(400).json({ error: 'Posição inválida' });
    }

    const team = await Team.findOneAndUpdate(
      { teamId, year },
      { $inc: { totalPoints: points } },
      { upsert: true, new: true }
    );

    res.status(200).json(team);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar os pontos' });
  }
};

module.exports = {
  updateTeamPoints,
};
