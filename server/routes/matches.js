// routes/matches.js
const express = require('express');
const Match = require('../models/Match');
const router = express.Router();

// Rota para buscar todas as partidas por ano e modalidade
router.get('/matches', async (req, res) => {
  try {
    const { year, modality } = req.query;
    let query = {};

    // Adiciona modality ao filtro, se fornecido
    if (modality) {
      query.modality = modality;
    }

    // Adiciona year ao filtro, se fornecido
    if (year) {
      query.year = year;
    }

    // Executa a consulta com os filtros definidos
    const matches = await Match.find(query);

    // Verifica se algum jogo foi encontrado
    if (matches.length === 0) {
      return res.status(404).json({ message: `Nenhum jogo encontrado para ${year}` });
    }

    // Retorna os jogos encontrados
    res.status(200).json(matches);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar partidas' });
  }
});

router.put('/matches/:id', async (req, res) => {
  try {
    const updatedMatch = await Match.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedMatch) {
      return res.status(404).json({ error: 'Partida não encontrada' });
    }
    res.status(200).json(updatedMatch);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao atualizar a partida' });
  }
});
   
module.exports = router;
 