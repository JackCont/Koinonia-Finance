# Correções de Cálculos e Formatação - Janeiro 2026

## 🐛 Problemas Corrigidos

### 1. Cálculo da Remessa no Dashboard

**Problema:** O cálculo da remessa estava incorreto, considerando apenas os dízimos.

**Causa:**
```typescript
// ANTES (ERRADO)
const remessa = dizimos * getActiveRemittancePercentual() / 100;
```

**Solução:**
```typescript
// DEPOIS (CORRETO)
const remessa = (dizimos + ofertas) * getActiveRemittancePercentual() / 100;
```

**Resultado:**
- ✅ Remessa calculada sobre dízimos + ofertas
- ✅ Valor correto exibido no Dashboard
- ✅ Cálculo alinhado com a configuração de 15%

---

### 2. Totais na Página de Lançamentos

**Problema:** Os totais (Entradas, Saídas, Saldo) não refletiam os filtros aplicados.

**Causa:** O `periodBalance` estava calculando baseado apenas no filtro de mês, ignorando os filtros de tipo, categoria e busca.

**Solução:**
```typescript
// ANTES (ERRADO)
const periodBalance = useMemo(() => {
  const periodTransactions = transactions.filter(t => {
    const matchMonth = !filterMonth || t.data.startsWith(filterMonth);
    return matchMonth && !t.estornada;
  });
  // ... calcula entradas e saidas
}, [transactions, filterMonth]);

// DEPOIS (CORRETO)
const periodBalance = useMemo(() => {
  const entradas = filtered
    .filter(t => t.tipo === 'ENTRADA')
    .reduce((sum, t) => sum + t.valor, 0);
  
  const saidas = filtered
    .filter(t => t.tipo === 'SAIDA')
    .reduce((sum, t) => sum + t.valor, 0);

  return {
    entradas,
    saidas,
    saldo: entradas - saidas,
    totalTransacoes: filtered.length
  };
}, [filtered]);
```

**Resultado:**
- ✅ Totais refletem todos os filtros aplicados
- ✅ Se filtrar só entradas: mostra só entradas, saídas = 0
- ✅ Se filtrar só saídas: mostra só saídas, entradas = 0
- ✅ Se filtrar por categoria: mostra subtotal daquela categoria
- ✅ Se mostrar tudo: mostra entradas + saídas completas

---

### 3. Planilha de Remessa - Separação de MISSÕES

**Problema:** A coluna MISSÕES estava na mesma tabela de RECEITAS, causando confusão visual e nos cálculos.

**Solução:** Criada tabela separada para MISSÕES

**Antes:**
```
RECEITAS DO PERÍODO
| ORD. | CONGREGAÇÃO | DÍZIMOS | OFERTAS | RECEITA BRUTA (A) | REMESSA (B) | MISSÕES |
```

**Depois:**
```
RECEITAS DO PERÍODO
| ORD. | CONGREGAÇÃO | DÍZIMOS | OFERTAS | RECEITA BRUTA (A) | REMESSA (B) |

MISSÕES
| ORD. | CONGREGAÇÃO | VALOR |
```

**Resultado:**
- ✅ MISSÕES em tabela própria
- ✅ Não interfere nos cálculos de remessa
- ✅ Visual mais organizado
- ✅ Clareza na apresentação

---

### 4. Espaços para Assinaturas na Planilha

**Problema:** Não havia espaços adequados para assinaturas na planilha de remessa.

**Solução:** Adicionada seção de assinaturas com espaços adequados

**Estrutura:**
```
┌─────────────────────────────────────────────────────────────┐
│                        ASSINATURAS                          │
├──────────────────────────┬──────────────────────────────────┤
│                          │                                  │
│                          │                                  │
│    ____________________  │    ____________________          │
│    TESOUREIRO SETORIAL   │    PASTOR SETORIAL               │
│                          │                                  │
├──────────────────────────┼──────────────────────────────────┤
│                          │                                  │
│                          │                                  │
│    ____________________  │    ____________________          │
│    PASTOR REGIONAL       │    TESOUREIRO SEDE               │
│                          │                                  │
└──────────────────────────┴──────────────────────────────────┘
```

**Características:**
- ✅ 4 espaços para assinaturas
- ✅ Layout em grid 2x2
- ✅ Espaçamento adequado para assinatura
- ✅ Linha superior para assinatura
- ✅ Nome do cargo abaixo da linha
- ✅ Impressão em paisagem otimizada

---

## 📊 Cálculos da Remessa

### Fórmula Correta

```
Receita Bruta (A) = Dízimos + Ofertas
Remessa (B) = Receita Bruta × Percentual (15%)
Total Despesas (C) = Soma de todas as despesas
Total Pastor (D) = Soma de despesas com pastor
Saldo (E) = A - B - C - D
```

### Exemplo Prático

```
Dízimos: R$ 10.000,00
Ofertas: R$ 2.000,00
Receita Bruta (A): R$ 12.000,00

Remessa 15% (B): R$ 1.800,00

Despesas:
- Água: R$ 200,00
- Luz: R$ 500,00
- Aluguel: R$ 1.500,00
- Jubilados: R$ 800,00
Total Despesas (C): R$ 3.000,00

Pastor (D): R$ 2.500,00

Saldo (E) = 12.000 - 1.800 - 3.000 - 2.500 = R$ 4.700,00
```

---

