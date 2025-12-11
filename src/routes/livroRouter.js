const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const { validarCampos } = require("../middlewares/validate");
const {
  getLivros,
  getLivroById,
  criarLivro,
  atualizarLivro,
  deletarLivro,
  getEstatisticas,
} = require("../controllers/livroController");
// Validações
const validarLivro = [
  body("titulo").notEmpty().withMessage("Título é obrigatório"),
  body("isbn")
    .matches(/^(?:\d{10}|\d{13})$/)
    .withMessage("ISBN inválido"),
  body("autor").isMongoId().withMessage("ID do autor inválido"),
  validarCampos,
];

// Rotas públicas
router.get("/", getLivros);
router.get("/:id", getLivroById);

// Apenas administradores
router.post("/", validarLivro, criarLivro);
router.put("/:id", validarLivro, atualizarLivro);
router.delete("/:id", deletarLivro);
router.get("/estatisticas/geral", getEstatisticas);

module.exports = router;
