const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  teamId: { type: String, required: true },
  year: { type: String, required: true },
  totalPoints: { type: Number, default: 0 },
});

const Team = mongoose.model('Team', teamSchema);

module.exports = Team;
