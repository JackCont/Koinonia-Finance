# Correção do Cálculo de Despesas com Pastor

## 🐛 Problema Identificado

A categoria "Pastor" estava incluindo indevidamente transações de "Outras Despesas" que mencionavam a palavra "pastor" na descrição, mesmo quando a categoria não era DESPESA_PESSOAL.

### Exemplo do Problema

**Antes da correção:**
- Lançamento: "Pastor - combustível para visita"
- Categoria: OUTRAS_DESPESAS
- Valor: R$ 100,00
- ❌ **Incluído** no cálculo de "Pastor" (incorreto)

**Depois da correção:**
- Mesmo lançamento
- Categoria: OUTRAS_DESPESAS
- Valor: R$ 100,00
- ✅ **Incluído** em "Outras Despesas" (correto)
- ✅ **Não incluído** em "Pastor"

---

## 🔍 Causa Raiz

No arquivo `src/pages/Remittance.tsx`, linha 64, o cálculo de pastor estava usando duas condições:

```typescript
// ANTES (INCORRETO)
const pastor = congTx.filter(t => 
  t.categoria === 'DESPESA_PESSOAL' || 
  t.descricao.toLowerCase().includes('pastor')
).reduce((s, t) => s + t.valor, 0);
```

Isso fazia com que **qualquer transação** que tivesse a palavra "pastor" na descrição fosse incluída no cálculo de pastor, independentemente da categoria.

---

## ✅ Solução Implementada

O cálculo agora considera **apenas** transações com categoria `DESPESA_PESSOAL`:

```typescript
// DEPOIS (CORRETO)
const pastor = congTx.filter(t => 
  t.categoria === 'DESPESA_PESSOAL'
).reduce((s, t) => s + t.valor, 0);
```

---

## 📊 Impacto nos Cálculos

### Antes da Correção

```
Transações do mês:
1. "Pastor João - salário" | DESPESA_PESSOAL | R$ 3.000,00
2. "Pastor - combustível"  | OUTRAS_DESPESAS | R$ 100,00
3. "Visita pastoral - lanche" | OUTRAS_DESPESAS | R$ 50,00

Cálculo de Pastor:
- Transação 1: ✅ Incluído (categoria DESPESA_PESSOAL)
- Transação 2: ❌ Incluído indevidamente (descrição contém "pastor")
- Transação 3: ❌ Incluído indevidamente (descrição contém "pastoral")

Total Pastor: R$ 3.150,00 (INCORRETO)
Total Outras Despesas: R$ 0,00 (INCORRETO)
```

### Depois da Correção

```
Mesmas transações:
1. "Pastor João - salário" | DESPESA_PESSOAL | R$ 3.000,00
2. "Pastor - combustível"  | OUTRAS_DESPESAS | R$ 100,00
3. "Visita pastoral - lanche" | OUTRAS_DESPESAS | R$ 50,00

Cálculo de Pastor:
- Transação 1: ✅ Incluído (categoria DESPESA_PESSOAL)
- Transação 2: ❌ Não incluído (categoria diferente)
- Transação 3: ❌ Não incluído (categoria diferente)

Total Pastor: R$ 3.000,00 (CORRETO)
Total Outras Despesas: R$ 150,00 (CORRETO)
```

---

## 🎯 Regra de Negócio

### Categoria "Pastor" (DESPESA_PESSOAL)
- ✅ **Única e exclusivamente** para remuneração do pastor
- ✅ Salário, pró-labore, honorários pastorais
- ❌ **NÃO inclui** despesas operacionais relacionadas ao pastor
- ❌ **NÃO inclui** despesas de visita, combustível, alimentação, etc.

### Categoria "Outras Despesas" (OUTRAS_DESPESAS)
- ✅ Despesas diversas não categorizadas
- ✅ Despesas autorizadas pelo conselho
- ✅ Qualquer despesa que não se encaixe nas categorias específicas
- ✅ **INCLUI** despesas relacionadas ao pastor que não sejam remuneração

---

## 📁 Arquivo Modificado

**`src/pages/Remittance.tsx`**
- Linha 64: Removida verificação por descrição
- Mantida apenas verificação por categoria `DESPESA_PESSOAL`

---

## 🧪 Como Testar

### Teste 1: Lançar Despesa com Pastor na Descrição
1. Acesse **"Lançamentos"**
2. Crie novo lançamento:
   - Tipo: **Saída**
   - Categoria: **Outras Despesas**
   - Descrição: "Pastor - combustível para visita"
   - Valor: R$ 100,00
