# Sistema de Cultos e Melhorias em Lançamentos

## 🎯 Melhorias Implementadas

### 1. Descrição Opcional para Dízimos e Ofertas

**Antes:**
- Descrição era obrigatória para todos os lançamentos
- Dízimos e ofertas exigiam descrição mesmo quando não necessária

**Depois:**
- Descrição é **opcional** para categorias `DIZIMO` e `OFERTA`
- Descrição continua **obrigatória** para todas as outras categorias
- Label do campo indica dinamicamente se é obrigatório ou opcional

**Exemplo:**
```
Categoria: Dízimo
Descrição: (opcional) ← Label dinâmico

Categoria: Conta de Luz
Descrição: * ← Label indica obrigatório
```

---

### 2. Sistema de Gestão de Cultos

#### O que é um Culto?
Um culto é um evento religioso (culto, EBD, reunião, evento) com uma data específica. Todos os lançamentos vinculados a um culto herdam automaticamente a data do culto.

#### Tipos de Culto
- **Culto**: Culto regular
- **EBD**: Escola Bíblica Dominical
- **Reunião**: Reuniões especiais
- **Evento**: Eventos da igreja

#### Funcionalidades

##### A. Criar Novo Culto
1. No formulário de lançamento, clique em **"Novo"** ao lado do seletor de culto
2. Preencha:
   - **Nome do Culto**: Ex: "Culto de Domingo Manhã"
   - **Data**: Data do culto
   - **Tipo**: Culto, EBD, Reunião ou Evento
3. Clique em **"Criar Culto"**

##### B. Selecionar Culto Existente
1. No formulário de lançamento, use o seletor dropdown
2. Cultos são listados em ordem cronológica (mais recente primeiro)
3. Formato: `dd/MM/yyyy - Nome do Culto`

##### C. Lançamento sem Culto
- Selecione "-- Sem culto específico --"
- Lançamento não será vinculado a nenhum culto
- Data pode ser definida manualmente

##### D. Vinculação Automática de Data
- Ao selecionar um culto, a **data do lançamento é automaticamente definida** como a data do culto
- Mensagem informativa aparece: "Data do lançamento será automaticamente definida pela data do culto"
- Campo de data fica bloqueado (visualmente) mas pode ser alterado se necessário

---

## 📋 Estrutura de Dados

### Novo Tipo: Culto

```typescript
export interface Culto {
  id: string;
  nome: string;
  data: string; // yyyy-MM-dd
  tipo: 'Culto' | 'EBD' | 'Reunião' | 'Evento';
  observacoes?: string;
  createdAt: string;
}
```

### Transaction Atualizado

```typescript
export interface Transaction {
  // ... campos existentes
  cultoId?: string; // Novo campo opcional
  // ...
}
```

---

## 🗄️ Armazenamento

### Nova Chave no localStorage
- **Chave**: `iead_cultos`
- **Conteúdo**: Array de objetos `Culto`

### Funções de Gestão (store.ts)

```typescript
// Obter todos os cultos
export function getCultos(): Culto[]

// Salvar/atualizar culto
export function saveCulto(culto: Culto): void

// Deletar culto
export function deleteCulto(id: string): void
```

### Backup e Restauração
- Cultos são incluídos automaticamente no backup
- Função `createBackup()` inclui `cultos: getCultos()`
- Função `restoreBackup()` restaura cultos se presentes no backup

---

## 🎨 Interface do Usuário

### Formulário de Lançamento

```
┌─────────────────────────────────────────┐
│ Novo Lançamento                          │
├─────────────────────────────────────────┤
│ Tipo: [Entrada ▼]                        │
│ Data: [2026-01-25]                       │
│ Competência: [2026-01]                   │
│                                          │
│ Categoria: [Dízimo ▼]                    │
│                                          │
│ Culto (opcional):                        │
│ [25/01/2026 - Culto Domingo Manhã ▼] [+ Novo]
│ ℹ️ Data do lançamento será automaticamente│
│    definida pela data do culto           │
│                                          │
│ Descrição (opcional):                    │
│ [                                    ]   │
│                                          │
│ Congregação: [Jacuí-MG ▼]                │
│                                          │
│ Valor: [100.00]  Membro: [João Silva ▼]  │
│                                          │
│ [Cancelar]          [Salvar]             │
└─────────────────────────────────────────┘
```

### Modal de Novo Culto

```
┌─────────────────────────────────────────┐
│ Novo Culto                               │
├─────────────────────────────────────────┤
│ Nome do Culto *:                         │
│ [Culto de Domingo Manhã              ]   │
│                                          │
│ Data *:                                  │
│ [2026-01-25]                             │
│                                          │
│ Tipo:                                    │
│ [Culto ▼]                                │
│   - Culto                                │
│   - EBD                                  │
│   - Reunião                              │
│   - Evento                               │
│                                          │
│ [Cancelar]          [Criar Culto]        │
└─────────────────────────────────────────┘
```

---

## 🔄 Fluxo de Trabalho

### Cenário 1: Lançar Dízimos de um Culto

1. **Criar Culto** (se ainda não existir):
   - Clique em "Novo"
   - Nome: "Culto de Domingo Manhã"
   - Data: "25/01/2026"
   - Tipo: "Culto"
   - Clique em "Criar Culto"

2. **Lançar Dízimos**:
   - Selecione o culto criado no dropdown
   - Data é automaticamente definida como 25/01/2026
   - Categoria: Dízimo
   - Descrição: (opcional) "João Silva"
   - Valor: 100.00
   - Salve

3. **Repita para outros dízimos**:
   - Selecione o mesmo culto
   - Data continua sendo 25/01/2026
   - Lançe múltiplos dízimos rapidamente

### Cenário 2: Lançar Despesa sem Culto

