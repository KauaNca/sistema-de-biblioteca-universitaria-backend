const mongoose = require('mongoose');

const livroSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: [true, 'Título é obrigatório'],
    trim: true
  },
  isbn: {
    type: String,
    required: [true, 'ISBN é obrigatório'],
    unique: true
  },
  autor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Autores',
    required: [true, 'Autor é obrigatório']
  },
  categoria: {
    type: String,
    required: true
  },
  anoPublicacao: Number,
  disponivel: {
    type: Boolean,
    default: true
  },
  dataCadastro: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Livros', livroSchema);