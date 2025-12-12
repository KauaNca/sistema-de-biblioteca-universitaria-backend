// src/controllers/emprestimoController.js
const Emprestimo = require("../models/Emprestimos");
const Livro = require("../models/Livros");
const Aluno = require("../models/Alunos");

// ==================== CRUD BÁSICO ====================

// POST /api/emprestimos - Criar empréstimo
exports.criarEmprestimo = async (req, res) => {
  try {
    const { livro, usuario, dataDevolucaoPrevista, observacoes } = req.body;

    // 🔹 Verificar se livro existe
    const livroExiste = await Livro.findById(livro);
    if (!livroExiste) {
      return res.status(404).json({
        success: false,
        error: "Livro não encontrado",
      });
    }

    // 🔹 Verificar se livro está disponível
    if (!livroExiste.disponivel && livroExiste.disponivel !== undefined) {
      return res.status(400).json({
        success: false,
        error: "Livro não está disponível para empréstimo",
      });
    }

    // 🔹 Verificar se usuário existe
    const usuarioExiste = await Aluno.findById(usuario);
    if (!usuarioExiste) {
      return res.status(404).json({
        success: false,
        error: "Usuário não encontrado",
      });
    }

    // 🔹 Verificar se usuário está ativo
    if (usuarioExiste.status !== "ativo") {
      return res.status(400).json({
        success: false,
        error: "Usuário não está ativo para empréstimos",
      });
    }

    // 🔹 Verificar limite de empréstimos do usuário
    const emprestimosAtivos = await Emprestimo.countDocuments({
      usuario: usuario,
      status: "ativo",
    });

    const limiteEmprestimos = 5; // Limite padrão
    if (emprestimosAtivos >= limiteEmprestimos) {
      return res.status(400).json({
        success: false,
        error: `Usuário atingiu o limite de ${limiteEmprestimos} empréstimos ativos`,
      });
    }

    // 🔹 Criar empréstimo
    const emprestimoData = {
      livro,
      usuario,
      dataDevolucaoPrevista: dataDevolucaoPrevista
        ? new Date(dataDevolucaoPrevista)
        : undefined,
      observacoes,
    };

    const emprestimo = await Emprestimo.create(emprestimoData);

    // 🔹 Atualizar livro como emprestado
    if (livroExiste.disponivel !== undefined) {
      livroExiste.disponivel = false;
      await livroExiste.save();
    }

    // 🔹 Popular dados relacionados
    const emprestimoPopulado = await Emprestimo.findById(emprestimo._id)
      .populate("livro", "titulo isbn categoria")
      .populate("usuario", "nome matricula email");

    res.status(201).json({
      success: true,
      data: emprestimoPopulado,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// GET /api/emprestimos - Listar todos os empréstimos
exports.getEmprestimos = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      usuario,
      livro,
      atrasados,
      sort = "-dataEmprestimo",
    } = req.query;

    // 🔹 Construir query
    let query = {};

    if (status) query.status = status;
    if (usuario) query.usuario = usuario;
    if (livro) query.livro = livro;

    // 🔹 Filtrar atrasados
    if (atrasados === "true") {
      query.status = "atrasado";
    }

    // 🔹 Executar query com paginação
    const emprestimos = await Emprestimo.find(query)
      .populate("livro", "titulo isbn categoria")
      .populate("usuario", "nome matricula email")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort(sort);

    // 🔹 Contar total
    const total = await Emprestimo.countDocuments(query);

    res.json({
      success: true,
      count: emprestimos.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: emprestimos,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Erro ao buscar empréstimos",
    });
  }
};

// GET /api/emprestimos/:id - Buscar empréstimo por ID
exports.getEmprestimoById = async (req, res) => {
  try {
    const emprestimo = await Emprestimo.findById(req.params.id)
      .populate("livro", "titulo isbn categoria anoPublicacao")
      .populate("usuario", "nome matricula email curso telefone");

    if (!emprestimo) {
      return res.status(404).json({
        success: false,
        error: "Empréstimo não encontrado",
      });
    }

    res.json({
      success: true,
      data: emprestimo,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Erro ao buscar empréstimo",
    });
  }
};

// PUT /api/emprestimos/:id - Atualizar empréstimo
exports.atualizarEmprestimo = async (req, res) => {
  try {
    const emprestimo = await Emprestimo.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    )
      .populate("livro", "titulo isbn")
      .populate("usuario", "nome matricula");

    if (!emprestimo) {
      return res.status(404).json({
        success: false,
        error: "Empréstimo não encontrado",
      });
    }

    res.json({
      success: true,
      data: emprestimo,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// DELETE /api/emprestimos/:id - Deletar empréstimo
exports.deletarEmprestimo = async (req, res) => {
  try {
    const emprestimo = await Emprestimo.findById(req.params.id);

    if (!emprestimo) {
      return res.status(404).json({
        success: false,
        error: "Empréstimo não encontrado",
      });
    }

    // 🔹 Verificar se já foi devolvido
    if (!emprestimo.dataDevolucaoReal) {
      return res.status(400).json({
        success: false,
        error:
          "Não é possível deletar um empréstimo ativo. Registre a devolução primeiro.",
      });
    }

    await emprestimo.deleteOne();

    res.json({
      success: true,
      message: "Empréstimo removido com sucesso",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// ==================== OPERAÇÕES ESPECÍFICAS ====================

// PATCH /api/emprestimos/:id/devolver - Registrar devolução
exports.registrarDevolucao = async (req, res) => {
  try {
    const { observacoes } = req.body;

    const emprestimo = await Emprestimo.findById(req.params.id)
      .populate("livro")
      .populate("usuario");

    if (!emprestimo) {
      return res.status(404).json({
        success: false,
        error: "Empréstimo não encontrado",
      });
    }

    // 🔹 Verificar se já foi devolvido
    if (emprestimo.dataDevolucaoReal) {
      return res.status(400).json({
        success: false,
        error: "Este empréstimo já foi devolvido",
      });
    }

    // 🔹 Registrar devolução
    emprestimo.registrarDevolucao(observacoes);
    await emprestimo.save();

    // 🔹 Atualizar livro como disponível
    if (emprestimo.livro && emprestimo.livro.disponivel !== undefined) {
      emprestimo.livro.disponivel = true;
      await emprestimo.livro.save();
    }

    // 🔹 Atualizar contador do usuário
    // (Se você tiver campo emprestimosAtivos no modelo Aluno)

    res.json({
      success: true,
      data: emprestimo,
      message: "Devolução registrada com sucesso",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// PATCH /api/emprestimos/:id/renovar - Renovar empréstimo
exports.renovarEmprestimo = async (req, res) => {
  try {
    const emprestimo = await Emprestimo.findById(req.params.id);

    if (!emprestimo) {
      return res.status(404).json({
        success: false,
        error: "Empréstimo não encontrado",
      });
    }

    // 🔹 Verificar se pode renovar
    if (emprestimo.renovacoes >= 2) {
      return res.status(400).json({
        success: false,
        error: "Limite de renovações atingido (máximo 2)",
      });
    }

    if (emprestimo.status === "atrasado") {
      return res.status(400).json({
        success: false,
        error: "Não é possível renovar empréstimo atrasado",
      });
    }

    // 🔹 Renovar (adiciona 15 dias)
    const novaDataPrevista = new Date(emprestimo.dataDevolucaoPrevista);
    novaDataPrevista.setDate(novaDataPrevista.getDate() + 15);

    emprestimo.dataDevolucaoPrevista = novaDataPrevista;
    emprestimo.renovacoes += 1;
    emprestimo.status = "renovado";

    await emprestimo.save();

    res.json({
      success: true,
      data: emprestimo,
      message: "Empréstimo renovado com sucesso",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// GET /api/emprestimos/aluno/:id - Buscar empréstimos por aluno
exports.getEmprestimosPorAluno = async (req, res) => {
  try {
    const alunoId = req.params.id;
    const { status, ativos } = req.query;

    let query = { usuario: alunoId };

    if (status) {
      query.status = status;
    } else if (ativos === "true") {
      query.status = { $in: ["ativo", "renovado", "atrasado"] };
    }

    const emprestimos = await Emprestimo.find(query)
      .populate("livro", "titulo isbn categoria")
      .sort("-dataEmprestimo");

    res.json({
      success: true,
      count: emprestimos.length,
      data: emprestimos,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Erro ao buscar empréstimos do aluno",
    });
  }
};

// GET /api/emprestimos/livro/:id - Buscar empréstimos por livro
exports.getEmprestimosPorLivro = async (req, res) => {
  try {
    const livroId = req.params.id;

    const emprestimos = await Emprestimo.find({ livro: livroId })
      .populate("usuario", "nome matricula email")
      .sort("-dataEmprestimo");

    res.json({
      success: true,
      count: emprestimos.length,
      data: emprestimos,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Erro ao buscar histórico do livro",
    });
  }
};

// GET /api/emprestimos/estatisticas/geral - Estatísticas gerais
exports.getEstatisticas = async (req, res) => {
  try {
    const totalEmprestimos = await Emprestimo.countDocuments();
    const emprestimosAtivos = await Emprestimo.countDocuments({
      status: { $in: ["ativo", "renovado"] },
    });
    const emprestimosAtrasados = await Emprestimo.countDocuments({
      status: "atrasado",
    });
    const emprestimosDevolvidos = await Emprestimo.countDocuments({
      status: "devolvido",
    });

    // Empréstimos por mês (últimos 6 meses)
    const seisMesesAtras = new Date();
    seisMesesAtras.setMonth(seisMesesAtras.getMonth() - 6);

    const emprestimosPorMes = await Emprestimo.aggregate([
      {
        $match: {
          dataEmprestimo: { $gte: seisMesesAtras },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$dataEmprestimo" },
            month: { $month: "$dataEmprestimo" },
          },
          total: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
      {
        $limit: 6,
      },
    ]);

    // Livros mais emprestados
    const livrosMaisEmprestados = await Emprestimo.aggregate([
      {
        $group: {
          _id: "$livro",
          total: { $sum: 1 },
        },
      },
      {
        $sort: { total: -1 },
      },
      {
        $limit: 10,
      },
      {
        $lookup: {
          from: "livros",
          localField: "_id",
          foreignField: "_id",
          as: "livroInfo",
        },
      },
      {
        $unwind: "$livroInfo",
      },
      {
        $project: {
          livro: "$livroInfo.titulo",
          total: 1,
        },
      },
    ]);

    // Alunos que mais emprestam
    const alunosMaisEmprestam = await Emprestimo.aggregate([
      {
        $group: {
          _id: "$usuario",
          total: { $sum: 1 },
        },
      },
      {
        $sort: { total: -1 },
      },
      {
        $limit: 10,
      },
      {
        $lookup: {
          from: "alunos",
          localField: "_id",
          foreignField: "_id",
          as: "alunoInfo",
        },
      },
      {
        $unwind: "$alunoInfo",
      },
      {
        $project: {
          aluno: "$alunoInfo.nome",
          matricula: "$alunoInfo.matricula",
          total: 1,
        },
      },
    ]);

    res.json({
      success: true,
      data: {
        totais: {
          total: totalEmprestimos,
          ativos: emprestimosAtivos,
          atrasados: emprestimosAtrasados,
          devolvidos: emprestimosDevolvidos,
        },
        emprestimosPorMes,
        livrosMaisEmprestados,
        alunosMaisEmprestam,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
