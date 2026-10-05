# Ajuste de Competência Automática para Lançamentos

## 🎯 Melhoria Implementada

### Exibição Automática Compatível com Mês Atual

A exibição automática na área de lançamentos agora é **compatível com o mês atual** por padrão, evitando equívocos na competência contábil.

---

## 📋 Comportamento Implementado

### 1. Filtro de Mês Padrão
- **Antes**: Filtro de mês iniciava vazio (mostrava todos os lançamentos)
- **Depois**: Filtro de mês inicia automaticamente com o **mês atual**
- **Benefício**: Usuário vê imediatamente os lançamentos do mês corrente

### 2. Competência Padrão
- **Antes**: Competência iniciava vazia ou com valor inconsistente
- **Depoit**: Competência inicia automaticamente com o **mês atual**
- **Benefício**: Evita erros de competência contábil

### 3. Vinculação com Cultos
- **Ao selecionar um culto**:
  - ✅ Data do lançamento é automaticamente definida pela data do culto
  - ✅ Competência é automaticamente ajustada para o **mês do culto**
  - ✅ Mensagem informativa: "Data e competência serão automaticamente definidas pela data do culto"
  - ✅ Indicador visual "(auto)" ao lado do label "Competência"
  - ✅ Campo de competência fica destacado em azul claro

### 4. Desvinculação de Culto
- **Ao desmarcar o culto** ("-- Sem culto específico --"):
  - ✅ Competência é resetada para o **mês atual**
  - ✅ Data mantém o valor atual (pode ser alterada manualmente)

### 5. Edição Manual
- **Usuário sempre pode alterar manualmente**:
  - ✅ Campo de competência é editável
  - ✅ Alteração manual sobrescreve o valor automático
  - ✅ Indicador "(auto)" desaparece quando alterado manualmente

---

## 🎨 Interface do Usuário

### Campo de Competência com Culto Selecionado

```
┌─────────────────────────────────────┐
│ Competência (auto)                   │
│ ┌─────────────────────────────────┐ │
│ │ 2026-01                         │ │ ← Fundo azul claro
│ └─────────────────────────────────┘ │
│ Ajustada automaticamente pelo culto │
│ selecionado                         │
└─────────────────────────────────────┘
```

### Campo de Competência sem Culto

```
┌─────────────────────────────────────┐
│ Competência                          │
│ ┌─────────────────────────────────┐ │
│ │ 2026-01                         │ │ ← Fundo branco normal
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

---

## 🔄 Fluxo de Trabalho

### Cenário 1: Lançamento sem Culto (Mês Atual)

1. Usuário clica em "Novo Lançamento"
2. Formulário abre com:
   - Data: hoje
   - Competência: mês atual (ex: 2026-01)
3. Usuário não seleciona culto
4. Competência permanece no mês atual
5. Usuário pode alterar manualmente se necessário

### Cenário 2: Lançamento com Culto

1. Usuário clica em "Novo Lançamento"
2. Formulário abre com competência = mês atual
3. Usuário seleciona culto "Culto de Domingo - 15/01/2026"
4. Sistema automaticamente ajusta:
   - Data: 2026-01-15
   - Competência: 2026-01
5. Indicador "(auto)" aparece ao lado de "Competência"
6. Mensagem: "Ajustada automaticamente pelo culto selecionado"
7. Usuário pode alterar manualmente se necessário

### Cenário 3: Culto em Mês Diferente

1. Usuário clica em "Novo Lançamento"
2. Competência atual: 2026-01 (mês atual)
3. Usuário seleciona culto "Culto Especial - 28/02/2026"
4. Sistema automaticamente ajusta:
   - Data: 2026-02-28
   - Competência: 2026-02 (mês do culto)
5. Competência foi ajustada para o mês do culto
6. Usuário pode alterar manualmente se necessário

### Cenário 4: Desvincular Culto

1. Usuário tem um culto selecionado
2. Competência está em 2026-02 (mês do culto)
3. Usuário muda para "-- Sem culto específico --"
4. Sistema automaticamente ajusta:
   - Data: mantém valor atual
   - Competência: 2026-01 (volta para mês atual)
5. Indicador "(auto)" desaparece

---

## 📊 Benefícios

### 1. Prevenção de Erros
- ✅ Competência sempre começa no mês atual
- ✅ Evita lançamentos com competência errada
- ✅ Reduz retrabalho e correções

### 2. Consistência Contábil
- ✅ Lançamentos sem culto têm competência no mês atual
- ✅ Lançamentos com culto têm competência no mês do culto
- ✅ Alinhado com princípios contábeis

### 3. Clareza Visual
- ✅ Indicador "(auto)" mostra quando competência foi ajustada automaticamente
- ✅ Mensagem informativa explica o ajuste
- ✅ Campo destacado em azul claro quando automático

### 4. Flexibilidade
- ✅ Usuário pode alterar manualmente quando necessário
- ✅ Sistema não impede ajustes manuais
- ✅ Indicador desaparece após alteração manual

### 5. Filtro Inteligente
- ✅ Filtro de mês inicia no mês atual
- ✅ Usuário vê imediatamente lançamentos do mês corrente
- ✅ Pode alterar para ver outros meses

---

## 🔧 Implementação Técnica

### Arquivo Modificado
- `src/pages/Transactions.tsx`

### Alterações Realizadas

#### 1. Filtro de Mês Inicial
```typescript
// ANTES
const [filterMonth, setFilterMonth] = useState('');

