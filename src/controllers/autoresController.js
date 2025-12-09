const Autor = require("../models/Autores");

// Criar autor
// Método para exportar para o routes
exports.createAutor = async (req, res) => {
  try {
    const autor = new Autor(req.body);
    await autor.save();
    res.status(201).json({ success: true, data: autor });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Listar todos os autores
exports.getAutores = async (req, res) => {
  try {
    const autores = await Autor.find();
    res.json({ success: true, data: autores });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Buscar autor por ID
exports.getAutorById = async (req, res) => {
  try {
    const autor = await Autor.findById(req.params.id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, error: "Autor não encontrado" });
    }
    res.json({ success: true, data: autor });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Atualizar autor
exports.updateAutor = async (req, res) => {
  try {
    const autor = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, error: "Autor não encontrado" });
    }
    res.json({ success: true, data: autor });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Deletar autor
exports.deleteAutor = async (req, res) => {
  try {
    const autor = await Autor.findByIdAndDelete(req.params.id);
    if (!autor) {
      return res
        .status(404)
        .json({ success: false, error: "Autor não encontrado" });
    }
    res.json({ success: true, message: "Autor deletado com sucesso" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
