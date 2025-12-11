// routes/autorRouter.js - COM NOMES CORRETOS
const express = require('express');
const router = express.Router();
const autorController = require('../controllers/autoresController');

// Rotas públicas
router.get('/', autorController.getAutores);
router.get('/:id', autorController.getAutorById);

// Rotas protegidas
router.post('/', autorController.createAutor);      // ← NOME CORRETO
router.put('/:id', autorController.updateAutor);    // ← NOME CORRETO
router.delete('/:id', autorController.deleteAutor); // ← NOME CORRETO

module.exports = router;