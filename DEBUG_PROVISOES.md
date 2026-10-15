# Guia de Debug - Sistema de Provisões

## 🔍 Objetivo
Diagnosticar por que as provisões criadas via checkbox não aparecem no módulo de Provisões.

---

## 🛠️ Logs de Debug Adicionados

Foram adicionados logs detalhados no console do navegador para rastrear o fluxo completo:

### 1. No momento de criar a provisão (Transactions.tsx):
```javascript
🔵 Criando provisão automaticamente...
🟢 Nova provisão: { id: '...', data: '...', valor: 500, ... }
🟡 Provisão salva. Recarregando lista...
🟣 Provisões atuais: [ ... ]
```

### 2. Na função saveProvision (store.ts):
```javascript
💾 saveProvision chamado com: { ... }
📋 Provisões existentes antes de salvar: [ ... ]
➕ Adicionando nova provisão
💿 Salvando no localStorage...
✅ Provisão salva com sucesso!
🔍 Verificação - Provisões após salvar: [ ... ]
```

### 3. Na função getProvisions (store.ts):
```javascript
📖 getProvisions retornou: [ ... ]
```

---

## 🧪 Passo a Passo para Debug

### Passo 1: Abrir o Console do Navegador
1. Inicie o aplicativo: `npm run dev` ou `python iniciar.py`
2. Abra o navegador em http://localhost:3000
3. Pressione **F12** para abrir as Ferramentas de Desenvolvimento
4. Clique na aba **"Console"**

### Passo 2: Criar uma Provisão
1. Faça login no sistema
2. Vá em **"Lançamentos"**
3. Clique em **"Novo Lançamento"**
4. Preencha:
   - Tipo: **SAÍDA**
   - Categoria: **Outras Despesas**
   - Descrição: "Teste de debug"
   - Valor: **R$ 500,00**
5. ✅ Marque **"Este lançamento cria uma nova provisão"**
6. Clique em **"Salvar"**

### Passo 3: Verificar os Logs no Console
Após salvar, você deve ver os seguintes logs no console:

```
🔵 Criando provisão automaticamente...
Form data: { tipo: 'SAIDA', ehProvisao: true, valor: 500, ... }
🟢 Nova provisão: { id: 'abc123', data: '2026-01-31', valor: 500, ... }
💾 saveProvision chamado com: { id: 'abc123', ... }
📋 Provisões existentes antes de salvar: []
➕ Adicionando nova provisão
💿 Salvando no localStorage...
✅ Provisão salva com sucesso!
🔍 Verificação - Provisões após salvar: [{ id: 'abc123', ... }]
🟡 Provisão salva. Recarregando lista...
📖 getProvisions retornou: [{ id: 'abc123', ... }]
🟣 Provisões atuais: [{ id: 'abc123', ... }]
```

### Passo 4: Navegar para o Módulo de Provisões
1. Clique em **"Provisões"** no menu lateral
2. Verifique os logs no console:

```
📖 getProvisions retornou: [{ id: 'abc123', ... }]
```

3. ✅ **A provisão deve aparecer na lista!**

---

## 🐛 Possíveis Problemas e Soluções

### Problema 1: Logs não aparecem no console
**Causa:** O código de criação da provisão não está sendo executado

**Solução:**
- Verifique se o checkbox "Este lançamento cria uma nova provisão" está marcado
- Verifique se o tipo é "SAÍDA"
- Verifique se não está editando um lançamento existente (editingId deve ser null)

### Problema 2: Logs aparecem mas provisão não é salva
**Causa:** Erro na função saveProvision

**Solução:**
- Verifique os logs após "💾 saveProvision chamado com:"
- Se não aparecer "✅ Provisão salva com sucesso!", há um erro
- Verifique o console para mensagens de erro em vermelho

### Problema 3: Provisão é salva mas não aparece na lista
**Causa:** getProvisions não está retornando os dados salvos

**Solução:**
- Verifique o log "🔍 Verificação - Provisões após salvar:"
- Se a lista estiver vazia, há um problema com o localStorage
- Verifique o log "📖 getProvisions retornou:" ao navegar para Provisões
- Se estiver vazio, o useEffect não está recarregando os dados

### Problema 4: Provisão aparece no console mas não na tela
**Causa:** O componente não está renderizando os dados

**Solução:**
- Verifique se o estado `provisions` está sendo atualizado
- Recarregue a página (F5)
- Verifique se há erros de renderização no console

---

## 📋 Checklist de Verificação

Execute este checklist após criar uma provisão:

