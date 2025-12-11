const Livro = require('../models/Livros');
const Autor = require('../models/Autores');

// GET /api/livros - Listar todos
exports.getLivros = async (req, res) => {
  try {
    const livros = await Livro.find().populate('autor', 'nome nacionalidade');
    
    res.json({
      success: true,
      count: livros.length,
      data: livros
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar livros'
    });
  }
};

// GET /api/livros/:id - Buscar por ID
exports.getLivroById = async (req, res) => {
  try {
    const livro = await Livro.findById(req.params.id).populate('autor');
    
    if (!livro) {
      return res.status(404).json({
        success: false,
        error: 'Livro não encontrado'
      });
    }
    
    res.json({
      success: true,
      data: livro
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar livro'
    });
  }
};

// POST /api/livros - Criar novo
exports.createLivro = async (req, res) => {
  try {
    // Verificar se autor existe
    const autor = await Autor.findById(req.body.autor);
    if (!autor) {
      return res.status(404).json({
        success: false,
        error: 'Autor não encontrado'
      });
    }

    const livro = await Livro.create(req.body);
    
    res.status(201).json({
      success: true,
      data: livro
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'ISBN já cadastrado'
      });
    }
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// PUT /api/livros/:id - Atualizar
exports.updateLivro = async (req, res) => {
  try {
    const livro = await Livro.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!livro) {
      return res.status(404).json({
        success: false,
        error: 'Livro não encontrado'
      });
    }
    
    res.json({
      success: true,
      data: livro
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// DELETE /api/livros/:id - Remover
exports.deleteLivro = async (req, res) => {
  try {
    const livro = await Livro.findByIdAndDelete(req.params.id);
    
    if (!livro) {
      return res.status(404).json({
        success: false,
        error: 'Livro não encontrado'
      });
    }
    
    res.json({
      success: true,
      message: 'Livro removido com sucesso'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};