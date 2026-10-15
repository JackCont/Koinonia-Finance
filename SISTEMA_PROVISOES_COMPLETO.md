# Sistema de Provisões - Guia Completo

## 📋 Visão Geral

O sistema de provisões permite um **controle paralelo e administrativo** da tesouraria, funcionando como uma **reserva de emergência** para despesas inesperadas. As provisões **NÃO interferem automaticamente** no fluxo de caixa, apenas quando o usuário sinaliza explicitamente.

---

## 🎯 Conceitos Fundamentais

### O que é uma Provisão?

Uma provisão é uma **reserva de valores** criada a partir de sobras de um mês para ser utilizada em meses futuros para cobrir despesas específicas ou inesperadas.

**Características:**
- ✅ Controle paralelo ao fluxo de caixa
- ✅ Não afeta automaticamente o saldo do caixa
- ✅ Pode ser utilizada total ou parcialmente
- ✅ Permite uso de múltiplas provisões em um único lançamento
- ✅ Rastreabilidade completa de origem e destino

### Quando Usar Provisões?

**Cenários típicos:**
1. **Sobra de dízimos** em janeiro → reservar para despesas de fevereiro
2. **Reserva de emergência** para manutenção inesperada
3. **Controle de valores** destinados a eventos futuros
4. **Provisão para despesas** sazonais (ex: IPTU anual)

---

## 🚀 Funcionalidades Implementadas

### 1. Criar Provisão a Partir de Lançamento

Ao criar um lançamento de **SAÍDA**, você pode marcar a opção **"Este lançamento cria uma nova provisão"**.

**Como funciona:**
1. Crie um lançamento de saída normalmente
2. Marque o checkbox "Este lançamento cria uma nova provisão"
3. Preencha os dados do lançamento
4. Ao salvar, uma provisão é criada automaticamente no módulo de Provisões
5. O lançamento **NÃO afeta o fluxo de caixa** até a provisão ser utilizada

**Exemplo:**
```
Lançamento:
- Tipo: SAÍDA
- Categoria: Outras Despesas
- Valor: R$ 1.000,00
- Descrição: "Sobra de dízimos janeiro"
- ✅ Este lançamento cria uma nova provisão

Resultado:
- Provisão criada: R$ 1.000,00 disponível para uso futuro
- Fluxo de caixa: NÃO afetado
- Relatório de Provisões: Nova provisão listada
```

### 2. Utilizar Provisão Existente

Ao criar um lançamento de **SAÍDA**, você pode marcar a opção **"Este lançamento utiliza provisão existente"**.

**Como funciona:**
1. Crie um lançamento de saída normalmente
2. Marque o checkbox "Este lançamento utiliza provisão existente"
3. Selecione uma ou mais provisões disponíveis
4. Informe o valor a utilizar de cada provisão (total ou parcial)
5. Marque "Afetar fluxo de caixa" se desejar que o lançamento afete o saldo
6. Ao salvar, as provisões selecionadas têm seu saldo atualizado

**Exemplo:**
```
Lançamento:
- Tipo: SAÍDA
- Categoria: Luz
- Valor: R$ 500,00
- Descrição: "Conta de luz fevereiro"
- ✅ Este lançamento utiliza provisão existente
- Provisão selecionada: "Sobra janeiro" (saldo: R$ 1.000,00)
- Valor utilizado: R$ 500,00
- ✅ Afetar fluxo de caixa

Resultado:
- Lançamento salvo no fluxo de caixa
- Provisão atualizada: saldo restante R$ 500,00
- Relatório de Provisões: Provisão parcialmente utilizada
```

### 3. Uso Múltiplo de Provisões

Você pode utilizar **múltiplas provisões** em um único lançamento.

**Exemplo:**
```
Lançamento: R$ 1.500,00 para conta de luz

Provisões disponíveis:
- Provisão A: saldo R$ 800,00
- Provisão B: saldo R$ 1.000,00

Seleção:
- ✅ Provisão A: utilizar R$ 800,00 (total)
- ✅ Provisão B: utilizar R$ 700,00 (parcial)
- Total utilizado: R$ 1.500,00

Resultado:
- Provisão A: status = UTILIZADA (saldo zerou)
- Provisão B: saldo restante = R$ 300,00
```

