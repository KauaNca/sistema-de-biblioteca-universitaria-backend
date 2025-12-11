const mongoose = require("mongoose");

const livroSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: [true, "O título é obrigatório"],
    trim: true,
    minlength: [3, "O título deve ter pelo menos 3 caracteres"],
  },
  isbn: {
    type: String,
    required: [true, "O ISBN é obrigatório"],
    unique: true,
    match: [/^(?:\d{10}|\d{13})$/, "ISBN deve ter 10 ou 13 dígitos"],
  },
  autor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Autor",
    required: [true, "O autor é obrigatório"],
  },
  anoPublicacao: {
    type: Number,
    min: [1000, "Ano inválido"],
    max: [new Date().getFullYear(), "Ano não pode ser no futuro"],
  },
  categoria: {
    type: String,
    enum: [
      "Ciência",
      "Tecnologia",
      "Literatura",
      "História",
      "Matemática",
      "Filosofia",
      "Artes",
      "Direito",
      "Medicina",
      "Engenharia",
      "Outros",
    ],
    required: true,
  },
  dataCadastro: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Livro", livroSchema);
