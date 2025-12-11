const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/database');

// Importar rotas
const authRoutes = require('./routes/alunoRouter');
const livroRoutes = require('./routes/livroRouter');
// const usuarioRoutes = require('./routes/usuarioRouter');
// const emprestimoRoutes = require('./routes/emprestimoRoutes');

// Conectar ao banco
connectDB();

const app = express();

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // limite por IP
  message: 'Muitas requisições deste IP, tente novamente após 15 minutos'
});

// Middlewares
app.use(helmet()); // Segurança
app.use(cors()); // Cross-Origin
app.use(express.json()); // Body parser
app.use(express.urlencoded({ extended: true }));

// Aplicar rate limit apenas nas rotas de auth
app.use('/api/auth', limiter);

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/livros', livroRoutes);
// app.use('/api/usuarios', usuarioRoutes);
// app.use('/api/emprestimos', emprestimoRoutes);

// Rota raiz
app.get('/', (req, res) => {
  res.json({
    message: 'Bem-vindo à API do Sistema de Biblioteca Universitária',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      livros: '/api/livros',
      usuarios: '/api/usuarios',
      emprestimos: '/api/emprestimos'
    }
  });
});

// Rota 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Rota não encontrada'
  });
});

// Middleware de erro
app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(err.statusCode || 500).json({
    success: false,
    error: process.env.NODE_ENV === 'development' 
      ? err.message 
      : 'Erro interno do servidor'
  });
});

module.exports = app;