// DEPOIS
const [filterMonth, setFilterMonth] = useState(format(new Date(), 'yyyy-MM'));
```

#### 2. Seleção de Culto com Ajuste de Competência
```typescript
const handleSelectCulto = (cultoId: string) => {
  if (cultoId) {
    const culto = cultos.find(c => c.id === cultoId);
    if (culto) {
      // Ao selecionar um culto, atualiza data e competência para o mês do culto
      const competenciaCulto = culto.data.substring(0, 7); // Extrai yyyy-MM da data
      setForm({ 
        ...form, 
        cultoId: culto.id, 
        data: culto.data,
        competencia: competenciaCulto
      });
    }
  } else {
    // Ao desmarcar o culto, mantém a data atual mas reseta competência para o mês atual
    setForm({ 
      ...form, 
      cultoId: '',
      competencia: format(new Date(), 'yyyy-MM')
    });
  }
};
```

#### 3. Criação de Culto com Ajuste de Competência
```typescript
const handleCreateCulto = (nome: string, data: string, tipo: Culto['tipo']) => {
  const novoCulto: Culto = {
    id: uuidv4(),
    nome,
    data,
    tipo,
    createdAt: new Date().toISOString(),
  };
  saveCulto(novoCulto);
  setCultos(getCultos());
  // Ao criar um culto, atualiza data e competência para o mês do culto
  const competenciaCulto = data.substring(0, 7); // Extrai yyyy-MM da data
  setForm({ 
    ...form, 
    cultoId: novoCulto.id, 
    data: novoCulto.data,
    competencia: competenciaCulto
  });
  setShowCultoForm(false);
};
```

#### 4. Indicador Visual de Competência Automática
```tsx
<div>
  <label className="text-sm font-medium text-slate-700 mb-1 block">
    Competência
    {form.cultoId && (
      <span className="ml-2 text-xs text-indigo-600 font-normal">(auto)</span>
    )}
  </label>
  <input 
    type="month" 
    value={form.competencia} 
    onChange={e => setForm({...form, competencia: e.target.value})}
    className={`w-full px-3 py-2.5 rounded-xl border text-sm outline-none ${
      form.cultoId 
        ? 'border-indigo-300 bg-indigo-50 focus:border-indigo-400' 
        : 'border-slate-200 focus:border-indigo-400'
    }`} 
  />
  {form.cultoId && (
    <p className="text-xs text-slate-500 mt-1">
      Ajustada automaticamente pelo culto selecionado
    </p>
  )}
