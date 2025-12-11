const Usuario = require("../models/Alunos");
const jwt = require("jsonwebtoken");

// Gerar token JWT
const gerarToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// @desc    Registrar usuário
// @route   POST /api/auth/registrar
// @access  Público
exports.registrar = async (req, res) => {
  try {
    const { nome, matricula, email } = req.body;

    // Verificar se usuário já existe
    const usuarioExiste = await Usuario.findOne({
      $or: [{ email }, { matricula }],
    });

    if (usuarioExiste) {
      return res.status(400).json({
        success: false,
        error: "Email ou matrícula já cadastrados",
      });
    }

    // Criar usuário
    const usuario = await Usuario.create({
      nome,
      matricula,
      email,
    });

    // Retornar token
    const token = gerarToken(usuario._id);

    res.status(201).json({
      success: true,
      token,
      usuario: {
        id: usuario._id,
        nome: usuario.nome,
        email: usuario.email,
        matricula: usuario.matricula,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Obter perfil do usuário logado
// @route   GET /api/auth/me
// @access  Privado
exports.getMe = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.usuario.id);

    res.json({
      success: true,
      data: usuario,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Atualizar perfil
// @route   PUT /api/auth/atualizar
// @access  Privado
exports.atualizarPerfil = async (req, res) => {
  try {
    const camposParaAtualizar = {
      nome: req.body.nome,
      email: req.body.email,
      telefone: req.body.telefone,
    };

    // Remover campos undefined
    Object.keys(camposParaAtualizar).forEach(
      (key) =>
        camposParaAtualizar[key] === undefined &&
        delete camposParaAtualizar[key]
    );

    const usuario = await Usuario.findByIdAndUpdate(
      req.usuario.id,
      camposParaAtualizar,
      {
        new: true,
        runValidators: true,
      }
    );

    res.json({
      success: true,
      data: usuario,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};
