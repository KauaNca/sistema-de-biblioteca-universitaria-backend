const mongoose = require("mongoose");

const autoresSchema = new mongoose.Schema({
  name: {
    type: String, //tipo
    required: true, //campo obrigatório
    trim: true, //sem espaços nas extremidades
  },
  nacionalidade: {
    type: String,
    required: true,
  },
  biografia: {
    type: String,
    required: true,
    minlength: 15,
  },
  createdAt: {
    type: Date,
    default: Date.now, //pegar a data atual
  },
});

module.exports = mongoose.model("Autores", autoresSchema);
