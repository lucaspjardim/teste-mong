const mongoose = require('mongoose');

const volleyMatchSchema = new mongoose.Schema({
  modality: { type: String, required: true },
  group: { type: String, required: true },
  teamA: { type: String, required: true },
  teamB: { type: String, required: true },
  scoreA: { type: Number, default: 0 },
  scoreB: { type: Number, default: 0 },
  matchNumber: { type: Number, required: true },
  round: { type: String, required: true },
  isFinished: { type: Boolean, default: false },
  year: { type: String, required: true }
});

const VolleyMatch = mongoose.model('VolleyMatch', volleyMatchSchema, 'voleimatches'); // Aponta explicitamente para a coleção 'voleimatches'

module.exports = VolleyMatch;