---

## 📊 Interface do Usuário

### Seção de Controle de Provisões

Ao selecionar **SAÍDA** no formulário de lançamento, aparece uma seção especial:

```
┌─────────────────────────────────────────────────────────┐
│ Controle de Provisões                                   │
├─────────────────────────────────────────────────────────┤
│ ☐ Este lançamento cria uma nova provisão                │
│   O valor será reservado como provisão para uso futuro. │
│   Não afeta o fluxo de caixa até ser utilizado.         │
│                                                         │
│ ☐ Este lançamento utiliza provisão existente            │
│   Selecione uma ou mais provisões disponíveis para      │
│   cobrir este lançamento.                               │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ Provisões Disponíveis                               │ │
│ ├─────────────────────────────────────────────────────┤ │
│ │ ☑ Sobra de dízimos janeiro                          │ │
│ │   Saldo: R$ 1.000,00                                │ │
│ │   Valor a utilizar: [________]                      │ │
│ │                                                     │ │
│ │ ☐ Reserva manutenção                                │ │
│ │   Saldo: R$ 500,00                                  │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ Total selecionado: R$ 1.000,00                          │
│ Valor do lançamento: R$ 1.500,00                        │
│ Diferença: R$ 500,00                                    │
│                                                         │
│ ☐ Afetar fluxo de caixa                                 │
│   Se marcado, o valor utilizado das provisões será      │
│   descontado do saldo do caixa.                         │
└─────────────────────────────────────────────────────────┘
```

---

## 🔄 Fluxo de Trabalho

### Fluxo 1: Criar Provisão

```
1. Lançamento de Saída
   ↓
2. Marcar "Cria nova provisão"
   ↓
3. Preencher dados
   ↓
4. Salvar
   ↓
5. Provisão criada automaticamente
   ↓
6. Lançamento NÃO afeta fluxo de caixa
```

### Fluxo 2: Utilizar Provisão

```
1. Lançamento de Saída
   ↓
2. Marcar "Utiliza provisão existente"
   ↓
3. Selecionar provisões disponíveis
   ↓
4. Informar valor a utilizar de cada
   ↓
5. Marcar "Afetar fluxo de caixa" (opcional)
   ↓
6. Salvar
   ↓
7. Saldo das provisões atualizado
   ↓
8. Se marcado, fluxo de caixa é afetado
```

### Fluxo 3: Lançamento Normal (sem provisão)

```
1. Lançamento de Saída
   ↓
2. NÃO marcar nenhuma opção de provisão
   ↓
3. Preencher dados normalmente
   ↓
4. Salvar
   ↓
5. Lançamento afeta fluxo de caixa normalmente
```

---

## 💡 Casos de Uso

### Caso 1: Sobra de Dízimos

**Situação:** Em janeiro, a congregação teve R$ 2.000,00 de sobra que será reservada para despesas de fevereiro.

**Passo a passo:**
1. Acesse "Lançamentos"
2. Clique em "Novo Lançamento"
3. Tipo: **SAÍDA**
4. Categoria: **Outras Despesas**
5. Valor: **R$ 2.000,00**
6. Descrição: "Sobra de dízimos janeiro"
7. ✅ Marque "Este lançamento cria uma nova provisão"
8. Salve

**Resultado:**
- Provisão criada: R$ 2.000,00 disponível
- Fluxo de caixa: NÃO afetado
- Relatório de Provisões: Nova provisão listada

### Caso 2: Usar Provisão para Conta de Luz

**Situação:** Em fevereiro, precisa pagar a conta de luz (R$ 500,00) usando a provisão criada em janeiro.

**Passo a passo:**
1. Acesse "Lançamentos"
2. Clique em "Novo Lançamento"
3. Tipo: **SAÍDA**
4. Categoria: **Luz**
5. Valor: **R$ 500,00**
6. Descrição: "Conta de luz fevereiro"
7. ✅ Marque "Este lançamento utiliza provisão existente"
8. Selecione a provisão "Sobra de dízimos janeiro"
9. Valor a utilizar: **R$ 500,00**
10. ✅ Marque "Afetar fluxo de caixa"
11. Salve

