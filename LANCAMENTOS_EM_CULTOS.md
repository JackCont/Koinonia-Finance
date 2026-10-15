# Guia de Uso - Lançamentos Diretos no Módulo de Cultos

## 🎯 Nova Funcionalidade

Agora é possível criar lançamentos financeiros **diretamente dentro do módulo de Cultos**, vinculados automaticamente ao culto selecionado. Isso otimiza o fluxo de trabalho e elimina erros de digitação.

---

## ✨ Benefícios

### 1. **Ganho de Tempo Operacional**
- ✅ Não precisa navegar entre módulos
- ✅ Dados do culto (data, competência) são pré-preenchidos automaticamente
- ✅ Lançamentos são salvos diretamente no módulo de Lançamentos

### 2. **Redução de Erros**
- ✅ Data e competência sempre corretas (vinculadas ao culto)
- ✅ CultoId preenchido automaticamente
- ✅ Impossível vincular lançamento ao culto errado

### 3. **Visão Consolidada**
- ✅ Veja todos os lançamentos do culto em um só lugar
- ✅ Totais de entradas, saídas e saldo calculados automaticamente
- ✅ Histórico financeiro completo do culto

---

## 📋 Como Usar

### Passo 1: Acessar o Culto
1. Vá em **"Cultos"** no menu lateral
2. Localize o culto desejado na lista
3. Clique no ícone de **olho** (👁️) para visualizar os detalhes

### Passo 2: Criar Novo Lançamento
1. No modal de detalhes do culto, clique em **"+ Novo Lançamento"**
2. O formulário abrirá com os dados do culto já preenchidos:
   - ✅ **Data:** Data do culto (automático)
   - ✅ **Competência:** Mês do culto (automático)
   - ✅ **Culto:** Vinculado automaticamente

### Passo 3: Preencher o Lançamento
Preencha os campos do lançamento:

**Campos obrigatórios:**
- **Tipo:** ENTRADA ou SAÍDA
- **Categoria:** Selecione a categoria apropriada
- **Descrição:** Ex: "Dízimo João Silva"
- **Valor:** Valor em R$

**Campos opcionais:**
- **Membro:** Vincular a um dizimista/ofertante
- **Congregação:** Selecionar a congregação

### Passo 4: Salvar
1. Clique em **"Salvar Lançamento"**
2. O lançamento será:
   - ✅ Salvo no módulo de Lançamentos
   - ✅ Vinculado ao culto automaticamente
   - ✅ Visível na lista de lançamentos do culto
   - ✅ Incluído nos cálculos de totais

### Passo 5: Verificar Totais
Após salvar, os cards de totais serão atualizados automaticamente:
- **Entradas:** Soma de todos os lançamentos de entrada
- **Saídas:** Soma de todos os lançamentos de saída
- **Saldo:** Entradas - Saídas

---

## 🎨 Interface Visual

### Modal de Detalhes do Culto

```
┌─────────────────────────────────────────────────────────┐
│ Detalhes do Culto                                    [X]│
├─────────────────────────────────────────────────────────┤
│ Nome: Culto de Domingo Manhã                            │
│ Data: 31 de janeiro de 2026                             │
│ Tipo: [Culto]                                           │
│ Competência: Janeiro/2026                               │
│                                                         │
│ Lançamentos Vinculados            [+ Novo Lançamento]   │
│ ─────────────────────────────────────────────────────── │
│                                                         │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐                │
│ │ ENTRADAS │ │ SAÍDAS   │ │ SALDO    │                │
│ │ 2.500,00 │ │ 1.800,00 │ │  700,00  │                │
│ └──────────┘ └──────────┘ └──────────┘                │
│                                                         │
│ ┌───────────────────────────────────────────────────┐  │
│ │ 🟢 Dízimo João Silva                    +500,00 🗑️│  │
│ │    DIZIMO                                         │  │
│ ├───────────────────────────────────────────────────┤  │
│ │ 🟢 Oferta Maria Souza                   +300,00 🗑️│  │
│ │    OFERTA                                         │  │
│ ├───────────────────────────────────────────────────┤  │
│ │ 🔴 Conta de Luz                         -200,00 🗑️│  │
│ │    DESPESA_LUZ                                    │  │
│ └───────────────────────────────────────────────────┘  │
│                                                         │
│ Total de Lançamentos: 3                                 │
│                                                         │
│ [Fechar]                              [Editar Culto]   │
└─────────────────────────────────────────────────────────┘
```

