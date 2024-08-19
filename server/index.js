const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// Conexão com MongoDB
mongoose.connect(process.env.MONGODB_CONNECT_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('Conectado ao MongoDB'))
  .catch(err => console.error('Erro ao conectar ao MongoDB', err));

// Rotas de Matches, Pontuações e outras
const matchesRoutes = require('./routes/matches');
app.use('/api', matchesRoutes);
const teamRoutes = require('./routes/teamRoutes');
app.use('/api', teamRoutes);
const scoresRoutes = require('./routes/scores');
app.use('/api', scoresRoutes);

// Rota de login
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username, password });

  if (user) {
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token });
  } else {
    res.status(401).json({ message: 'Credenciais inválidas' });
  }
});

// Middleware de autenticação
function authMiddleware(req, res, next) {
  const token = req.headers['authorization'];
  
  if (!token) {
    return res.status(401).json({ message: 'Token não fornecido' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token inválido' });
    }
    
    req.userId = decoded.userId;
    next();
  });
}

// Rota protegida (AdminPanel)
app.get('/api/admin', authMiddleware, (req, res) => {
  res.status(200).json({ message: 'Bem-vindo ao AdminPanel' });
});

// Exportando o const port = process.env.PORT || 5000;
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port} no ambiente ${process.env.NODE_ENV}`);
});