const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// Conecte-se ao MongoDB
mongoose.connect(process.env.MONGODB_CONNECT_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('Conectado ao MongoDB'))
  .catch(err => console.error('Erro ao conectar ao MongoDB', err));

// Use as rotas existentes
const matchesRoutes = require('./routes/matches');
app.use('/api', matchesRoutes);

// Rotas para atualização de pontos das equipes
const teamRoutes = require('./routes/teamRoutes');
app.use('/api', teamRoutes);


const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Servidor rodando na porta ${port}`));