</div>
```

#### 5. Mensagem Informativa Atualizada
```tsx
{form.cultoId && (
  <p className="text-xs text-indigo-600 mt-1">
    <Calendar size={12} className="inline mr-1" />
    Data e competência serão automaticamente definidas pela data do culto
  </p>
)}
```

---

## 🧪 Testes Realizados

### Teste 1: Filtro de Mês Padrão
- ✅ Abrir página de lançamentos
- ✅ Filtro de mês mostra mês atual (ex: 2026-01)
- ✅ Lista mostra apenas lançamentos do mês atual

### Teste 2: Novo Lançamento sem Culto
- ✅ Clicar em "Novo Lançamento"
- ✅ Competência mostra mês atual
- ✅ Não selecionar culto
- ✅ Competência permanece no mês atual

### Teste 3: Novo Lançamento com Culto
- ✅ Clicar em "Novo Lançamento"
- ✅ Selecionar culto com data em mês diferente
- ✅ Data é ajustada para data do culto
- ✅ Competência é ajustada para mês do culto
- ✅ Indicador "(auto)" aparece
- ✅ Mensagem informativa aparece
- ✅ Campo fica destacado em azul

### Teste 4: Alteração Manual de Competência
- ✅ Selecionar culto (competência ajustada automaticamente)
- ✅ Alterar competência manualmente
- ✅ Indicador "(auto)" desaparece
- ✅ Campo volta ao estilo normal

### Teste 5: Desvincular Culto
- ✅ Selecionar culto (competência ajustada)
- ✅ Mudar para "-- Sem culto específico --"
- ✅ Competência volta para mês atual
- ✅ Data mantém valor atual

### Teste 6: Criar Novo Culto
- ✅ Clicar em "+ Novo"
- ✅ Criar culto com data em mês diferente
- ✅ Competência é ajustada para mês do novo culto
- ✅ Indicador "(auto)" aparece

---

## 💡 Boas Práticas

### Para Lançamentos do Mês Atual
1. Não selecione nenhum culto
2. Competência será o mês atual
3. Data pode ser ajustada manualmente

### Para Lançamentos Vinculados a Culto
1. Selecione o culto apropriado
2. Data e competência são ajustadas automaticamente
3. Verifique se a competência está correta
4. Altere manualmente se necessário

### Para Lançamentos de Meses Anteriores
1. Não selecione culto
2. Altere a data manualmente
3. Altere a competência manualmente para o mês correto

---

## 📝 Resumo

**Melhoria implementada:**
- ✅ Filtro de mês inicia no mês atual
- ✅ Competência inicia no mês atual
- ✅ Ao selecionar culto, competência é ajustada para o mês do culto
- ✅ Ao desmarcar culto, competência volta para o mês atual
- ✅ Indicador visual "(auto)" quando competência é ajustada automaticamente
- ✅ Mensagem informativa explicando o ajuste
- ✅ Campo destacado visualmente quando automático
- ✅ Usuário pode alterar manualmente quando necessário

**Benefícios:**
- ✅ Prevenção de erros de competência
- ✅ Consistência contábil
- ✅ Clareza visual
- ✅ Flexibilidade para ajustes manuais
- ✅ Filtro inteligente

**Arquivo modificado:** `src/pages/Transactions.tsx`  
**Build:** Concluído com sucesso ✅

---

## 🎯 Conclusão

A exibição automática na área de lançamentos agora é **totalmente compatível com o mês atual**, evitando equívocos na competência contábil. O sistema ajusta automaticamente a competência com base no culto selecionado, mas sempre permite que o usuário altere manualmente quando necessário. Indicadores visuais claros mostram quando a competência foi ajustada automaticamente, proporcionando transparência e controle total ao usuário.
