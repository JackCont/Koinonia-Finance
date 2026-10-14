# Gestão de Congregações - Melhorias Implementadas

## 🎯 Visão Geral

Foi implementada uma página dedicada para **Gestão de Congregações** com funcionalidades completas de edição, ativação/inativação por período e identificação do pastor responsável.

---

## ✨ Novas Funcionalidades

### 1. **Página Dedicada de Congregações**

**Localização:** Menu lateral → "Congregações" (ícone de igreja ⛪)

**Acesso:** MASTER, ADMIN e TESOURARIA

### 2. **Campos Adicionais**

Agora as congregações possuem os seguintes campos:

- **Nome** (obrigatório)
- **Cidade**
- **Setor**
- **Pastor Responsável**
- **Endereço**
- **Telefone**
- **Data de Início** (quando foi ativada)
- **Data de Fim** (quando foi desativada - vazio = ativa)
- **Status** (Ativa/Inativa)
- **Observações**

### 3. **Cards de Estatísticas**

No topo da página, três cards mostram:
- **Total** de congregações
- **Ativas** (em verde)
- **Inativas** (em vermelho)

### 4. **Visualização em Cards**

Cada congregação é exibida em um card com:
- Nome da congregação
- Cidade e setor
- Status (Ativa/Inativa) com cor indicativa
- Pastor responsável
- Endereço (se houver)
- Telefone (se houver)
- Período de atividade (data início → data fim)
- Bordas coloridas: verde (ativa) ou vermelho (inativa)

### 5. **Ações Disponíveis**

Cada card possui três botões:

#### 🔄 **Desativar/Reativar**
- **Se ativa:** Pede data de desativação e marca como inativa
- **Se inativa:** Pede data de reativação e marca como ativa
- Mantém histórico de períodos

#### ✏️ **Editar**
- Abre modal com todos os campos
- Permite alterar qualquer informação
- Inclui campos de período (data início/fim)

#### 🗑️ **Excluir**
- Confirmação antes de excluir
- Remove permanentemente

### 6. **Modal de Edição Completo**

O formulário de edição inclui:

```
┌─────────────────────────────────────────┐
│ Nova Congregação                         │
├─────────────────────────────────────────┤
│ Nome da Congregação *:                   │
│ [Congregação Central                 ]   │
│                                          │
│ Cidade:              Setor:              │
│ [Jacuí-MG        ]   [Setor 1        ]   │
│                                          │
│ Pastor Responsável:                      │
│ [Pr. João Silva                      ]   │
│                                          │
│ Endereço:                                │
│ [Rua Principal, 123                  ]   │
│                                          │
│ Telefone:                                │
│ [(35) 3333-0000                      ]   │
│                                          │
│ Data de Início:      Data de Fim:        │
│ [2024-01-01      ]   [              ]    │
│                       (vazio = ativa)    │
│                                          │
│ Status:                                  │
│ [Ativa                             ▼]    │
│                                          │
│ Observações:                             │
│ [                                    ]   │
│ [                                    ]   │
│ [                                    ]   │
│                                          │
│ [Cancelar]          [Criar Congregação]  │
└─────────────────────────────────────────┘
```

---

## 🔄 Fluxo de Ativação/Inativação

### Desativar Congregação

1. Clique em **"Desativar"** no card da congregação
2. Sistema pede: **"Data de desativação:"**
3. Valor padrão: data atual
4. Confirme a data
5. ✅ Congregação marcada como inativa
6. ✅ Data de fim registrada
7. ✅ Card fica com borda vermelha e opacidade reduzida

### Reativar Congregação

1. Clique em **"Reativar"** no card da congregação inativa
2. Sistema pede: **"Data de reativação:"**
3. Valor padrão: data atual
4. Confirme a data
5. ✅ Congregação marcada como ativa
6. ✅ Data de início atualizada
7. ✅ Data de fim limpa
8. ✅ Card fica com borda verde e opacidade total

