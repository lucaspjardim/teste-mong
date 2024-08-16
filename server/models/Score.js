const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
  team: { type: String, required: true },
  year: { type: String, required: true },
  modality: { type: String, required: true },
  position: { type: Number, required: true },
  points: { type: Number, required: true },
}, {
  timestamps: true, // Adiciona createdAt e updatedAt automaticamente
});

module.exports = mongoose.model('Score', scoreSchema);