## 🎯 Filtros na Página de Lançamentos

### Comportamento dos Totais

| Filtro Aplicado | Entradas | Saídas | Saldo | Total Transações |
|----------------|----------|--------|-------|------------------|
| Nenhum | R$ 15.000 | R$ 8.000 | R$ 7.000 | 25 |
| Só Entradas | R$ 15.000 | R$ 0 | R$ 15.000 | 15 |
| Só Saídas | R$ 0 | R$ 8.000 | -R$ 8.000 | 10 |
| Categoria: Dízimo | R$ 10.000 | R$ 0 | R$ 10.000 | 10 |
| Categoria: Água | R$ 0 | R$ 200 | -R$ 200 | 1 |
| Mês: Janeiro | R$ 12.000 | R$ 6.000 | R$ 6.000 | 18 |

**Resultado:**
- ✅ Totais sempre refletem o que está sendo exibido
- ✅ Subtotais precisos
- ✅ Experiência do usuário melhorada

---

## 📁 Arquivos Modificados

### 1. `src/pages/Dashboard.tsx`
- ✅ Corrigido cálculo da remessa (linha 44)
- ✅ Agora calcula sobre dízimos + ofertas

### 2. `src/pages/Transactions.tsx`
- ✅ Ajustado `periodBalance` para usar `filtered`
- ✅ Totais refletem todos os filtros aplicados

### 3. `src/pages/Remittance.tsx`
- ✅ Separada tabela de MISSÕES
- ✅ Adicionada seção de assinaturas
- ✅ Layout otimizado para impressão

---

## 🚀 Como Verificar as Correções

### 1. Verificar Cálculo da Remessa no Dashboard

1. Acesse o **Dashboard**
2. Verifique o card "Remessa (15%)"
3. ✅ Deve mostrar o cálculo correto sobre dízimos + ofertas

### 2. Verificar Totais com Filtros

1. Acesse **"Lançamentos"**
2. Crie alguns lançamentos de entrada e saída
3. Filtre por **"Entradas"**
4. ✅ Totais devem mostrar só entradas, saídas = 0
5. Filtre por **"Saídas"**
6. ✅ Totais devem mostrar só saídas, entradas = 0
7. Filtre por uma **categoria específica**
8. ✅ Totais devem mostrar subtotal daquela categoria

### 3. Verificar Planilha de Remessa

1. Acesse **"Remessa Mensal"**
2. Selecione um mês com lançamentos
3. ✅ Verifique que MISSÕES está em tabela separada
4. ✅ Role até o final da planilha
5. ✅ Verifique seção de assinaturas com 4 espaços:
   - Tesoureiro Setorial
   - Pastor Setorial
   - Pastor Regional
   - Tesoureiro Sede

### 4. Imprimir Planilha

1. Clique em **"Imprimir"**
2. ✅ Verifique que a impressão está em paisagem
3. ✅ Verifique que os espaços de assinatura estão visíveis
4. ✅ Verifique que MISSÕES está em tabela separada

---

## 💡 Benefícios das Correções

### Cálculos Precisos
- ✅ Remessa calculada corretamente
- ✅ Totais refletem filtros aplicados
- ✅ Subtotais precisos

### Organização Visual
- ✅ MISSÕES em tabela própria
- ✅ Seção de assinaturas clara
- ✅ Layout otimizado para impressão

### Experiência do Usuário
- ✅ Filtros funcionam como esperado
- ✅ Totais sempre atualizados
- ✅ Planilha profissional e organizada

### Conformidade
- ✅ Cálculos alinhados com configuração
- ✅ Espaços para assinaturas obrigatórias
- ✅ Formatação adequada para impressão

---

## 📝 Notas Técnicas

### Cálculo da Remessa

```typescript
// Fórmula correta
const remessa = (dizimos + ofertas) * getActiveRemittancePercentual() / 100;

// Exemplo com 15%
const remessa = (10000 + 2000) * 15 / 100;
// remessa = 12000 * 0.15 = 1800
```

### Filtros Dinâmicos

```typescript
// periodBalance usa o array 'filtered' que já considera todos os filtros
const periodBalance = useMemo(() => {
  const entradas = filtered.filter(t => t.tipo === 'ENTRADA').reduce(...);
  const saidas = filtered.filter(t => t.tipo === 'SAIDA').reduce(...);
  return { entradas, saidas, saldo: entradas - saidas };
}, [filtered]); // Depende de 'filtered', não de 'transactions'
```

### Layout de Assinaturas

```typescript
<div className="grid grid-cols-2 gap-8">
  <div className="text-center">
    <div className="border-t border-slate-400 pt-2 mt-12">
      <p className="font-semibold">TESOUREIRO SETORIAL</p>
    </div>
  </div>
  {/* ... mais 3 espaços */}
</div>
```

---

## ✅ Resumo

Todas as correções foram implementadas com sucesso:

1. ✅ **Cálculo da Remessa**: Corrigido para calcular sobre dízimos + ofertas
2. ✅ **Totais com Filtros**: Agora refletem todos os filtros aplicados
3. ✅ **MISSÕES Separada**: Tabela própria, não interfere nos cálculos
4. ✅ **Espaços para Assinaturas**: 4 espaços adequados adicionados
5. ✅ **Build Concluído**: Sem erros, pronto para uso

O sistema agora está com cálculos precisos, organização visual melhorada e planilha profissional! 🎉
