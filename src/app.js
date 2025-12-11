// src/app.js - VERSÃO SIMPLIFICADA
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');

// Importar rotas (SEM auth)
const livroRoutes = require('./routes/livroRouter');
const autorRoutes = require('./routes/autorRouter');
const alunoRoutes = require('./routes/alunoRouter');

// Conectar ao banco
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas (TODAS públicas)
app.use('/api/livros', livroRoutes);
app.use('/api/autores', autorRoutes);
app.use('/api/alunos', alunoRoutes);

// Rota raiz SIMPLIFICADA
app.get('/', (req, res) => {
  res.json({
    message: '📚 API do Sistema de Biblioteca Universitária',
    version: '1.0.0',
    description: 'API simplificada para gerenciamento de biblioteca',
    endpoints: {
      livros: 'GET,POST /api/livros',
      autores: 'GET,POST /api/autores',
      alunos: 'GET,POST /api/alunos'
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
  console.error('Erro:', err.stack);
  res.status(500).json({
    success: false,
    error: 'Erro interno do servidor'
  });
});

module.exports = app;