const Aluno = require('../models/Alunos');

// POST /api/alunos - Criar aluno
exports.createAluno = async (req, res) => {
  try {
    const aluno = await Aluno.create(req.body);
    
    res.status(201).json({
      success: true,
      data: aluno
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'Email ou matrícula já cadastrados'
      });
    }
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// GET /api/alunos - Listar todos
exports.getAlunos = async (req, res) => {
  try {
    const alunos = await Aluno.find();
    
    res.json({
      success: true,
      count: alunos.length,
      data: alunos
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar alunos'
    });
  }
};

// GET /api/alunos/:id - Buscar por ID
exports.getAlunoById = async (req, res) => {
  try {
    const aluno = await Aluno.findById(req.params.id);
    
    if (!aluno) {
      return res.status(404).json({
        success: false,
        error: 'Aluno não encontrado'
      });
    }
    
    res.json({
      success: true,
      data: aluno
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar aluno'
    });
  }
};

// PUT /api/alunos/:id - Atualizar
exports.updateAluno = async (req, res) => {
  try {
    const aluno = await Aluno.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!aluno) {
      return res.status(404).json({
        success: false,
        error: 'Aluno não encontrado'
      });
    }
    
    res.json({
      success: true,
      data: aluno
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// DELETE /api/alunos/:id - Remover
exports.deleteAluno = async (req, res) => {
  try {
    const aluno = await Aluno.findByIdAndDelete(req.params.id);
    
    if (!aluno) {
      return res.status(404).json({
        success: false,
        error: 'Aluno não encontrado'
      });
    }
    
    res.json({
      success: true,
      message: 'Aluno removido com sucesso'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};