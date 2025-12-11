const mongoose = require("mongoose");

const emprestimoSchema = new mongoose.Schema({
  livro: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Livro",
    required: true,
  },
  aluno: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Aluno",
    required: true,
  },
  dataEmprestimo: {
    type: Date,
    default: Date.now,
    required: true,
  },
  dataDevolucaoPrevista: {
    type: Date,
    required: true,
    validate: {
      validator: function (value) {
        // Devolução deve ser após o empréstimo
        return value > this.dataEmprestimo;
      },
      message: "Data de devolução deve ser após a data de empréstimo",
    },
  },
  status: {
    type: String,
    enum: ["ativo", "devolvido", "atrasado", "renovado"],
    default: "ativo",
  },
});

module.exports = mongoose.model("Emprestimo", emprestimoSchema);