1. **Não selecione nenhum culto**:
   - Deixe "-- Sem culto específico --" selecionado
   
2. **Lance a despesa normalmente**:
   - Data: defina manualmente
   - Categoria: Conta de Luz
   - Descrição: "Conta de luz janeiro" (obrigatória)
   - Valor: 300.00
   - Salve

### Cenário 3: Lançar Oferta de um Culto

1. **Selecione o culto**:
   - Escolha o culto no dropdown
   - Data é automaticamente definida

2. **Lance a oferta**:
   - Categoria: Oferta
   - Descrição: (opcional)
   - Valor: 500.00
   - Salve

---

## ✅ Validações

### Validação de Descrição
```typescript
const isDizimoOuOferta = form.categoria === 'DIZIMO' || form.categoria === 'OFERTA';

if ((!form.descricao.trim() && !isDizimoOuOferta) || form.valor <= 0) {
  alert(isDizimoOuOferta 
    ? 'Valor é obrigatório (valor > 0)' 
    : 'Descrição e valor são obrigatórios (valor > 0)');
  return;
}
```

### Validação de Culto
```typescript
const handleCreateCulto = (nome: string, data: string, tipo: Culto['tipo']) => {
  if (!nome.trim()) {
    alert('Nome do culto é obrigatório');
    return;
  }
  // ... criar culto
};
```

---

## 📊 Benefícios

### 1. Agilidade no Lançamento
- Crie um culto uma vez
- Lance múltiplos dízimos/ofertas rapidamente
- Data é preenchida automaticamente

### 2. Organização
- Todos os lançamentos de um culto têm a mesma data
- Fácil rastreamento de ofertas por culto
- Histórico de cultos disponível

### 3. Flexibilidade
- Lançamentos podem ser vinculados ou não a cultos
- Despesas operacionais não precisam de culto
- Dízimos e ofertas podem ter descrição opcional

### 4. Precisão
- Data do culto é a data oficial dos lançamentos
- Evita erros de digitação na data
- Consistência nos relatórios

---

## 🔍 Exemplos de Uso

### Exemplo 1: Culto de Domingo

**Culto criado:**
- Nome: "Culto de Domingo Manhã"
- Data: "2026-01-25"
- Tipo: "Culto"

**Lançamentos vinculados:**
1. Dízimo - João Silva - R$ 100,00
2. Dízimo - Maria Souza - R$ 150,00
3. Oferta - R$ 500,00
4. Oferta - R$ 300,00

**Todos os lançamentos têm data: 25/01/2026**

### Exemplo 2: Despesa sem Culto

**Lançamento:**
- Categoria: Conta de Luz
- Descrição: "Conta de luz janeiro"
- Data: "2026-01-15" (definida manualmente)
- Valor: R$ 300,00
- Culto: Nenhum

---

## 📝 Arquivos Modificados

### 1. `src/types.ts`
- Adicionado interface `Culto`
- Adicionado campo `cultoId` em `Transaction`
- Adicionado `cultos` em `BackupData`

### 2. `src/store.ts`
- Adicionado `CULTOS` em `STORAGE_KEYS`
- Adicionado funções: `getCultos()`, `saveCulto()`, `deleteCulto()`
- Atualizado `createBackup()` para incluir cultos
- Atualizado `restoreBackup()` para restaurar cultos

### 3. `src/pages/Transactions.tsx`
- Adicionado import de `getCultos`, `saveCulto`, `Culto`
- Adicionado estado `cultos` e `showCultoForm`
- Adicionado `cultoId` em `emptyTransaction`
- Modificado `handleSave()` para validar descrição condicionalmente
- Adicionado `handleCreateCulto()` e `handleSelectCulto()`
- Adicionado seletor de culto no formulário
- Adicionado componente `CultoFormModal`
- Modificado label de descrição para indicar opcionalidade

---

## 🚀 Como Usar

### Passo 1: Criar um Culto

1. Acesse **"Lançamentos"**
2. Clique em **"Novo Lançamento"**
3. Clique em **"+ Novo"** ao lado do seletor de culto
4. Preencha:
   - Nome: "Culto de Domingo"
   - Data: "25/01/2026"
   - Tipo: "Culto"
5. Clique em **"Criar Culto"**

### Passo 2: Lançar Dízimos/Ofertas

1. No formulário de lançamento:
2. Selecione o culto criado no dropdown
3. Data é automaticamente definida
4. Categoria: Dízimo ou Oferta
5. Descrição: (opcional)
6. Valor: R$ 100,00
7. Salve

### Passo 3: Lançar Despesas (sem culto)

1. No formulário de lançamento:
2. Deixe "-- Sem culto específico --" selecionado
3. Defina a data manualmente
4. Categoria: Conta de Luz
5. Descrição: "Conta de luz janeiro" (obrigatória)
6. Valor: R$ 300,00
7. Salve

---

## ✅ Build e Testes

- ✅ Build concluído sem erros
- ✅ Validação de descrição condicional funcionando
- ✅ Criação de cultos funcionando
- ✅ Seleção de cultos funcionando
- ✅ Vinculação automática de data funcionando
- ✅ Backup e restauração incluem cultos

---

## 🎯 Resumo

**Melhorias implementadas:**

1. ✅ **Descrição opcional** para Dízimos e Ofertas
2. ✅ **Sistema de Cultos** completo:
   - Criar cultos com nome, data e tipo
   - Selecionar cultos existentes
   - Vinculação automática de data
   - Lançamentos sem culto (opcional)
3. ✅ **Backup e restauração** incluem cultos
4. ✅ **Interface intuitiva** com modais e feedback visual

**Arquivos modificados:**
- `src/types.ts`
- `src/store.ts`
- `src/pages/Transactions.tsx`

**Status:** ✅ Pronto para uso
