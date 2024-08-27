const mongoose = require('mongoose');

// Definição do esquema para as partidas
const matchSchema = new mongoose.Schema({
  modality: { type: String, required: true },
  group: { type: String, required: true },
  teamA: { type: String, required: true },
  teamB: { type: String, required: true },
  scoreA: { type: Number, default: 0, get: val => parseFloat(val.toFixed(2)) },
  scoreB: { type: Number, default: 0, get: val => parseFloat(val.toFixed(2)) },
  matchNumber: { type: Number, required: true },
  round: { type: String, required: true },
  isFinished: { type: Boolean, default: false },
  year: { type: String, required: true }
});

// Middleware para lidar com pontos decimais em modalidades específicas
matchSchema.pre('save', function (next) {
  const decimalModalities = ['xadrez_masculino', 'xadrez_feminino', 'tenis_de_mesa_masculino', 'tenis_de_mesa_feminino', 'atletismo_masculino', 'atletismo_feminino', 'desfile'];
  
  if (decimalModalities.includes(this.modality)) {
    this.scoreA = parseFloat(this.scoreA.toFixed(2));
    this.scoreB = parseFloat(this.scoreB.toFixed(2));
  }
  next();
});

const Match = mongoose.model('Match', matchSchema);

module.exports = Match;
