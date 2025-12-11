// server.js - VERSÃO ATUALIZADA PARA SUA ESTRUTURA
require('dotenv').config();
const app = require('./src/app');

const PORT = process.env.PORT || 3000; // Mudei para 3000 como padrão

const server = app.listen(PORT, () => {
  console.log(`
  🚀 SISTEMA DE BIBLIOTECA UNIVERSITÁRIA
  📡 Servidor rodando na porta ${PORT}
  🌐 Modo: ${process.env.NODE_ENV || 'desenvolvimento'}
  
  📚 ENDPOINTS DISPONÍVEIS:
  ========================================
  🌐 Página inicial:    http://localhost:${PORT}/
  📚 Livros:           http://localhost:${PORT}/api/livros
  ✍️  Autores:          http://localhost:${PORT}/api/autores
  👥 Alunos:           http://localhost:${PORT}/api/alunos
  ========================================
  `);
});

// Tratamento de erro de porta em uso
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`
    ❌ ERRO: Porta ${PORT} já está em uso!
    
    💡 SOLUÇÕES:
    1. Feche o terminal que está rodando o servidor (Ctrl+C)
    2. Ou use outra porta: PORT=3001 npm run dev
    3. Ou mate o processo:
       Linux/Mac:  sudo fuser -k ${PORT}/tcp
       Windows:    netstat -ano | findstr :${PORT}
    `);
    process.exit(1);
  }
});

// Fechar graciosamente com Ctrl+C
process.on('SIGINT', () => {
  console.log('\n\n👋 Encerrando servidor...');
  server.close(() => {
    console.log('✅ Servidor fechado com sucesso!');
    process.exit(0);
  });
});

// Tratamento de erros não capturados
process.on('unhandledRejection', (err) => {
  console.error('\n❌ ERRO NÃO TRATADO:', err.message);
  console.error('Stack trace:', err.stack);
  server.close(() => process.exit(1));
});