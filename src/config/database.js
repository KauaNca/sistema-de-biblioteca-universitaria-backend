// src/config/database.js - VERSÃO FUNCIONAL
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    console.log('🔗 Conectando ao MongoDB Atlas...');
    
    // Conexão SIMPLES - Mongoose 6+ não precisa de opções
    await mongoose.connect(process.env.MONGODB_URI);
    
    console.log('✅ MongoDB Atlas conectado com sucesso!');
    console.log(`📊 Banco: ${mongoose.connection.db?.databaseName || 'default'}`);
    
    return true;
    
  } catch (error) {
    console.error('❌ Erro ao conectar ao MongoDB:');
    console.error('   Mensagem:', error.message);
    
    // Diagnóstico
    if (error.message.includes('bad auth')) {
      console.log('💡 Dica: Verifique usuário e senha no .env');
    }
    if (error.message.includes('ENOTFOUND')) {
      console.log('💡 Dica: Problema de internet/DNS');
    }
    
    process.exit(1);
  }
};

// Exporta a FUNÇÃO de conexão
module.exports = connectDB;