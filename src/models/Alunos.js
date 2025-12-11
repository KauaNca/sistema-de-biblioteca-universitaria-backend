const mongoose = require('mongoose');

const alunoSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'Nome é obrigatório'],
    trim: true
  },
  matricula: {
    type: String,
    required: [true, 'Matrícula é obrigatória'],
    unique: true,
    uppercase: true
  },
  email: {
    type: String,
    required: [true, 'Email é obrigatório'],
    unique: true,
    lowercase: true
  },
  curso: String,
  telefone: String,
  dataCadastro: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['ativo', 'inativo'],
    default: 'ativo'
  }
});

// SEM bcrypt, SEM métodos de senha
module.exports = mongoose.model('Alunos', alunoSchema);