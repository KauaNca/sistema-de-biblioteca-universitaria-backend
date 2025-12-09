const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    console.log('🔗 Conectando ao MongoDB Atlas...');
    
    // ✅ FORMA CORRETA (Mongoose 6+):
    await mongoose.connect(process.env.MONGODB_URI);
    
    console.log('✅ MongoDB Atlas conectado!');
    console.log(`📊 Banco: ${mongoose.connection.db?.databaseName || 'não identificado'}`);
    console.log(`📍 Host: ${mongoose.connection.host}`);
    
  } catch (error) {
    console.error('❌ Erro de conexão:', error.message);
    
    // Dicas específicas
    if (error.message.includes('Authentication failed')) {
      console.log('🔐 Problema de autenticação:');
      console.log('  1. Verifique usuário/senha no .env');
      console.log('  2. No Atlas: Database Access → Verifique permissões');
      console.log('  3. Caracteres especiais na senha? Use URL encoding');
    }
    
    process.exit(1);
  }
};

module.exports = connectDB;