# Guia de Teste - Sistema de Provisões

## 🎯 Objetivo
Verificar se as provisões criadas via checkbox no módulo de Lançamentos aparecem corretamente no módulo de Provisões e no Relatório de Provisões.

---

## ✅ Pré-requisitos
- Aplicativo compilado e rodando (`npm run dev` ou `python iniciar.py`)
- Acesso ao navegador em http://localhost:3000
- Usuário logado (admin/admin123)

---

## 🧪 Teste 1: Criar Provisão via Checkbox

### Passo 1: Acessar Módulo de Lançamentos
1. Faça login no sistema
2. Clique em **"Lançamentos"** no menu lateral
3. Verifique se a página carregou corretamente

### Passo 2: Criar Novo Lançamento
1. Clique no botão **"Novo Lançamento"**
2. Preencha os campos:
   - **Tipo:** SAÍDA
   - **Data:** (data atual)
   - **Competência:** (mês atual)
   - **Categoria:** DESPESA_DIVERSAS (ou qualquer outra de saída)
   - **Descrição:** "Teste de provisão automática"
   - **Congregação:** (selecione uma congregação)
   - **Valor:** R$ 500,00

### Passo 3: Marcar Checkbox de Provisão
1. Role até a seção **"Controle de Provisões"**
2. Marque o checkbox: **"☑ Este lançamento cria uma nova provisão"**
3. Clique em **"Salvar"**

### Passo 4: Verificar Alerta de Confirmação
1. ✅ Deve aparecer um alerta: **"✅ Provisão criada com sucesso! Acesse o módulo de Provisões para visualizar."**
2. Clique em **"OK"** no alerta

### Passo 5: Navegar para Módulo de Provisões
1. Clique em **"Provisões"** no menu lateral
2. ✅ **VERIFICAÇÃO CRÍTICA:** A provisão criada deve aparecer na lista!

### Passo 6: Verificar Detalhes da Provisão
1. Localize a provisão na lista
2. Verifique os campos:
   - **Descrição:** "Teste de provisão automática"
   - **Valor:** R$ 500,00
   - **Status:** PENDENTE
   - **Competência:** (mês atual)
   - **Saldo Disponível:** R$ 500,00

---

## 🧪 Teste 2: Verificar no Relatório de Provisões

### Passo 1: Acessar Relatório
1. Clique em **"Relatórios"** no menu lateral
2. Selecione o tipo: **"Relatório de Provisões"**

### Passo 2: Verificar Provisão no Relatório
1. ✅ **VERIFICAÇÃO CRÍTICA:** A provisão criada deve aparecer no relatório!
2. Verifique as seções:
   - **Provisões por Mês de Destino**
   - **Provisões por Categoria de Destino**

### Passo 3: Verificar Totais
1. Verifique se os totais estão corretos:
   - **Total de Provisões:** deve incluir a provisão criada
   - **Total Pendente:** R$ 500,00
   - **Total Utilizado:** R$ 0,00

---

## 🧪 Teste 3: Sincronização em Tempo Real

### Passo 1: Abrir Duas Abas
1. Abra o aplicativo em **duas abas diferentes** do navegador
2. Faça login em ambas as abas

### Passo 2: Criar Provisão na Aba 1
1. Na **Aba 1**, vá em "Lançamentos"
2. Crie um novo lançamento marcando "Este lançamento cria uma nova provisão"
3. Valor: R$ 300,00
4. Salve

### Passo 3: Verificar na Aba 2
1. Na **Aba 2**, vá em "Provisões"
2. ✅ **VERIFICAÇÃO CRÍTICA:** A provisão criada na Aba 1 deve aparecer na Aba 2!
3. Se não aparecer imediatamente, clique em qualquer lugar da página ou aguarde 1-2 segundos

### Passo 4: Testar Foco da Janela
1. Na **Aba 2**, mude para outra janela (minimize ou abra outro aplicativo)
2. Volte para a **Aba 2** (dê foco novamente)
3. ✅ A lista de provisões deve ser recarregada automaticamente

---

## 🧪 Teste 4: Utilizar Provisão Existente

### Passo 1: Criar Novo Lançamento Usando Provisão
1. Vá em "Lançamentos"
2. Clique em "Novo Lançamento"
3. Preencha:
   - **Tipo:** SAÍDA
   - **Categoria:** DESPESA_AGUA (ou qualquer outra)
   - **Descrição:** "Conta de água usando provisão"
   - **Valor:** R$ 200,00
4. Marque: **"☑ Este lançamento utiliza provisão existente"**

