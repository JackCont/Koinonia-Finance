// Script de emergência para limpar dados corrompidos
// Execute no console do navegador (F12) para resolver tela branca

console.log('🔧 Iniciando limpeza de emergência...');

// Limpar provisões corrompidas
try {
  const provisions = JSON.parse(localStorage.getItem('iead_provisions') || '[]');
  const validProvisions = provisions.filter(p => {
    // Verificar se todos os campos obrigatórios existem
    return p.id && p.data && p.competencia && p.competenciaDestino && 
           typeof p.valor === 'number' && p.descricao && p.status;
  });
  
  localStorage.setItem('iead_provisions', JSON.stringify(validProvisions));
  console.log(`✅ Provisões limpas: ${validProvisions.length} válidas de ${provisions.length} totais`);
} catch (e) {
  console.error('❌ Erro ao limpar provisões:', e);
  localStorage.setItem('iead_provisions', '[]');
}

// Limpar cultos corrompidos
try {
  const cultos = JSON.parse(localStorage.getItem('iead_cultos') || '[]');
  const validCultos = cultos.filter(c => c.id && c.data && c.nome && c.tipo);
  
  localStorage.setItem('iead_cultos', JSON.stringify(validCultos));
  console.log(`✅ Cultos limpos: ${validCultos.length} válidos de ${cultos.length} totais`);
} catch (e) {
  console.error('❌ Erro ao limpar cultos:', e);
  localStorage.setItem('iead_cultos', '[]');
}

console.log('🎉 Limpeza concluída! Recarregue a página (F5)');