### Modal de Novo Lançamento

```
┌─────────────────────────────────────────────────────────┐
│ Novo Lançamento                                      [X]│
│ Vinculado a: Culto de Domingo Manhã                     │
├─────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────┐│
│ │ Data: 31/01/2026        Competência: 01/2026        ││
│ └─────────────────────────────────────────────────────┘│
│                                                         │
│ Tipo: [ENTRADA ▼]        Categoria: [DIZIMO ▼]         │
│                                                         │
│ Descrição: [Dízimo João Silva_________________________]│
│                                                         │
│ Valor: [500,00________]   Membro: [João Silva ▼]       │
│                                                         │
│ Congregação: [Jacuí-MG ▼]                               │
│                                                         │
│ [Cancelar]                              [Salvar]       │
└─────────────────────────────────────────────────────────┘
```

---

## 🔄 Integração com Módulo de Lançamentos

### Sincronização Automática

Os lançamentos criados no módulo de Cultos são **automaticamente sincronizados** com o módulo de Lançamentos:

1. **Criação:**
   - Lançamento é salvo via `saveTransaction()`
   - `cultoId` é preenchido automaticamente
   - `data` e `competencia` vêm do culto

2. **Visualização:**
   - Aparece na lista de lançamentos do módulo "Lançamentos"
   - Pode ser filtrado por culto (futuro)
   - Inclui todos os cálculos normais (remessa, saldo, etc.)

3. **Edição/Exclusão:**
   - Pode ser editado/excluído tanto no módulo de Cultos quanto no de Lançamentos
   - Alterações são refletidas em ambos os módulos

---

## 📊 Exemplos de Uso

### Exemplo 1: Culto de Domingo com Dízimos e Ofertas

**Cenário:** Culto no dia 31/01/2026 com 5 dízimos e 3 ofertas

**Passo a passo:**
1. Criar o culto "Culto de Domingo - 31/01"
2. Clicar em "Novo Lançamento"
3. Criar 5 lançamentos de entrada (DIZIMO):
   - João Silva: R$ 500,00
   - Maria Souza: R$ 300,00
   - Pedro Santos: R$ 400,00
   - Ana Oliveira: R$ 250,00
   - Carlos Lima: R$ 350,00
4. Criar 3 lançamentos de entrada (OFERTA):
   - Oferta 1: R$ 200,00
   - Oferta 2: R$ 150,00
   - Oferta 3: R$ 100,00

**Resultado:**
- ✅ Total de entradas: R$ 2.250,00
- ✅ 8 lançamentos vinculados ao culto
- ✅ Todos aparecem no módulo de Lançamentos
- ✅ Cálculo de remessa: R$ 337,50 (15%)

### Exemplo 2: Culto com Despesas

**Cenário:** Culto com despesas de som e iluminação

**Passo a passo:**
1. Criar lançamentos de entrada (dízimos/ofertas): R$ 2.000,00
2. Criar lançamentos de saída:
   - Aluguel de som: R$ 300,00
   - Iluminação: R$ 200,00

**Resultado:**
- ✅ Entradas: R$ 2.000,00
- ✅ Saídas: R$ 500,00
- ✅ Saldo: R$ 1.500,00
- ✅ Visão completa do resultado financeiro do culto

### Exemplo 3: EBD com Materiais

**Cenário:** Escola Bíblica Dominical com compra de materiais

**Passo a passo:**
1. Criar culto tipo "EBD"
2. Criar lançamento de oferta: R$ 500,00
3. Criar lançamento de saída (DESPESA_DIVERSAS): R$ 150,00
   - Descrição: "Materiais didáticos EBD"

**Resultado:**
- ✅ Entrada: R$ 500,00
- ✅ Saída: R$ 150,00
- ✅ Saldo: R$ 350,00
- ✅ Controle completo de receitas e despesas da EBD

---

## 🎯 Casos de Uso Avançados

### 1. **Conferência de Valores**
- Crie todos os lançamentos do culto
- Verifique os totais no modal
- Compare com os valores recebidos fisicamente
- Garante precisão e transparência

### 2. **Prestação de Contas**
- Exporte a lista de lançamentos do culto
- Gere relatório financeiro por culto
- Facilita auditoria e prestação de contas

