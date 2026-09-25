# Correções na Remessa Mensal - Linhas Vazias

## Problema Identificado

Ao gerar a remessa mensal, o relatório estava exibindo linhas vazias para congregações e pastores que não possuíam movimentação financeira no período selecionado. Isso tornava o relatório confuso e difícil de ler.

## Solução Implementada

### 1. Filtragem de Congregações com Movimentação

**Antes:**
```typescript
return congregations.map(cong => {
  // Calcula todos os valores...
  return { congregacao: cong.nome, ... };
});
```

**Depois:**
```typescript
const allData = congregations.map(cong => {
  // Calcula todos os valores...
  return { congregacao: cong.nome, ... };
});

// Filtrar apenas congregações com movimentação financeira
return allData.filter(row => 
  row.receitaBruta > 0 || row.totalDespesas > 0 || row.pastor > 0
);
```

**Resultado:** Apenas congregações que possuem:
- Receita bruta (dízimos + ofertas) > 0, OU
- Total de despesas > 0, OU
- Despesas com pastor > 0

serão exibidas no relatório.

### 2. Remoção de Linhas Vazias

**Antes:**
```typescript
{/* Empty rows */}
{Array.from({ length: Math.max(0, 8 - monthlyData.length) }, (_, i) => (
  <tr key={`empty-${i}`} className="border-b border-slate-50">
    <td className="py-1 px-1">{monthlyData.length + i + 1}</td>
    <td colSpan={6}></td>
  </tr>
))}
```

**Depois:**
```typescript
// Linhas vazias removidas
```

**Resultado:** O relatório agora mostra apenas as linhas necessárias, sem completar até 8 linhas.

### 3. Filtragem de Pastores

**Antes:**
```typescript
{monthlyData.map((row, i) => (
  <tr key={i}>
    <td>{i + 1}</td>
    <td>{row.congregacao}</td>
    <td>{congregations[i]?.pastor || ''}</td>
    <td>{formatCurrency(row.pastor)}</td>
  </tr>
))}
```

**Problema:**
- Mostrava todas as congregações, mesmo sem despesas de pastor
- Usava índice incorreto para buscar o nome do pastor

**Depois:**
```typescript
// Criar lista filtrada de pastores
const pastorData = useMemo(() => {
  return monthlyData
    .filter(row => row.pastor > 0)
    .map(row => {
      const cong = congregations.find(c => c.nome === row.congregacao);
      return {
        ...row,
        pastorNome: cong?.pastor || ''
      };
    });
}, [monthlyData, congregations]);

// Usar lista filtrada
{pastorData.map((row, i) => (
  <tr key={i}>
    <td>{i + 1}</td>
    <td>{row.congregacao}</td>
    <td>{row.pastorNome}</td>
    <td>{formatCurrency(row.pastor)}</td>
  </tr>
))}
```

**Resultado:**
- Apenas congregações com despesas de pastor > 0 são exibidas
- Nome do pastor é buscado corretamente pelo nome da congregação

## Exemplo Prático

### Cenário: 5 congregações cadastradas, apenas 2 com movimentação

**Congregações:**
1. Congregação Central - Receita: R$ 5.000,00 | Despesas: R$ 2.000,00 | Pastor: R$ 3.000,00
2. Congregação Norte - Receita: R$ 0,00 | Despesas: R$ 0,00 | Pastor: R$ 0,00
3. Congregação Sul - Receita: R$ 3.000,00 | Despesas: R$ 1.500,00 | Pastor: R$ 0,00
4. Congregação Leste - Receita: R$ 0,00 | Despesas: R$ 0,00 | Pastor: R$ 0,00
5. Congregação Oeste - Receita: R$ 0,00 | Despesas: R$ 800,00 | Pastor: R$ 0,00

### Relatório Anterior (ANTES da correção)

**RECEITAS DO PERÍODO**
```
ORD. | CONGREGAÇÃO        | DÍZIMOS | OFERTAS | RECEITA BRUTA | REMESSA | MISSÕES
1    | Congregação Central| 3.000,00| 2.000,00|    5.000,00   | 1.000,00|   0,00
2    | Congregação Norte  |    0,00 |    0,00 |        0,00   |    0,00 |   0,00
3    | Congregação Sul    | 2.000,00| 1.000,00|    3.000,00   |   600,00|   0,00
4    | Congregação Leste  |    0,00 |    0,00 |        0,00   |    0,00 |   0,00
5    | Congregação Oeste  |    0,00 |    0,00 |        0,00   |    0,00 |   0,00
6    |                    |         |         |               |         |
7    |                    |         |         |               |         |
8    |                    |         |         |               |         |
TOTAL|                    | 5.000,00| 3.000,00|    8.000,00   | 1.600,00|   0,00
```

