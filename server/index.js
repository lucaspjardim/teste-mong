const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const User = require('./models/User'); // Supondo que você tenha o modelo de usuário configurado
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// Configuração da sessão
app.use(session({
  secret: 'seuSegredoAqui',  // Troque por um segredo forte em produção
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Em produção, mude para true e use HTTPS
}));

// Conecte-se ao MongoDB
mongoose.connect(process.env.MONGODB_CONNECT_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('Conectado ao MongoDB'))
  .catch(err => console.error('Erro ao conectar ao MongoDB', err));

// Rotas de Matches (Futsal e Volei)
const matchesRoutes = require('./routes/matches');
app.use('/api', matchesRoutes);

// Rotas para atualização de pontos das equipes
const teamRoutes = require('./routes/teamRoutes');
app.use('/api', teamRoutes);

// Rotas para gestão de placares
const scoresRoutes = require('./routes/scores');
app.use('/api', scoresRoutes);

// Rota de login
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username, password });

  if (user) {
    req.session.user = user;
    res.status(200).json({ message: 'Login realizado com sucesso' });
  } else {
    res.status(401).json({ message: 'Credenciais inválidas' });
  }
});

// Middleware de autenticação
function authMiddleware(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.status(401).json({ message: 'Usuário não autenticado' });
  }
}

// Rota protegida (AdminPanel)
app.get('/api/admin', authMiddleware, (req, res) => {
  res.status(200).json({ message: 'Bem-vindo ao AdminPanel' });
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Servidor rodando na porta ${port}`));
