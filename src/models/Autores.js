const mongoose = require('mongoose');

const autorSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'Nome é obrigatório'],
    trim: true
  },
  nacionalidade: String,
  dataNascimento: Date,
  biografia: String,
  // Removemos o array de livros se não for necessário
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Autores', autorSchema);