### Passo 2: Selecionar Provisão
1. Na seção **"Provisões Disponíveis"**, a provisão criada no Teste 1 deve aparecer
2. Marque o checkbox da provisão
3. Informe o valor a utilizar: **R$ 200,00**
4. Marque: **"☑ Afetar fluxo de caixa"** (opcional)
5. Clique em **"Salvar"**

### Passo 3: Verificar Atualização da Provisão
1. Vá em "Provisões"
2. ✅ A provisão deve ter:
   - **Valor Utilizado:** R$ 200,00
   - **Saldo Disponível:** R$ 300,00 (500 - 200)
   - **Status:** PENDENTE (ainda tem saldo)

---

## 🧪 Teste 5: Provisão Totalmente Utilizada

### Passo 1: Utilizar Restante da Provisão
1. Vá em "Lançamentos"
2. Crie novo lançamento:
   - **Valor:** R$ 300,00
   - Marque: **"☑ Este lançamento utiliza provisão existente"**
3. Selecione a mesma provisão
4. Informe: **R$ 300,00**
5. Salve

### Passo 2: Verificar Status da Provisão
1. Vá em "Provisões"
2. ✅ A provisão deve ter:
   - **Valor Utilizado:** R$ 500,00 (200 + 300)
   - **Saldo Disponível:** R$ 0,00
   - **Status:** UTILIZADA (automaticamente)

---

## 🧪 Teste 6: Verificar Cards na Aba de Lançamentos

### Passo 1: Acessar Lançamentos
1. Vá em "Lançamentos"
2. Selecione o mês atual no filtro

### Passo 2: Verificar Cards
1. ✅ Deve haver **3 seções de cards**:
   - **Fluxo de Caixa do Período** (4 cards)
   - **Remessa e Compromissos Obrigatórios** (4 cards)
   - **Controle de Provisões** (2 cards)

### Passo 3: Verificar Card de Provisões Pendentes
1. No card **"Provisões Pendentes"**:
   - ✅ Deve mostrar o total de provisões não utilizadas
   - ✅ Deve atualizar automaticamente após criar/utilizar provisões

---

## 🐛 Problemas Comuns e Soluções

### Problema 1: Provisão não aparece após criar
**Solução:**
1. Recarregue a página (F5)
2. Verifique se o alerta de confirmação apareceu
3. Verifique o console do navegador (F12) para erros

### Problema 2: Provisão aparece mas com valor errado
**Solução:**
1. Verifique se o valor foi digitado corretamente no lançamento
2. Edite a provisão manualmente para corrigir

### Problema 3: Sincronização entre abas não funciona
**Solução:**
1. Verifique se ambas as abas estão logadas
2. Clique em qualquer lugar da página para forçar o foco
3. Aguarde 1-2 segundos

### Problema 4: Card de provisões não atualiza
**Solução:**
1. Mude o filtro de mês e volte
2. Recarregue a página

---

## ✅ Checklist de Verificação

- [ ] Provisão criada via checkbox aparece no módulo de Provisões
- [ ] Provisão criada via checkbox aparece no Relatório de Provisões
- [ ] Sincronização funciona entre diferentes abas do navegador
- [ ] Sincronização funciona ao ganhar foco da janela
- [ ] Cards na aba de Lançamentos mostram provisões corretamente
- [ ] Provisão pode ser utilizada parcialmente
- [ ] Provisão muda para status UTILIZADA quando saldo zera
- [ ] Alerta de confirmação aparece ao criar provisão
- [ ] Valores fixos (Missões, Jubilados) aparecem nos cards
- [ ] Saldo líquido é calculado corretamente

---

## 📊 Resultados Esperados

### Cenário de Teste Completo:
1. Criar provisão de R$ 500,00
2. Utilizar R$ 200,00 da provisão
3. Utilizar R$ 300,00 da provisão

### Resultados:
- ✅ Provisão criada aparece imediatamente em todos os módulos
- ✅ Saldo disponível atualiza para R$ 300,00 após primeiro uso
- ✅ Saldo disponível atualiza para R$ 0,00 após segundo uso
- ✅ Status muda para UTILIZADA automaticamente
- ✅ Cards mostram valores atualizados em tempo real
- ✅ Relatório de Provisões mostra histórico completo

---

## 🎯 Conclusão

Se todos os testes passarem, o sistema de provisões está funcionando corretamente com:
- ✅ Criação automática via checkbox
- ✅ Sincronização em tempo real
- ✅ Interface responsiva e atualizada
- ✅ Cálculos corretos de saldo
- ✅ Relatórios precisos

**Status:** ✅ Sistema pronto para produção!
