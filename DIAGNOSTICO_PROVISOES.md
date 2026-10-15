# Diagnóstico Completo - Bug de Provisões

## 🔍 Status do Problema

O bug persiste: provisões criadas via checkbox não aparecem no módulo de Provisões.

---

## 📋 Checklist de Verificação

### 1. Verificar se o Checkbox está Funcionando

**Teste:**
1. Abra o console do navegador (F12)
2. Vá em "Lançamentos" → "Novo Lançamento"
3. Selecione Tipo: **SAÍDA**
4. Marque o checkbox "Este lançamento cria uma nova provisão"
5. **Verifique no console:**

```
🔵 Checkbox "ehProvisao" alterado para: true
🔵 Estado atual do form: { ..., ehProvisao: true, ... }
```

**Se NÃO aparecer:**
- O checkbox não está funcionando
- Problema no React state

**Se aparecer:**
- O checkbox está funcionando
- Problema está em outra parte do fluxo

---

### 2. Verificar se o handleSave está sendo Chamado

**Teste:**
1. Preencha os campos do lançamento
2. Clique em "Salvar"
3. **Verifique no console:**

```
🔍 handleSave chamado
📋 Form completo: { ..., ehProvisao: true, tipo: 'SAIDA', ... }
📋 editingId: null
```

**Se NÃO aparecer:**
- O botão "Salvar" não está funcionando
- Problema no evento onClick

**Se aparecer:**
- O handleSave está sendo chamado
- Verifique os valores do form

---

### 3. Verificar as Condições para Criar Provisão

**Teste:**
Após o handleSave ser chamado, verifique no console:

```
🔍 Verificando condições para criar provisão:
  - form.tipo === "SAIDA": true (valor: SAIDA)
  - form.ehProvisao: true
  - !editingId: true (valor: null)
  - Condição completa: true
```

**Se a condição completa for FALSE:**
- Identifique qual condição está falhando
- Corrija o valor correspondente

**Se a condição completa for TRUE:**
- A provisão DEVERIA ser criada
- Problema está na criação ou salvamento

---

### 4. Verificar se a Provisão está sendo Criada

**Teste:**
Se a condição for atendida, verifique no console:

```
✅ Condição atendida! Criando provisão automaticamente...
✅ Dados do formulário: { tipo: 'SAIDA', ehProvisao: true, ... }
🟢 Nova provisão criada: { id: '...',  '...', valor: 500, ... }
🟢 Campo data: 2026-01-31
🟢 Todas as chaves: ['id', 'data', 'competencia', ...]
```

**Se NÃO aparecer:**
- O código de criação não está sendo executado
- Problema na lógica condicional

**Se aparecer:**
- A provisão está sendo criada corretamente
- Problema está no salvamento

---

### 5. Verificar se a Provisão está sendo Salva

**Teste:**
Após a criação, verifique no console:

```
💾 Chamando saveProvision...
💾 saveProvision chamado com: { id: '...',  '...', ... }
📋 Provisões existentes antes de salvar: []
➕ Adicionando nova provisão
💿 Salvando no localStorage...
✅ Provisão salva com sucesso!
🔍 Verificação - Provisões após salvar: [{ id: '...', ... }]
```

**Se NÃO aparecer:**
- A função saveProvision não está sendo chamada
- Problema na importação ou chamada

**Se aparecer mas "Verificação" mostrar lista vazia:**
- O localStorage não está salvando
- Problema na função saveToStorage

---

### 6. Verificar se a Lista está sendo Atualizada

**Teste:**
Após o salvamento, verifique no console:

```
🟡 Provisão salva. Recarregando lista...
📖 getProvisions retornou: [{ id: '...', ... }]
🟣 Provisões atuais: [{ id: '...', ... }]
🟣 Quantidade de provisões: 1
```

**Se getProvisions retornar lista vazia:**
- O localStorage não tem os dados
- Problema na função getProvisions ou saveToStorage

**Se getProvisions retornar a provisão:**
- Os dados estão no localStorage
- Problema na atualização do estado React

---

### 7. Verificar se a UI está Atualizando

**Teste:**
1. Após criar a provisão, navegue para "Provisões"
2. **Verifique no console:**

