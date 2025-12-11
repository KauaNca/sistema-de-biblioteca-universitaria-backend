require('dotenv').config();
const app = require('./src/app');

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`
  🚀 Sistema de Biblioteca Universitária
  📡 Servidor rodando na porta ${PORT}
  🌐 Modo: ${process.env.NODE_ENV || 'desenvolvimento'}
  🗃️  Banco: ${process.env.MONGODB_URI?.split('/').pop()?.split('?')[0] || 'Não configurado'}
  
  📚 Endpoints disponíveis:
  http://localhost:${PORT}/api/auth
  http://localhost:${PORT}/api/livros
  `);
});

// Tratamento de erros não capturados
process.on('unhandledRejection', (err) => {
  console.log('❌ Erro não tratado:', err.message);
  server.close(() => process.exit(1));
});