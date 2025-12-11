const mongoose = require('mongoose');

const alunoSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'O nome é obrigatório'],
    trim: true
  },
  matricula: {
    type: String,
    required: [true, 'A matrícula é obrigatória'],
    unique: true,
    uppercase: true //DÁ UMA OLHADA NISSO
  },
  email: {
    type: String,
    required: [true, 'O email é obrigatório'],
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Email inválido']
  },
  curso: String,
  telefone: String,
  dataNascimento: Date,
  dataCadastro: {
    type: Date,
    default: Date.now
  },
  emprestimosAtivos: {
    type: Number,
    default: 0,
    max: [5, 'Limite de empréstimos excedido']
  }
});

module.exports = mongoose.model('Aluno', alunoSchema);