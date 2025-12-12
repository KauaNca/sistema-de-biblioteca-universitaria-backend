// src/models/Emprestimos.js
const mongoose = require("mongoose");

const emprestimoSchema = new mongoose.Schema(
  {
    livro: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Livros",
      required: [true, "Livro é obrigatório"],
    },
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Alunos",
      required: [true, "Usuário é obrigatório"],
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
          // Data de devolução deve ser após empréstimo
          return value > this.dataEmprestimo;
        },
        message: "Data de devolução deve ser após a data de empréstimo",
      },
    },
    dataDevolucaoReal: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ["ativo", "devolvido", "atrasado", "renovado"],
      default: "ativo",
    },
    renovacoes: {
      type: Number,
      default: 0,
      max: [2, "Máximo de 2 renovações permitidas"],
    },
    multaAplicada: {
      type: Number,
      default: 0,
      min: 0,
    },
    observacoes: String,
  },
  {
    timestamps: true, // Adiciona createdAt e updatedAt automaticamente
  }
);

// 🔹 Middleware para calcular data de devolução prevista automática
emprestimoSchema.pre("save", function (next) {
  if (!this.dataDevolucaoPrevista) {
    // Padrão: 15 dias para empréstimo
    const diasEmprestimo = 15;
    this.dataDevolucaoPrevista = new Date(
      this.dataEmprestimo.getTime() + diasEmprestimo * 24 * 60 * 60 * 1000
    );
  }
  next();
});

// 🔹 Método para verificar se está atrasado
emprestimoSchema.methods.verificarAtraso = function () {
  if (this.status === "ativo" && new Date() > this.dataDevolucaoPrevista) {
    this.status = "atrasado";

    // Calcular multa: R$ 1,00 por dia de atraso
    const diasAtraso = Math.ceil(
      (new Date() - this.dataDevolucaoPrevista) / (1000 * 60 * 60 * 24)
    );
    this.multaAplicada = diasAtraso * 1.0;

    return true;
  }
  return false;
};

// 🔹 Método para registrar devolução
emprestimoSchema.methods.registrarDevolucao = function (observacoes = "") {
  this.dataDevolucaoReal = new Date();
  this.status = "devolvido";
  this.observacoes = observacoes;

  // Se havia multa por atraso, mantém
  if (this.status === "atrasado") {
    console.log(`Multa aplicada: R$ ${this.multaAplicada.toFixed(2)}`);
  }

  return this;
};

// 🔹 Índices para melhor performance
emprestimoSchema.index({ livro: 1 });
emprestimoSchema.index({ usuario: 1 });
emprestimoSchema.index({ status: 1 });
emprestimoSchema.index({ dataDevolucaoPrevista: 1 });
emprestimoSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Emprestimos", emprestimoSchema);