3. Salve
4. Acesse **"Remessa Mensal"**
5. ✅ Verifique que o valor aparece em **"Desp. Diversas"**
6. ✅ Verifique que **NÃO aparece** em **"Pastor"**

### Teste 2: Lançar Remuneração do Pastor
1. Acesse **"Lançamentos"**
2. Crie novo lançamento:
   - Tipo: **Saída**
   - Categoria: **Pastor** (DESPESA_PESSOAL)
   - Descrição: "Salário Pastor João"
   - Valor: R$ 3.000,00
3. Salve
4. Acesse **"Remessa Mensal"**
5. ✅ Verifique que o valor aparece em **"Pastor"**
6. ✅ Verifique que **NÃO aparece** em **"Outras Despesas"**

### Teste 3: Verificar Cálculo do Saldo
```
Receita Bruta (A): R$ 10.000,00
Remessa 15% (B): R$ 1.500,00
Despesas (C): R$ 2.000,00 (incluindo Outras Despesas)
Pastor (D): R$ 3.000,00 (apenas DESPESA_PESSOAL)

Saldo (E) = A - B - C - D
Saldo (E) = 10.000 - 1.500 - 2.000 - 3.000
Saldo (E) = R$ 3.500,00 ✅
```

---

## 💡 Boas Práticas

### Para Lançar Remuneração do Pastor
- **Categoria:** Pastor (DESPESA_PESSOAL)
- **Descrição:** "Salário Pastor [Nome]" ou "Pró-labore Pastor [Nome]"
- **Exemplos:**
  - "Salário Pastor João - Janeiro/2026"
  - "Pró-labore Pastor Maria"
  - "Honorários pastorais"

### Para Lançar Outras Despesas do Pastor
- **Categoria:** Outras Despesas (OUTRAS_DESPESAS)
- **Descrição:** Detalhar a despesa específica
- **Exemplos:**
  - "Pastor - combustível para visita"
  - "Visita pastoral - alimentação"
  - "Pastor - material de estudo"
  - "Viagem pastoral - hospedagem"

---

## ✅ Benefícios da Correção

1. **Precisão nos Cálculos**
   - ✅ Pastor recebe apenas remuneração
   - ✅ Outras despesas são categorizadas corretamente
   - ✅ Saldo calculado com precisão

2. **Transparência**
   - ✅ Clareza na distinção entre remuneração e despesas
   - ✅ Facilita prestação de contas
   - ✅ Atende requisitos contábeis

3. **Conformidade**
   - ✅ Alinhado com práticas contábeis
   - ✅ Separação correta de despesas
   - ✅ Auditável e rastreável

4. **Relatórios Precisos**
   - ✅ Planilha de remessa com valores corretos
   - ✅ Dashboard com informações precisas
   - ✅ Relatórios confiáveis

---

## 📝 Notas Técnicas

### Por que remover a verificação por descrição?

A verificação por descrição (`t.descricao.toLowerCase().includes('pastor')`) era problemática porque:

1. **Falsa positives:** Qualquer descrição com "pastor" era incluída
2. **Inconsistência:** Dependia de como o usuário escrevia a descrição
3. **Erro de categorização:** Despesas de outras categorias eram incluídas
4. **Dificuldade de auditoria:** Não ficava claro o que compunha "Pastor"

### Por que manter apenas a verificação por categoria?

A verificação por categoria (`t.categoria === 'DESPESA_PESSOAL'`) é:

1. **Consistente:** Sempre a mesma lógica
2. **Previsível:** Usuário sabe exatamente o que será incluído
3. **Auditável:** Fácil de verificar e rastrear
4. **Contábil:** Alinhado com práticas contábeis padrão

---

## 🎯 Resumo

**Problema:** Categoria "Pastor" incluía indevidamente "Outras Despesas" que mencionavam "pastor" na descrição.

**Solução:** Removida verificação por descrição, mantida apenas verificação por categoria `DESPESA_PESSOAL`.

**Resultado:** 
- ✅ Cálculos precisos
- ✅ Categorização correta
- ✅ Transparência total
- ✅ Conformidade contábil

**Arquivo modificado:** `src/pages/Remittance.tsx` (linha 64)  
**Build:** Concluído com sucesso ✅
