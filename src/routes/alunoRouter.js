const express = require('express');
const router = express.Router();
const alunoController = require('../controllers/alunoController');

// Todas as rotas são públicas (sem autenticação)

// CRUD completo
router.post('/', alunoController.createAluno);      // CREATE
router.get('/', alunoController.getAlunos);         // READ ALL
router.get('/:id', alunoController.getAlunoById);   // READ ONE
router.put('/:id', alunoController.updateAluno);    // UPDATE
router.delete('/:id', alunoController.deleteAluno); // DELETE

module.exports = router;