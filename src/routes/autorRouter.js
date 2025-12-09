const express = require('express');
const router = express.Router();
const autoresController = require('../controllers/autoresController');

// Rotas CRUD Autor
router.post('/autor', autoresController.createUser);
router.get('/autor', autoresController.getautor);
router.get('/autor/:id', autoresController.getUserById);
router.put('/autor/:id', autoresController.updateUser);
router.delete('/autor/:id', autoresController.deleteUser);

module.exports = router;