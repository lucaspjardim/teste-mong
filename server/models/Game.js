// server/models/Game.js
const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  teamA: String,
  teamB: String,
  scoreA: Number,
  scoreB: Number,
});

const Game = mongoose.model('Game', gameSchema);

module.exports = Game;