### 3. **Análise por Tipo de Culto**
- Compare resultados financeiros entre tipos:
  - Cultos regulares
  - EBDs
  - Reuniões
  - Eventos especiais
- Identifique padrões e otimize recursos

### 4. **Controle de Provisões**
- Crie lançamentos de provisão diretamente no culto
- Vincule provisões a eventos específicos
- Controle uso de reservas por culto

---

## 🔧 Funcionalidades Técnicas

### Pré-preenchimento Automático

Ao clicar em "Novo Lançamento" dentro de um culto:

```typescript
setTransactionForm({
  ...emptyTransaction,
  data: viewingCulto.data,                    // Data do culto
  competencia: viewingCulto.data.substring(0, 7), // Mês do culto
  cultoId: viewingCulto.id,                   // ID do culto
});
```

### Cálculo de Totais

```typescript
const entradas = cultoTransactions
  .filter(t => t.tipo === 'ENTRADA')
  .reduce((sum, t) => sum + t.valor, 0);

const saidas = cultoTransactions
  .filter(t => t.tipo === 'SAIDA')
  .reduce((sum, t) => sum + t.valor, 0);

const saldo = entradas - saidas;
```

### Sincronização com Módulo de Lançamentos

```typescript
// Salvar lançamento
saveTransaction(transaction);

// Atualizar lista local
setTransactions(getTransactions());

// Lançamento aparece automaticamente no módulo de Lançamentos
```

---

## 🐛 Solução de Problemas

### Problema 1: Lançamento não aparece no módulo de Lançamentos
**Solução:**
- Recarregue a página (F5)
- Verifique se o lançamento foi salvo corretamente
- Confirme que o `cultoId` está preenchido

### Problema 2: Totais não atualizam
**Solução:**
- Feche e reabra o modal do culto
- Verifique se os lançamentos foram salvos
- Confirme que não há erros no console

### Problema 3: Não consigo excluir lançamento
**Solução:**
- Confirme a exclusão no diálogo
- Verifique se você tem permissão (MASTER/ADMIN)
- Recarregue a página se necessário

---

## 📈 Métricas e Relatórios

### Dados Disponíveis

Para cada culto, você tem:
- ✅ Total de lançamentos
- ✅ Total de entradas
- ✅ Total de saídas
- ✅ Saldo final
- ✅ Lista detalhada de cada lançamento
- ✅ Categoria de cada lançamento
- ✅ Membro vinculado (se houver)

### Análises Possíveis

1. **Rentabilidade por Culto:**
   - Quais cultos geram mais receita?
   - Quais cultos têm mais despesas?
   - Qual o saldo médio por tipo de culto?

2. **Eficiência Operacional:**
   - Tempo para criar lançamentos
   - Erros de digitação eliminados
   - Consistência de dados

3. **Tendências:**
   - Evolução mensal por tipo de culto
   - Sazonalidade de receitas/despesas
   - Crescimento ou declínio

---

## 🎓 Boas Práticas

### 1. **Crie o Culto Primeiro**
- Sempre crie o culto antes de adicionar lançamentos
- Isso garante que data e competência estejam corretas

### 2. **Use Descrições Claras**
- Ex: "Dízimo João Silva" em vez de apenas "Dízimo"
- Facilita identificação e auditoria

### 3. **Vincule Membros Quando Possível**
- Permite gerar relatórios por membro
- Facilita prestação de contas individual

### 4. **Revise os Totais**
- Sempre confira os totais antes de fechar o culto
- Garante precisão dos dados

### 5. **Exclua Lançamentos com Cuidado**
- A exclusão é permanente
- Confirme antes de excluir

---

## 🚀 Próximos Passos (Futuro)

### Funcionalidades Planejadas:
- [ ] Exportar lançamentos do culto para CSV/Excel
- [ ] Gerar relatório financeiro por culto
- [ ] Comparar cultos do mesmo tipo
- [ ] Dashboard de métricas por culto
- [ ] Integração com sistema de membros
- [ ] Notificações de lançamentos pendentes

---

## 📞 Suporte

Se encontrar problemas ou tiver sugestões:
1. Verifique o console do navegador (F12) para erros
2. Consulte o RELATÓRIO_DE_DESENVOLVIMENTO.md
3. Entre em contato com o suporte técnico

---

**Data:** 31/01/2026  
**Versão:** 1.1  
**Status:** ✅ Funcionalidade implementada e testada
