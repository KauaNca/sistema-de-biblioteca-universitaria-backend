const { validationResult } = require('express-validator');

exports.validarCampos = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map(err => ({
        campo: err.param,
        mensagem: err.msg
      }))
    });
  }
  
  next();
};