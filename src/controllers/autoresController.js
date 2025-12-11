const Autor = require("../models/Autores");

// POST /api/autores - Criar autor
exports.createAutor = async (req, res) => {
  try {
    const autor = await Autor.create(req.body);
    res.status(201).json({ 
      success: true, 
      data: autor 
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      error: error.message 
    });
  }
};

// GET /api/autores - Listar todos
exports.getAutores = async (req, res) => {
  try {
    const autores = await Autor.find();
    res.json({ 
      success: true, 
      count: autores.length,
      data: autores 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

// GET /api/autores/:id - Buscar por ID
exports.getAutorById = async (req, res) => {
  try {
    const autor = await Autor.findById(req.params.id);
    
    if (!autor) {
      return res.status(404).json({ 
        success: false, 
        error: "Autor não encontrado" 
      });
    }
    
    res.json({ 
      success: true, 
      data: autor 
    });
    
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

// PUT /api/autores/:id - Atualizar
exports.updateAutor = async (req, res) => {
  try {
    const autor = await Autor.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );
    
    if (!autor) {
      return res.status(404).json({ 
        success: false, 
        error: "Autor não encontrado" 
      });
    }
    
    res.json({ 
      success: true, 
      data: autor 
    });
    
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      error: error.message 
    });
  }
};

// DELETE /api/autores/:id - Deletar
exports.deleteAutor = async (req, res) => {
  try {
    const autor = await Autor.findByIdAndDelete(req.params.id);
    
    if (!autor) {
      return res.status(404).json({ 
        success: false, 
        error: "Autor não encontrado" 
      });
    }
    
    res.json({ 
      success: true, 
      message: "Autor deletado com sucesso" 
    });
    
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};