**Resultado:**
- Lançamento salvo no fluxo de caixa
- Provisão atualizada: saldo restante R$ 1.500,00
- Relatório de Provisões: Provisão parcialmente utilizada

### Caso 3: Usar Múltiplas Provisões

**Situação:** Precisa pagar R$ 1.800,00 de aluguel usando duas provisões diferentes.

**Passo a passo:**
1. Crie lançamento de saída: R$ 1.800,00
2. ✅ Marque "Utiliza provisão existente"
3. Selecione Provisão A (saldo R$ 1.000,00): utilizar R$ 1.000,00
4. Selecione Provisão B (saldo R$ 1.500,00): utilizar R$ 800,00
5. ✅ Marque "Afetar fluxo de caixa"
6. Salve

**Resultado:**
- Provisão A: status = UTILIZADA (saldo zerou)
- Provisão B: saldo restante = R$ 700,00
- Fluxo de caixa: afetado em R$ 1.800,00

### Caso 4: Provisão sem Afetar Caixa

**Situação:** Quer registrar o uso de provisão, mas não quer que afete o fluxo de caixa ainda.

**Passo a passo:**
1. Crie lançamento de saída normalmente
2. ✅ Marque "Utiliza provisão existente"
3. Selecione a provisão e informe o valor
4. ❌ **NÃO** marque "Afetar fluxo de caixa"
5. Salve

**Resultado:**
- Provisão atualizada (saldo reduzido)
- Fluxo de caixa: **NÃO afetado**
- Lançamento registrado, mas não conta no saldo

---

## 📈 Relatório de Provisões

### Visualização

O relatório de provisões mostra:

1. **Resumo Geral**
   - Total de provisões
   - Total pendente
   - Total utilizado
   - Total cancelado

2. **Provisões por Mês de Destino**
   - Agrupadas por competência de destino
   - Lista detalhada de cada provisão
   - Status e saldo disponível

3. **Provisões por Categoria de Destino**
   - Agrupadas por categoria da despesa
   - Total por categoria
   - Lista de provisões

### Filtros

- ✅ Busca por descrição
- ✅ Filtro por status (Pendente, Utilizada, Cancelada)
- ✅ Filtro por competência de origem
- ✅ Filtro por competência de destino

### Ações

- ✅ Criar nova provisão manualmente
- ✅ Editar provisão existente
- ✅ Marcar como utilizada
- ✅ Marcar como cancelada
- ✅ Reativar provisão cancelada
- ✅ Excluir provisão

---

## 🔧 Regras de Negócio

### Regra 1: Provisão não afeta caixa automaticamente

**Comportamento:**
- Ao criar uma provisão, o lançamento **NÃO afeta** o fluxo de caixa
- A provisão é apenas um controle paralelo
- O saldo do caixa permanece inalterado

**Exceção:**
- Se o usuário marcar "Afetar fluxo de caixa" ao utilizar uma provisão
- Nesse caso, o valor utilizado é descontado do saldo

### Regra 2: Provisão pode ser utilizada parcialmente

**Comportamento:**
- Uma provisão de R$ 1.000,00 pode ser utilizada em partes
- Ex: R$ 300,00 em janeiro, R$ 400,00 em fevereiro, R$ 300,00 em março
- O saldo disponível é atualizado a cada utilização

### Regra 3: Múltiplas provisões em um lançamento

**Comportamento:**
- Um lançamento pode utilizar múltiplas provisões
- O valor total das provisões utilizadas deve ser ≤ valor do lançamento
- A diferença pode ser paga com recursos do caixa (se "Afetar fluxo de caixa" estiver marcado)

### Regra 4: Provisão só aparece se tiver saldo

**Comportamento:**
- Provisões com saldo = 0 não aparecem na lista de disponíveis
- Provisões com status = UTILIZADA não aparecem
- Provisões com status = CANCELADA não aparecem

### Regra 5: Filtro por congregação

**Comportamento:**
- Ao selecionar uma congregação no lançamento, apenas provisões daquela congregação aparecem
- Se não selecionar congregação, todas as provisões disponíveis aparecem

---

## 📊 Impacto no Fluxo de Caixa

### Cenário 1: Criar Provisão

