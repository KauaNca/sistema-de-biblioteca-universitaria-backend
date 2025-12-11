const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { validarCampos } = require('../middlewares/validate');
const {
  registrar,
  getMe,
  atualizarPerfil
} = require('../controllers/alunoController');

// Validações
const validarRegistro = [
  body('nome').notEmpty().withMessage('Nome é obrigatório'),
  body('email').isEmail().withMessage('Email inválido'),
  body('matricula').notEmpty().withMessage('Matrícula é obrigatória'),
  validarCampos
];

// Rotas públicas
router.post('/registrar', validarRegistro, registrar);

// Rotas protegidas
// router.get('/me', protect, getMe);
// router.put('/atualizar', protect, atualizarPerfil);

module.exports = router;