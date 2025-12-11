// scripts/teste-simplificado.js
const axios = require('axios');

const API_URL = 'http://localhost:3000/api';

async function testeSimplificado() {
  console.log('🧪 TESTE DA API SIMPLIFICADA\n');
  
  let autorId = '';
  let livroId = '';
  let alunoId = '';
  
  try {
    // 1. Testar API
    console.log('1. 🔗 Testando conexão...');
    const home = await axios.get('http://localhost:3000/');
    console.log(`   ✅ ${home.data.message}\n`);
    
    // 2. Testar Autores
    console.log('2. ✍️  Testando Autores...');
    
    // Criar autor
    const autorData = {
      nome: 'Carlos Drummond de Andrade',
      nacionalidade: 'Brasileiro',
      dataNascimento: '1902-10-31'
    };
    
    const autorRes = await axios.post(`${API_URL}/autores`, autorData);
    autorId = autorRes.data.data._id;
    console.log(`   ✅ Autor criado: ${autorRes.data.data.nome}`);
    
    // Listar autores
    const autores = await axios.get(`${API_URL}/autores`);
    console.log(`   📋 Total autores: ${autores.data.count}\n`);
    
    // 3. Testar Livros
    console.log('3. 📚 Testando Livros...');
    
    // Criar livro
    const livroData = {
      titulo: 'Sentimento do Mundo',
      isbn: '9788525401234',
      autor: autorId,
      categoria: 'Poesia',
      anoPublicacao: 1940
    };
    
    const livroRes = await axios.post(`${API_URL}/livros`, livroData);
    livroId = livroRes.data.data._id;
    console.log(`   ✅ Livro criado: "${livroRes.data.data.titulo}"`);
    
    // Listar livros
    const livros = await axios.get(`${API_URL}/livros`);
    console.log(`   📋 Total livros: ${livros.data.count}`);
    
    // Buscar livro com autor
    const livroComAutor = await axios.get(`${API_URL}/livros/${livroId}`);
    console.log(`   🔍 Livro encontrado: "${livroComAutor.data.data.titulo}"`);
    console.log(`   👤 Autor: ${livroComAutor.data.data.autor?.nome || 'Não populado'}\n`);
    
    // 4. Testar Alunos
    console.log('4. 👥 Testando Alunos...');
    
    // Criar aluno
    const alunoData = {
      nome: 'Ana Silva',
      matricula: '20230001',
      email: 'ana@email.com',
      curso: 'Letras'
    };
    
    const alunoRes = await axios.post(`${API_URL}/alunos`, alunoData);
    alunoId = alunoRes.data.data._id;
    console.log(`   ✅ Aluno criado: ${alunoRes.data.data.nome}`);
    
    // Listar alunos
    const alunos = await axios.get(`${API_URL}/alunos`);
    console.log(`   📋 Total alunos: ${alunos.data.count}\n`);
    
    // 5. Limpar dados de teste
    console.log('5. 🧹 Limpando dados de teste...');
    
    await axios.delete(`${API_URL}/livros/${livroId}`);
    console.log('   ✅ Livro removido');
    
    await axios.delete(`${API_URL}/autores/${autorId}`);
    console.log('   ✅ Autor removido');
    
    await axios.delete(`${API_URL}/alunos/${alunoId}`);
    console.log('   ✅ Aluno removido');
    
    // 6. Verificar limpeza
    console.log('\n6. 📊 Verificando limpeza...');
    
    const finalAutores = await axios.get(`${API_URL}/autores`);
    const finalLivros = await axios.get(`${API_URL}/livros`);
    const finalAlunos = await axios.get(`${API_URL}/alunos`);
    
    console.log(`   Autores: ${finalAutores.data.count}`);
    console.log(`   Livros: ${finalLivros.data.count}`);
    console.log(`   Alunos: ${finalAlunos.data.count}`);
    
    console.log('\n' + '='.repeat(50));
    console.log('🎉 API SIMPLIFICADA FUNCIONANDO PERFEITAMENTE!');
    console.log('='.repeat(50));
    
    console.log('\n🔗 Endpoints disponíveis:');
    console.log('   GET  http://localhost:3000/');
    console.log('   GET  http://localhost:3000/api/autores');
    console.log('   POST http://localhost:3000/api/autores');
    console.log('   GET  http://localhost:3000/api/livros');
    console.log('   POST http://localhost:3000/api/livros');
    console.log('   GET  http://localhost:3000/api/alunos');
    console.log('   POST http://localhost:3000/api/alunos');
    
  } catch (error) {
    console.error('\n❌ ERRO:', error.message);
    
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', error.response.data);
    }
    
    // Tentar limpar se algo deu errado
    try {
      if (livroId) await axios.delete(`${API_URL}/livros/${livroId}`);
      if (autorId) await axios.delete(`${API_URL}/autores/${autorId}`);
      if (alunoId) await axios.delete(`${API_URL}/alunos/${alunoId}`);
    } catch { /* Ignora erros na limpeza */ }
  }
}

// Executar
try {
  require('axios');
  testeSimplificado();
} catch {
  console.log('Instalando axios...');
  const { execSync } = require('child_process');
  execSync('npm install axios', { stdio: 'inherit' });
  console.log('Execute: node scripts/teste-simplificado.js');
}