```
Saldo anterior do caixa: R$ 10.000,00

Lançamento: R$ 2.000,00 (cria provisão)
- ✅ "Cria nova provisão"
- ❌ "Afetar fluxo de caixa" (não aplicável)

Saldo após: R$ 10.000,00 (NÃO mudou)
Provisão criada: R$ 2.000,00 disponível
```

### Cenário 2: Utilizar Provisão (afetando caixa)

```
Saldo anterior do caixa: R$ 10.000,00
Provisão disponível: R$ 2.000,00

Lançamento: R$ 500,00 (usa provisão)
- ✅ "Utiliza provisão existente"
- ✅ "Afetar fluxo de caixa"

Saldo após: R$ 9.500,00 (diminuiu R$ 500,00)
Provisão: saldo restante R$ 1.500,00
```

### Cenário 3: Utilizar Provisão (sem afetar caixa)

```
Saldo anterior do caixa: R$ 10.000,00
Provisão disponível: R$ 2.000,00

Lançamento: R$ 500,00 (usa provisão)
- ✅ "Utiliza provisão existente"
- ❌ "Afetar fluxo de caixa"

Saldo após: R$ 10.000,00 (NÃO mudou)
Provisão: saldo restante R$ 1.500,00
Lançamento registrado, mas não conta no saldo
```

---

## 🎯 Boas Práticas

### 1. Documente bem as provisões

**Recomendação:**
- Use descrições claras e detalhadas
- Informe a origem da sobra
- Indique o destino pretendido

**Exemplo:**
```
✅ Bom: "Sobra de dízimos janeiro - reserva para manutenção"
❌ Ruim: "Provisão"
```

### 2. Revise provisões pendentes regularmente

**Recomendação:**
- Mensalmente, revise as provisões pendentes
- Cancelar provisões que não serão mais utilizadas
- Atualizar status conforme uso

### 3. Use provisões para controle, não para caixa

**Recomendação:**
- Provisões são controle administrativo
- Não use para manipular o saldo do caixa
- Mantenha transparência no uso

### 4. Documente o motivo de não afetar o caixa

**Recomendação:**
- Se não marcar "Afetar fluxo de caixa", documente o motivo
- Use o campo de observações
- Mantenha rastreabilidade

---

## 🔍 Auditoria e Rastreabilidade

### Log de Auditoria

Todas as ações com provisões são registradas:

```
[2026-01-15 10:30:00] PROVISAO: Provisão de R$ 2.000,00 salva
[2026-01-20 14:15:00] PROVISAO: Provisão abc123 teve R$ 500,00 utilizado
[2026-01-25 09:00:00] PROVISAO: Provisão abc123 teve R$ 1.500,00 utilizado
```

### Rastreabilidade Completa

Cada provisão contém:
- ✅ Data de criação
- ✅ Competência de origem
- ✅ Competência de destino
- ✅ Valor original
- ✅ Valor utilizado
- ✅ Saldo disponível
- ✅ Status (Pendente, Utilizada, Cancelada)
- ✅ Descrição e observações
- ✅ Congregação
- ✅ Categoria de destino

---

## 📝 Resumo

### O que foi implementado:

1. ✅ **Checkbox "Cria nova provisão"** no formulário de lançamento
2. ✅ **Checkbox "Utiliza provisão existente"** no formulário de lançamento
3. ✅ **Seleção de múltiplas provisões** com valores individuais
4. ✅ **Checkbox "Afetar fluxo de caixa"** para controle de impacto
5. ✅ **Cálculo automático** de saldo disponível
6. ✅ **Validação** de valores (não pode usar mais do que tem)
7. ✅ **Atualização automática** do saldo das provisões
8. ✅ **Filtro por congregação** nas provisões disponíveis
9. ✅ **Documentação completa** e guia de uso

### Benefícios:

- ✅ **Controle paralelo** ao fluxo de caixa
- ✅ **Reserva de emergência** para despesas inesperadas
- ✅ **Rastreabilidade completa** de origem e destino
- ✅ **Flexibilidade** no uso (total ou parcial)
- ✅ **Transparência** nas operações
- ✅ **Auditoria** facilitada

---

**Status:** ✅ Implementação concluída e funcionando!

**Data:** Janeiro 2026  
**Versão:** 2.0.0
