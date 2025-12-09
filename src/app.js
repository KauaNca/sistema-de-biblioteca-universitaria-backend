const express = require("express");
const cors = require("cors");
const connectDB = require("./config/database");

// Importar rotas
const autorRoutes = require("./routes/autorRoutes");
const authRoutes = require("./routes/authRoutes");

// Conectar ao banco de dados
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas
app.use("/api", authRoutes);
app.use("/api", autorRoutes);

// Rota padrão
app.get("/", (req, res) => {
  res.json({ message: "API funcionando!" });
});

// Rota 404
app.use((req, res) => {
  res.status(404).json({ error: "Rota não encontrada" });
});

// Middleware de erro
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Erro interno do servidor" });
});

module.exports = app;
