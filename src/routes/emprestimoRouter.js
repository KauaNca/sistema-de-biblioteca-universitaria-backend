// src/routes/emprestimoRouter.js
const express = require('express');
const router = express.Router();
const emprestimoController = require('../controllers/emprestimoController');

// ==================== ROTAS PÚBLICAS ====================

// GET /api/emprestimos - Listar todos os empréstimos
router.get('/', emprestimoController.getEmprestimos);

// GET /api/emprestimos/:id - Buscar empréstimo por ID
router.get('/:id', emprestimoController.getEmprestimoById);

// GET /api/emprestimos/aluno/:id - Empréstimos por aluno
router.get('/aluno/:id', emprestimoController.getEmprestimosPorAluno);

// GET /api/emprestimos/livro/:id - Empréstimos por livro
router.get('/livro/:id', emprestimoController.getEmprestimosPorLivro);

// GET /api/emprestimos/estatisticas/geral - Estatísticas
router.get('/estatisticas/geral', emprestimoController.getEstatisticas);

// ==================== ROTAS PROTEGIDAS ====================

// POST /api/emprestimos - Criar novo empréstimo
router.post('/', emprestimoController.criarEmprestimo);

// PUT /api/emprestimos/:id - Atualizar empréstimo
router.put('/:id', emprestimoController.atualizarEmprestimo);

// DELETE /api/emprestimos/:id - Deletar empréstimo
router.delete('/:id', emprestimoController.deletarEmprestimo);

// PATCH /api/emprestimos/:id/devolver - Registrar devolução
router.patch('/:id/devolver', emprestimoController.registrarDevolucao);

// PATCH /api/emprestimos/:id/renovar - Renovar empréstimo
router.patch('/:id/renovar', emprestimoController.renovarEmprestimo);

module.exports = router;