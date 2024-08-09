// server/routes/games.js
const express = require('express');
const Game = require('../models/Game');

const router = express.Router();

// Rota para buscar todos os jogos
router.get('/', async (req, res) => {
  try {
    const games = await Game.find();
    res.status(200).json(games);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar jogos' });
  }
});

module.exports = router;
