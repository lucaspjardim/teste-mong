// routes/matches.js
const express = require('express');
const Match = require('../models/Match');
const router = express.Router();

// Rota para buscar todas as partidas por ano, modalidade e teamA
router.get('/matches', async (req, res) => {
  try {
    const { year, modality, teamA } = req.query;
    let query = {};

    // Adiciona modality ao filtro, se fornecido
    if (modality) {
      query.modality = decodeURIComponent(modality.trim());
    }

    // Adiciona year ao filtro, se fornecido
    if (year) {
      query.year = decodeURIComponent(year.trim());
    }

    // Adiciona teamA ao filtro, se fornecido
    if (teamA) {
      query.teamA = decodeURIComponent(teamA.trim());
    }

    // Executa a consulta com os filtros definidos
    const matches = await Match.find(query);

    // Verifica se algum jogo foi encontrado
    if (matches.length === 0) {
      return res.status(404).json({ message: `Nenhum jogo encontrado para os filtros aplicados` });
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