- [ ] Console aberto (F12)
- [ ] Aba "Console" selecionada
- [ ] Checkbox "Este lançamento cria uma nova provisão" marcado
- [ ] Tipo do lançamento: SAÍDA
- [ ] Botão "Salvar" clicado
- [ ] Alerta de confirmação apareceu
- [ ] Logs aparecem no console (🔵, 🟢, 💾, 📋, ➕, 💿, ✅, 🔍, 🟡, 📖, 🟣)
- [ ] Navegou para "Provisões"
- [ ] Log "📖 getProvisions retornou:" aparece com a provisão
- [ ] Provisão aparece na lista visualmente

---

## 🔬 Teste Avançado: Inspecionar localStorage

### Passo 1: Abrir Application Tab
1. Pressione **F12**
2. Clique na aba **"Application"** (ou "Aplicativo")
3. No menu lateral, expanda **"Local Storage"**
4. Clique em **"http://localhost:3000"**

### Passo 2: Verificar Chave de Provisões
1. Procure a chave: **`iead_provisions`**
2. Clique nela
3. No painel direito, você verá o JSON com as provisões salvas

### Passo 3: Verificar Conteúdo
O conteúdo deve ser algo como:
```json
[
  {
    "id": "abc123-def456-...",
    "data": "2026-01-31",
    "competencia": "2026-01",
    "competenciaDestino": "2026-01",
    "valor": 500,
    "descricao": "Teste de debug",
    "categoriaDestino": "OUTRAS_DESPESAS",
    "status": "PENDENTE",
    "congregacao": "Jacuí-MG",
    "observacoes": "Criada automaticamente a partir de lançamento",
    "createdAt": "2026-01-31T10:30:00.000Z",
    "valorUtilizado": 0,
    "saldoDisponivel": 500
  }
]
```

### Passo 4: Verificar se Está Salvando
- ✅ Se o JSON aparece no localStorage, está salvando corretamente
- ❌ Se não aparece, há um problema na função saveProvision

---

## 🎯 Cenários de Teste

### Cenário 1: Criação Básica
1. Crie uma provisão de R$ 500,00
2. Verifique nos logs se foi criada
3. Navegue para Provisões
4. ✅ Deve aparecer na lista

### Cenário 2: Múltiplas Provisões
1. Crie 3 provisões diferentes
2. Verifique nos logs se todas foram criadas
3. Navegue para Provisões
4. ✅ Todas devem aparecer na lista

### Cenário 3: Sincronização entre Abas
1. Abra o app em 2 abas
2. Crie provisão na Aba 1
3. Vá para a Aba 2 → Provisões
4. ✅ Provisão deve aparecer na Aba 2

### Cenário 4: Recarregar Página
1. Crie uma provisão
2. Recarregue a página (F5)
3. Navegue para Provisões
4. ✅ Provisão deve continuar aparecendo

---

## 📊 Resultados Esperados

### Se Tudo Estiver Funcionando:

**No Console:**
```
🔵 Criando provisão automaticamente...
🟢 Nova provisão: { id: '...', valor: 500, ... }
💾 saveProvision chamado com: { ... }
📋 Provisões existentes antes de salvar: []
➕ Adicionando nova provisão
💿 Salvando no localStorage...
✅ Provisão salva com sucesso!
🔍 Verificação - Provisões após salvar: [{ ... }]
🟡 Provisão salva. Recarregando lista...
📖 getProvisions retornou: [{ ... }]
🟣 Provisões atuais: [{ ... }]
```

**No localStorage:**
```json
[
  {
    "id": "...",
    "data": "2026-01-31",
    "valor": 500,
    "status": "PENDENTE",
    ...
  }
]
```

**Na Tela:**
- ✅ Alerta de confirmação aparece
- ✅ Provisão aparece na lista ao navegar para "Provisões"
- ✅ Provisão aparece no Relatório de Provisões

---

## 🚨 Se o Problema Persistir

### Coletar Informações:
1. Tire um screenshot do console com todos os logs
2. Tire um screenshot do localStorage mostrando a chave `iead_provisions`
3. Anote exatamente o que aparece em cada etapa
4. Verifique se há mensagens de erro em vermelho no console

### Enviar para Debug:
Com essas informações, podemos identificar exatamente onde está a falha:
- Se os logs não aparecem → problema no código de criação
- Se os logs aparecem mas não salva → problema na função saveProvision
- Se salva mas não aparece → problema na função getProvisions ou no useEffect
- Se aparece no console mas não na tela → problema de renderização

---

## 💡 Dica Final

Se mesmo com todos os logs o problema persistir, tente:

1. **Limpar o localStorage:**
   - F12 → Application → Local Storage
   - Clique com botão direito → "Clear"
   - Recarregue a página

2. **Desativar extensões do navegador:**
   - Algumas extensões podem interferir no localStorage
   - Teste em modo anônimo

3. **Testar em outro navegador:**
   - Chrome, Firefox, Edge
   - Verificar se o problema é específico do navegador

---

**Data:** 31/01/2026  
**Versão:** 1.1 com Debug  
**Status:** 🔍 Em diagnóstico
