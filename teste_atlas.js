// teste_atlas.js - VERSÃO CORRIGIDA
require('dotenv').config();
const mongoose = require('mongoose');

async function testAtlasConnection() {
  console.log('🧪 Testando conexão com MongoDB Atlas...');
  console.log('📋 URI (oculta):', process.env.MONGODB_URI?.replace(/:[^:]*@/, ':****@'));
  
  try {
    // ✅ CONEXÃO SIMPLIFICADA - Sem opções desnecessárias
    await mongoose.connect(process.env.MONGODB_URI);
    
    console.log('✅ Conexão estabelecida!');
    console.log(`🏷️  Nome do banco: ${mongoose.connection.db?.databaseName || 'default'}`);
    
    // Testar operações básicas
    console.log('\n🔍 Testando operações CRUD...');
    
    // 1. Criar uma coleção de teste
    const TestSchema = new mongoose.Schema({
      message: { type: String, required: true },
      timestamp: { type: Date, default: Date.now }
    });
    
    // 2. Evitar erro "Cannot overwrite model"
    const Test = mongoose.models.Test || mongoose.model('Test', TestSchema);
    
    // 3. Inserir documento
    const doc = await Test.create({ 
      message: 'Teste de conexão com Atlas!' 
    });
    console.log(`📝 Documento criado ID: ${doc._id}`);
    
    // 4. Buscar documento
    const found = await Test.findById(doc._id);
    console.log(`🔎 Documento encontrado: "${found.message}"`);
    
    // 5. Contar documentos
    const count = await Test.countDocuments();
    console.log(`📊 Total na coleção 'tests': ${count}`);
    
    // 6. Limpar teste
    await Test.deleteMany({});
    console.log('🧹 Testes limpos');
    
    // 7. Listar coleções
    console.log('\n🗃️  Coleções disponíveis:');
    const collections = await mongoose.connection.db.listCollections().toArray();
    collections.forEach(col => console.log(`  - ${col.name}`));
    
    // 8. Desconectar
    await mongoose.disconnect();
    console.log('\n🔌 Desconectado com sucesso!');
    
  } catch (error) {
    console.error('\n❌ ERRO:', error.message);
    console.error('Stack:', error.stack?.split('\n')[0]); // Primeira linha do stack
    
    // Análise detalhada do erro
    if (error.message.includes('ENOTFOUND')) {
      console.log('\n💡 SOLUÇÃO: Problema de DNS/Internet');
      console.log('  Verifique sua conexão com a internet');
    }
    
    if (error.message.includes('bad auth') || error.message.includes('Authentication failed')) {
      console.log('\n💡 SOLUÇÃO: Autenticação');
      console.log('  1. Verifique a string de conexão no .env');
      console.log('  2. Formatos válidos:');
      console.log('     mongodb+srv://usuario:senha@cluster.mongodb.net/nomedobanco');
      console.log('  3. Caracteres especiais → URL encode');
      console.log('     @ → %40, # → %23, / → %2F');
    }
    
    if (error.message.includes('MongoServerSelectionError')) {
      console.log('\n💡 SOLUÇÃO: Network Access');
      console.log('  1. No Atlas, vá em Network Access');
      console.log('  2. Adicione seu IP atual OU');
      console.log('  3. Use "Allow Access from Anywhere" (0.0.0.0/0) TEMPORARIAMENTE');
    }
  }
}

// Executar teste
testAtlasConnection();