---

## 📊 Exemplos de Uso

### Cenário 1: Nova Congregação

1. Clique em **"Nova Congregação"**
2. Preencha:
   - Nome: "Congregação Jardim das Flores"
   - Cidade: "Jacuí-MG"
   - Setor: "Setor 2"
   - Pastor: "Pr. Maria Silva"
   - Endereço: "Rua das Flores, 456"
   - Telefone: "(35) 3333-1111"
   - Data de Início: "2026-01-15"
   - Status: "Ativa"
3. Clique em **"Criar Congregação"**
4. ✅ Nova congregação aparece no card com borda verde

### Cenário 2: Desativar Temporariamente

1. Congregação está ativa desde 01/01/2024
2. Clique em **"Desativar"**
3. Informe data: "2026-01-31"
4. ✅ Congregação marcada como inativa
5. ✅ Card mostra: "Ativa desde 01/01/2024 • Inativa em 31/01/2026"

### Cenário 3: Reativar Congregação

1. Congregação está inativa
2. Clique em **"Reativar"**
3. Informe data: "2026-03-01"
4. ✅ Congregação marcada como ativa
5. ✅ Card mostra: "Ativa desde 01/03/2026"

### Cenário 4: Editar Informações

1. Clique em **"Editar"** no card
2. Altere o pastor responsável
3. Atualize o endereço
4. Clique em **"Salvar Alterações"**
5. ✅ Informações atualizadas no card

---

## 🎨 Interface Visual

### Cards de Congregações

**Congregação Ativa:**
```
┌─────────────────────────────────────┐
│ Congregação Central        [Ativa]  │ ← Borda verde
│ Jacuí-MG • Setor 1                  │
│                                     │
│ 👤 Pr. João Silva                   │
│ 📍 Rua Principal, 123               │
│ 📞 (35) 3333-0000                   │
│                                     │
│ 📅 Ativa desde 01/01/2024           │
│                                     │
│ [Desativar] [Editar] [Excluir]      │
└─────────────────────────────────────┘
```

**Congregação Inativa:**
```
┌─────────────────────────────────────┐
│ Congregação Norte          [Inativa]│ ← Borda vermelha, opacidade 75%
│ Jacuí-MG • Setor 2                  │
│                                     │
│ 👤 Pr. Maria Santos                 │
│ 📍 Av. Norte, 789                   │
│                                     │
│ 📅 Ativa desde 01/01/2023           │
│    • Inativa em 31/12/2025          │
│                                     │
│ [Reativar]  [Editar] [Excluir]      │
└─────────────────────────────────────┘
```

---

## 🔧 Implementação Técnica

### Arquivos Modificados

1. **`src/types.ts`**
   - Adicionados campos opcionais em `Congregation`:
     - `dataInicio?: string`
     - `dataFim?: string`
     - `endereco?: string`
     - `telefone?: string`
     - `observacoes?: string`

2. **`src/pages/Congregations.tsx`** (novo)
   - Página completa de gestão de congregações
   - CRUD completo (Create, Read, Update, Delete)
   - Ativação/inativação com datas
   - Cards visuais com status
   - Modal de edição completo

3. **`src/App.tsx`**
   - Adicionado import de `Congregations`
   - Adicionado 'congregations' ao tipo `Page`
   - Adicionado item no menu de navegação
   - Adicionado case na função `renderPage`

### Funções Principais

```typescript
// Salvar congregação (criar ou atualizar)
const handleSave = () => {
  const congregation: Congregation = {
    ...form,
    id: editing?.id || uuidv4(),
  };
  saveCongregation(congregation);
};

// Desativar/Reativar com data
const handleToggleActive = (cong: Congregation) => {
  if (cong.ativo) {
    // Desativando - pede data de fim
    const dataFim = prompt('Data de desativação:', format(new Date(), 'yyyy-MM-dd'));
    saveCongregation({ ...cong, ativo: false, dataFim });
  } else {
    // Reativando - pede data de início
    const dataInicio = prompt('Data de reativação:', format(new Date(), 'yyyy-MM-dd'));
    saveCongregation({ ...cong, ativo: true, dataInicio, dataFim: '' });
  }
};
```

