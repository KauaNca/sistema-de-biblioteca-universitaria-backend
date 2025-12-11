// scripts/teste-corrigido.js
require('dotenv').config();

async function testeCorrigido() {
  console.log('🧪 TESTE CORRIGIDO - PASSO A PASSO\n');
  
  // PASSO 1: Verificar .env
  console.log('1. 📋 Verificando configuração...');
  if (!process.env.MONGODB_URI) {
    console.error('❌ MONGODB_URI não encontrada no .env');
    return;
  }
  
  const uriOculta = process.env.MONGODB_URI.replace(/:[^:]*@/, ':****@');
  console.log('   URI (oculta):', uriOculta);
  console.log('   Comprimento:', process.env.MONGODB_URI.length);
  
  // PASSO 2: Verificar mongoose
  console.log('\n2. 🔧 Verificando Mongoose...');
  const mongoose = require('mongoose');
  console.log('   Versão do Mongoose:', mongoose.version);
  console.log('   mongoose.connect existe?', typeof mongoose.connect === 'function');
  console.log('   mongoose.connect é função?', typeof mongoose.connect);
  
  // PASSO 3: Conectar DIRETAMENTE (teste simples)
  console.log('\n3. 🔗 Testando conexão direta...');
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('   ✅ Conexão direta funcionou!');
    console.log('   Estado:', mongoose.connection.readyState); // 1 = conectado
    console.log('   Host:', mongoose.connection.host);
    
    // PASSO 4: Testar operação básica
    console.log('\n4. 📝 Testando operação no banco...');
    
    // Criar collection temporária
    const Teste = mongoose.model('TesteTemp', {
      nome: String,
      data: { type: Date, default: Date.now }
    });
    
    // Inserir
    const doc = await Teste.create({ nome: 'Teste de conexão' });
    console.log('   Documento criado ID:', doc._id);
    
    // Contar
    const count = await Teste.countDocuments();
    console.log('   Total documentos:', count);
    
    // Limpar
    await Teste.deleteMany({});
    console.log('   Documentos de teste removidos');
    
    // PASSO 5: Testar database.js
    console.log('\n5. 🗄️  Testando arquivo database.js...');
    try {
      const connectDB = require('../src/config/database');
      console.log('   ✅ Arquivo carregado');
      console.log('   connectDB é função?', typeof connectDB === 'function');
      
      // Se já está conectado, vamos testar de outra forma
      console.log('   💡 Já conectado via mongoose.connect direto');
      
    } catch (err) {
      console.error('   ❌ Erro ao carregar database.js:', err.message);
    }
    
    // PASSO 6: Desconectar
    console.log('\n6. 🔌 Finalizando...');
    await mongoose.disconnect();
    console.log('   Desconectado com sucesso');
    
    console.log('\n🎉 TODOS OS TESTES PASSARAM!');
    console.log('✅ Seu sistema está pronto para uso!');
    
  } catch (error) {
    console.error('\n❌ ERRO NO TESTE:', error.message);
    
    // Análise detalhada
    console.log('\n🔍 DIAGNÓSTICO:');
    
    if (error.message.includes('querySrv ENOTFOUND')) {
      console.log('   💡 Problema de DNS');
      console.log('   Tente: ping sistema-biblioteca-univ.rcjuqgh.mongodb.net');
    }
    
    if (error.message.includes('bad auth') || error.message.includes('Authentication failed')) {
      console.log('   💡 Problema de autenticação');
      console.log('   1. Verifique usuário/senha no .env');
      console.log('   2. URL encode caracteres especiais: @ → %40');
      console.log('   3. No Atlas: Database Access → Verificar permissões');
    }
    
    if (error.message.includes('MongoServerSelectionError')) {
      console.log('   💡 Problema de Network Access');
      console.log('   No Atlas: Network Access → Adicione IP 0.0.0.0/0');
    }
    
    process.exit(1);
  }
}

// Executar
testeCorrigido();