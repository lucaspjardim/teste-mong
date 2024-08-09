// server/routes/games.js

const express = require('express');
const Game = require('../models/Game');  // Verifique se o modelo está no caminho correto

const router = express.Router();

// Rota para buscar todos os jogos
router.get('/', async (req, res) => {
  try {
    const games = await Game.find();  // Isso busca todos os documentos na coleção "games"
    res.status(200).json(games);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar jogos' });
  }
});

// Rota para inserir um novo jogo
router.post('/', async (req, res) => {
  const { teamA, teamB, scoreA, scoreB } = req.body;
  try {
    const newGame = new Game({ teamA, teamB, scoreA, scoreB });
    await newGame.save();
    res.status(201).json(newGame);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao salvar o jogo' });
  }
});

module.exports = router;
