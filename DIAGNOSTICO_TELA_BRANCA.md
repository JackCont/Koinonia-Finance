# Diagnóstico Crítico - Tela Branca nas Provisões

## 🚨 Problema Reportado

**Sintoma:** Ao tentar criar uma provisão, a tela fica branca e ao atualizar volta para a página inicial sem registrar a provisão.

**Causa Provável:** Erro JavaScript não capturado que está quebrando a aplicação React.

---

## 🔍 Passos para Diagnóstico

### 1. Abrir o Console do Navegador

**Antes de criar a provisão:**
1. Pressione **F12** para abrir as Ferramentas de Desenvolvimento
2. Clique na aba **"Console"**
3. Limpe o console (ícone de lixeira 🗑️)

### 2. Tentar Criar a Provisão

1. Vá em **"Provisões"**
2. Clique em **"Nova Provisão"**
3. Preencha os campos:
   - Descrição: "Teste"
   - Valor: R$ 500,00
   - Data: (data atual)
   - Competência: (mês atual)
4. Clique em **"Salvar"**

### 3. Observar o Console

**O que deve aparecer:**
```
💾 Salvando provisão: { id: '...', data: '...', valor: 500, ... }
✅ Provisões após salvar: [ { ... } ]
```

**Se aparecer erro em vermelho:**
- Copie a mensagem de erro completa
- Identifique o arquivo e linha do erro
- Compartilhe para análise

### 4. Verificar localStorage

**No console, execute:**
```javascript
// Verificar se a provisão foi salva
const provisions = JSON.parse(localStorage.getItem('iead_provisions') || '[]');
console.log('Provisões no localStorage:', provisions);
console.log('Quantidade:', provisions.length);

// Se estiver vazio, o problema é no salvamento
// Se tiver dados, o problema é na leitura/renderização
```

---

## 🐛 Possíveis Causas

### Causa 1: Erro no handleSave
**Sintoma:** Console mostra erro ao clicar em "Salvar"
**Solução:** Verificar se todos os campos obrigatórios estão preenchidos

### Causa 2: Erro no saveProvision
**Sintoma:** Console mostra erro ao chamar saveProvision
**Solução:** Verificar se o objeto Provision está completo

### Causa 3: Erro no localStorage
**Sintoma:** localStorage está cheio ou corrompido
**Solução:** Limpar localStorage e tentar novamente

### Causa 4: Erro na renderização
**Sintoma:** Provisão é salva mas não aparece na lista
**Solução:** Verificar se o useEffect está recarregando os dados

---

## 🔧 Correções Aplicadas

### 1. Campo `data` Definido Corretamente
**Antes:**
```typescript
prov['da' + 'ta'] = format(today, 'yyyy-MM-dd');
```

**Depois:**
```typescript
const emptyProvision: Provision = {
  id: '',
  data: format(today, 'yyyy-MM-dd'),
  // ... outros campos
};
```

### 2. Verificação de Segurança no Sort
**Antes:**
```typescript
.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
```

**Depois:**
```typescript
.sort((a, b) => {
  if (!a.data || !b.data) return 0;
  try {
    return new Date(b.data).getTime() - new Date(a.data).getTime();
  } catch {
    return 0;
  }
});
```

### 3. Logs de Debug Adicionados
```typescript
console.log('💾 Salvando provisão:', provision);
saveProvision(provision);
const updatedProvisions = getProvisions();
console.log('✅ Provisões após salvar:', updatedProvisions);
```

---

## 📋 Checklist de Teste

- [ ] Console do navegador aberto (F12)
- [ ] Aba "Console" selecionada
- [ ] Console limpo antes do teste
- [ ] Campos do formulário preenchidos corretamente
- [ ] Botão "Salvar" clicado
- [ ] Logs de debug observados no console
- [ ] localStorage verificado
- [ ] Provisão aparece na lista após salvar

---

## 🎯 Próximos Passos

1. **Executar o teste acima** e compartilhar os logs do console
2. **Verificar localStorage** para confirmar se os dados estão sendo salvos
3. **Analisar erros** se houver mensagens em vermelho no console
4. **Aplicar correções** adicionais conforme necessário

---

## 📞 Suporte

Se o problema persistir após as correções:
1. Tire um screenshot do console com os erros
2. Copie o conteúdo do localStorage (chave `iead_provisions`)
3. Compartilhe as informações para análise detalhada

---

**Data:** 31/01/2026  
**Status:** 🔍 Em diagnóstico  
**Correções Aplicadas:** ✅ Sim  
**Teste Necessário:** ⏳ Aguardando
