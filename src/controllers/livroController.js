const Livro = require("../models/Livros");
const Autor = require("../models/Autores");

// @desc    Buscar todos os livros
// @route   GET /api/livros
// @access  Público
exports.getLivros = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      categoria,
      disponivel,
      search,
      sort = "titulo",
    } = req.query;

    // Construir query
    let query = {};

    if (categoria) query.categoria = categoria;
    if (disponivel === "true") query.quantidadeDisponivel = { $gt: 0 };
    if (search) {
      query.$text = { $search: search };
    }

    // Executar query com paginação
    const livros = await Livro.find(query)
      .populate("autor", "nome nacionalidade")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort(sort);

    // Contar total
    const total = await Livro.countDocuments(query);

    res.json({
      success: true,
      count: livros.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: livros,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Erro ao buscar livros",
      detalhes: error.message,
    });
  }
};

// @desc    Buscar livro por ID
// @route   GET /api/livros/:id
// @access  Público
exports.getLivroById = async (req, res) => {
  try {
    const livro = await Livro.findById(req.params.id).populate("autor");

    if (!livro) {
      return res.status(404).json({
        success: false,
        error: "Livro não encontrado",
      });
    }

    res.json({
      success: true,
      data: livro,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Erro ao buscar livro",
    });
  }
};

// @desc    Criar novo livro
// @route   POST /api/livros
// @access  Privado (Administrador)
exports.criarLivro = async (req, res) => {
  try {
    // Verificar se autor existe
    const autor = await Autor.findById(req.body.autor);
    if (!autor) {
      return res.status(404).json({
        success: false,
        error: "Autor não encontrado",
      });
    }

    // Criar livro
    const livro = await Livro.create(req.body);

    // Adicionar livro à lista do autor
    autor.livros.push(livro._id);
    await autor.save();

    res.status(201).json({
      success: true,
      data: livro,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: "ISBN já cadastrado",
      });
    }

    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Atualizar livro
// @route   PUT /api/livros/:id
// @access  Privado (Administrador)
exports.atualizarLivro = async (req, res) => {
  try {
    const livro = await Livro.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!livro) {
      return res.status(404).json({
        success: false,
        error: "Livro não encontrado",
      });
    }

    res.json({
      success: true,
      data: livro,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Deletar livro
// @route   DELETE /api/livros/:id
// @access  Privado (Administrador)
exports.deletarLivro = async (req, res) => {
  try {
    const livro = await Livro.findById(req.params.id);

    if (!livro) {
      return res.status(404).json({
        success: false,
        error: "Livro não encontrado",
      });
    }
    await livro.deleteOne();

    res.json({
      success: true,
      message: "Livro removido com sucesso",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Buscar estatísticas
// @route   GET /api/livros/estatisticas
// @access  Privado
exports.getEstatisticas = async (req, res) => {
  try {
    const totalLivros = await Livro.countDocuments();
    const livrosEmprestados = totalLivros - livrosDisponiveis;

    const categorias = await Livro.aggregate([
      { $group: { _id: "$categoria", total: { $sum: 1 } } },
      { $sort: { total: -1 } },
    ]);

    res.json({
      success: true,
      data: {
        totalLivros,
        livrosEmprestados,
        categorias,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