```
📖 getProvisions retornou: [{ id: '...', ... }]
```

**Se a lista estiver vazia:**
- O componente não está recarregando os dados
- Problema no useEffect ou na renderização

**Se a lista tiver a provisão:**
- Os dados estão sendo carregados
- Problema na renderização da UI

---

## 🐛 Possíveis Causas e Soluções

### Causa 1: Checkbox não marca
**Sintoma:** Console não mostra logs do checkbox
**Solução:** Verificar se o estado `form.ehProvisao` está sendo inicializado corretamente

### Causa 2: handleSave não é chamado
**Sintoma:** Console não mostra logs do handleSave
**Solução:** Verificar se o botão "Salvar" tem o onClick correto

### Causa 3: Condição não é atendida
**Sintoma:** Console mostra "Condição NÃO atendida"
**Solução:** Verificar os valores de `form.tipo`, `form.ehProvisao` e `editingId`

### Causa 4: Provisão não é criada
**Sintoma:** Console não mostra "Nova provisão criada"
**Solução:** Verificar se o código de criação está sendo executado

### Causa 5: Provisão não é salva
**Sintoma:** Console mostra criação mas não salvamento
**Solução:** Verificar se saveProvision está sendo chamada

### Causa 6: localStorage não salva
**Sintoma:** Console mostra salvamento mas verificação falha
**Solução:** Verificar se saveToStorage está funcionando

### Causa 7: Estado não atualiza
**Sintoma:** Console mostra dados salvos mas UI não atualiza
**Solução:** Verificar se setProvisions está sendo chamado

---

## 🔬 Teste Completo

### Passo a Passo:

1. **Abra o console do navegador (F12)**

2. **Crie um lançamento:**
   - Tipo: SAÍDA
   - Categoria: Outras Despesas
   - Descrição: "Teste de provisão"
   - Valor: R$ 500,00
   - ✅ Marque "Este lançamento cria uma nova provisão"

3. **Observe os logs no console:**

```
🔵 Checkbox "ehProvisao" alterado para: true
🔵 Estado atual do form: { ehProvisao: true, ... }

[Click em Salvar]

🔍 handleSave chamado
📋 Form completo: { ehProvisao: true, tipo: 'SAIDA', ... }
📋 editingId: null
🔍 Verificando condições para criar provisão:
  - form.tipo === "SAIDA": true
  - form.ehProvisao: true
  - !editingId: true
  - Condição completa: true
✅ Condição atendida! Criando provisão automaticamente...
🟢 Nova provisão criada: { id: '...',  '...', valor: 500, ... }
💾 Chamando saveProvision...
💾 saveProvision chamado com: { ... }
📋 Provisões existentes antes de salvar: []
➕ Adicionando nova provisão
💿 Salvando no localStorage...
✅ Provisão salva com sucesso!
🔍 Verificação - Provisões após salvar: [{ ... }]
🟡 Provisão salva. Recarregando lista...
📖 getProvisions retornou: [{ ... }]
🟣 Provisões atuais: [{ ... }]
🟣 Quantidade de provisões: 1
✅ Provisão criada com sucesso!
```

4. **Navegue para "Provisões":**

```
📖 getProvisions retornou: [{ ... }]
```

5. **Verifique se a provisão aparece na lista**

---

## 📊 Resultado Esperado

Se todos os logs aparecerem corretamente E a provisão aparecer na lista:
- ✅ **BUG RESOLVIDO**

Se algum log NÃO aparecer OU a provisão NÃO aparecer na lista:
- ❌ **BUG PERSISTE**
- Identifique qual etapa falhou
- Use a seção "Possíveis Causas e Soluções"

---

## 🎯 Ação Requerida

**Execute o teste completo acima e compartilhe:**

1. **Todos os logs do console** (copie e cole)
2. **Em qual etapa o fluxo para** (se parar)
3. **Se a provisão aparece na lista** (sim/não)

Com essas informações, podemos identificar exatamente onde está o problema e corrigi-lo definitivamente.

---

**Data:** 31/01/2026  
**Status:** 🔍 Em diagnóstico  
**Próximo passo:** Executar teste completo e coletar logs
