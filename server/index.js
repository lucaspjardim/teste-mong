require('dotenv').config();

const mongoose = require('mongoose');
const express = require('express');

const app = express();
app.use(express.json());

console.log('MONGODB_CONNECT_URI:', process.env.MONGODB_CONNECT_URI);  // Deve exibir a URI no console

mongoose.connect(process.env.MONGODB_CONNECT_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('Conectado ao MongoDB'))
  .catch(err => console.error('Erro ao conectar ao MongoDB', err));

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Servidor rodando na porta ${port}`));