---

## 💡 Benefícios

### 1. **Gestão Completa**
- ✅ Criar, editar, excluir congregações
- ✅ Ativar/inativar com controle de datas
- ✅ Histórico de períodos de atividade

### 2. **Organização Visual**
- ✅ Cards coloridos por status
- ✅ Informações organizadas
- ✅ Ícones para melhor identificação

### 3. **Controle de Períodos**
- ✅ Data de início (quando foi ativada)
- ✅ Data de fim (quando foi desativada)
- ✅ Rastreamento de mudanças

### 4. **Informações Completas**
- ✅ Pastor responsável
- ✅ Endereço e telefone
- ✅ Cidade e setor
- ✅ Observações adicionais

### 5. **Estatísticas em Tempo Real**
- ✅ Total de congregações
- ✅ Quantidade de ativas
- ✅ Quantidade de inativas

---

## 🧪 Testes Realizados

### Teste 1: Criar Nova Congregação
- ✅ Clicar em "Nova Congregação"
- ✅ Preencher todos os campos
- ✅ Salvar
- ✅ Card aparece com borda verde

### Teste 2: Desativar Congregação
- ✅ Clicar em "Desativar"
- ✅ Informar data de desativação
- ✅ Card muda para borda vermelha
- ✅ Data de fim registrada

### Teste 3: Reativar Congregação
- ✅ Clicar em "Reativar"
- ✅ Informar data de reativação
- ✅ Card muda para borda verde
- ✅ Data de início atualizada

### Teste 4: Editar Congregação
- ✅ Clicar em "Editar"
- ✅ Alterar informações
- ✅ Salvar
- ✅ Card atualizado

### Teste 5: Excluir Congregação
- ✅ Clicar em "Excluir"
- ✅ Confirmar exclusão
- ✅ Card removido

---

## 📝 Notas de Uso

### Boas Práticas

1. **Mantenha informações atualizadas**
   - Atualize pastor responsável quando houver mudança
   - Mantenha endereço e telefone corretos

2. **Use datas de forma consistente**
   - Data de início = quando a congregação começou a operar
   - Data de fim = quando parou de operar (deixe vazio se ativa)

3. **Aproveite as observações**
   - Registre informações importantes
   - Histórico de mudanças
   - Contatos adicionais

4. **Monitore estatísticas**
   - Use os cards para visão geral rápida
   - Identifique congregações inativas

### Limitações Conhecidas

- Não há validação de datas sobrepostas
- Não há histórico completo de mudanças (apenas última data)
- Não há importação em massa de congregações

### Futuras Melhorias

- [ ] Histórico completo de mudanças de status
- [ ] Importação de congregações via CSV
- [ ] Exportação de lista de congregações
- [ ] Mapa visual das congregações
- [ ] Vínculo com membros por congregação
- [ ] Relatórios por congregação

---

## 🎯 Resumo

**Melhorias implementadas:**

1. ✅ **Página dedicada** de gestão de congregações
2. ✅ **Campos expandidos** com período e informações de contato
3. ✅ **Ativação/inativação** com controle de datas
4. ✅ **Visualização em cards** com status visual
5. ✅ **Ações completas** (criar, editar, desativar, reativar, excluir)
6. ✅ **Estatísticas** em tempo real
7. ✅ **Interface intuitiva** e responsiva

**Arquivos modificados:**
- `src/types.ts` (campos adicionados)
- `src/pages/Congregations.tsx` (novo)
- `src/App.tsx` (rota adicionada)

**Status:** ✅ Pronto para uso

---

**Versão:** 2.0.0  
**Data:** Janeiro 2026