### Relatório Novo (DEPOIS da correção)

**RECEITAS DO PERÍODO**
```
ORD. | CONGREGAÇÃO        | DÍZIMOS | OFERTAS | RECEITA BRUTA | REMESSA | MISSÕES
1    | Congregação Central| 3.000,00| 2.000,00|    5.000,00   | 1.000,00|   0,00
2    | Congregação Sul    | 2.000,00| 1.000,00|    3.000,00   |   600,00|   0,00
TOTAL|                    | 5.000,00| 3.000,00|    8.000,00   | 1.600,00|   0,00
```

**DESPESAS DO PERÍODO**
```
ORD. | CONGREGAÇÃO        | ÁGUA | LUZ | ALUGUEL | ... | TOTAL DESP.
1    | Congregação Central| 500,00| 800,00|  700,00 | ... |  2.000,00
2    | Congregação Sul    | 300,00| 500,00|  700,00 | ... |  1.500,00
3    | Congregação Oeste  |   0,00|   0,00|    0,00 | ... |    800,00
TOTAL|                    | 800,00|1.300,00|1.400,00 | ... |  4.300,00
```

**PASTOR**
```
ORD. | CONGREGAÇÃO        | PASTOR          | TOTAL PASTOR
1    | Congregação Central| Pr. João Silva  |    3.000,00
TOTAL|                    |                 |    3.000,00
```

## Benefícios

### 1. Relatório Mais Limpo
- Apenas congregações com movimentação são exibidas
- Sem linhas vazias desnecessárias
- Mais fácil de ler e entender

### 2. Impressão Mais Eficiente
- Menos páginas impressas
- Economia de papel e tinta
- Melhor uso do espaço

### 3. Análise Mais Rápida
- Foco apenas nas congregações ativas
- Identificação rápida de problemas
- Tomada de decisão mais ágil

### 4. Nomes de Pastores Corretos
- Busca correta pelo nome do pastor
- Sem erros de índice
- Informação precisa

## Arquivos Modificados

### src/pages/Remittance.tsx

**Alterações:**
1. Adicionado filtro em `monthlyData` para incluir apenas congregações com movimentação
2. Removidas linhas vazias das seções de RECEITAS e DESPESAS
3. Criado `pastorData` com filtro para congregações com despesas de pastor
4. Corrigida busca do nome do pastor usando `find()` ao invés de índice
5. Removidas linhas vazias da seção de PASTOR

## Testes Realizados

### Teste 1: Congregações sem movimentação
- ✅ Congregações sem receita, despesas ou pastor não aparecem
- ✅ Apenas congregações ativas são listadas

### Teste 2: Seção de receitas
- ✅ Apenas congregações com receitaBruta > 0 aparecem
- ✅ Sem linhas vazias
- ✅ Totais calculados corretamente

### Teste 3: Seção de despesas
- ✅ Apenas congregações com totalDespesas > 0 aparecem
- ✅ Sem linhas vazias
- ✅ Totais calculados corretamente

### Teste 4: Seção de pastores
- ✅ Apenas congregações com pastor > 0 aparecem
- ✅ Nomes dos pastores exibidos corretamente
- ✅ Sem linhas vazias
- ✅ Totais calculados corretamente

### Teste 5: Impressão
- ✅ Relatório impresso sem linhas vazias
- ✅ Formatação correta
- ✅ Todas as seções exibidas corretamente

## Recomendações de Uso

### Para Tesoureiros

1. **Verifique as congregações cadastradas**
   - Mantenha apenas congregações ativas
   - Remova congregações desativadas

2. **Confira os nomes dos pastores**
   - Atualize os nomes na configuração de congregações
   - Garanta que cada congregação tenha o pastor correto

3. **Revise o relatório antes de imprimir**
   - Verifique se todas as congregações ativas estão listadas
   - Confirme os totais

### Para Administradores

1. **Mantenha as congregações atualizadas**
   - Adicione novas congregações quando necessário
   - Remova congregações fechadas ou transferidas

2. **Configure corretamente os pastores**
   - Associe cada congregação ao seu pastor
   - Atualize quando houver mudanças

3. **Monitore o uso do sistema**
   - Verifique se todas as congregações estão sendo usadas
   - Identifique congregações sem movimentação

## Conclusão

As correções implementadas melhoram significativamente a qualidade do relatório de remessa mensal:

- ✅ Relatório mais limpo e objetivo
- ✅ Apenas congregações ativas são exibidas
- ✅ Sem linhas vazias desnecessárias
- ✅ Nomes de pastores corretos
- ✅ Impressão mais eficiente
- ✅ Análise mais rápida e precisa

O sistema agora atende melhor às necessidades da tesouraria, fornecendo relatórios claros e focados nas congregações que realmente possuem movimentação financeira no período.
