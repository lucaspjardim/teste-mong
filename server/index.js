const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const User = require('./models/User');
require('dotenv').config();

const app = express();
app.use(express.json());

// Configuração do CORS para permitir origens específicas e métodos
const corsOptions = {
  origin: ['https://jogos-cf.vercel.app'], // Adicione outros domínios aqui, se necessário
  methods: ['GET', 'POST', 'PUT'], // Métodos HTTP permitidos
  allowedHeaders: ['Content-Type', 'Authorization'], // Cabeçalhos permitidos
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Conexão com MongoDB com opções adicionais para evitar warnings de depreciação
mongoose.connect(process.env.MONGODB_CONNECT_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('Conectado ao MongoDB'))
  .catch(err => console.error('Erro ao conectar ao MongoDB', err));

// Helmet para configurar cabeçalhos de segurança
app.use(helmet());

// Sanitização de dados para prevenir injeção de código
app.use(mongoSanitize());


// Log de requisições HTTP com Morgan
app.use(morgan('combined')); // Log detalhado

// Rotas de Matches, Pontuações e outras
const matchesRoutes = require('./routes/matches');
app.use('/api', matchesRoutes);
const teamRoutes = require('./routes/teamRoutes');
app.use('/api', teamRoutes);
const scoresRoutes = require('./routes/scores');
app.use('/api', scoresRoutes);
const updateRoutes = require('./routes/update'); // Nova rota para atualização de pontos
app.use('/api', updateRoutes);

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

  jwt.verify(token.split(' ')[1], process.env.JWT_SECRET, (err, decoded) => {
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

// Middleware global de tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Algo deu errado, por favor tente novamente mais tarde.' });
});

// Exportando o app para uso pela Vercel
module.exports = app;
