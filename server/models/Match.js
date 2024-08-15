const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  modality: { type: String, required: true },
  group: { type: String, required: true },
  teamA: { type: String, required: true },
  teamB: { type: String, required: true },
  scoreA: { type: Number, default: 0 },
  scoreB: { type: Number, default: 0 },
  matchNumber: { type: Number, required: true },
  round: { type: String, required: true },
  isFinished: { type: Boolean, default: false },
  year: {type: String, required: true}  // Novo campo adicionado
});

const Match = mongoose.model('Match', matchSchema);

module.exports = Match;
