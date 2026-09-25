# Correções na Remessa Mensal - Janeiro 2026

## Problemas Corrigidos

### 1. Página não abria
**Problema:** A página de Remessa Mensal não estava abrindo.

**Causa:** Erro de sintaxe no código TypeScript relacionado ao campo `data` das transações.

**Solução:** Corrigida a sintaxe no arquivo `src/pages/Remittance.tsx` para usar corretamente o campo `data` das transações.

### 2. Dados não eram puxados conforme competência
**Problema:** A remessa mensal estava filtrando apenas pela data de pagamento, ignorando o campo de competência contábil.

**Causa:** O filtro estava usando apenas `t.data` (data de pagamento) e não considerava `t.competencia` (competência contábil).

**Solução:** Implementado sistema de filtro duplo:
- **Modo "Data Pagamento":** Filtra transações pela data efetiva de pagamento (comportamento original)
- **Modo "Competência":** Filtra transações pela competência contábil (novo comportamento)

## Novas Funcionalidades

### Alternância entre Modos de Filtro

Adicionado botão de alternância na página de Remessa Mensal:

```
[Data Pagamento] [Competência]
```

- **Data Pagamento:** Mostra transações pagas no mês selecionado
- **Competência:** Mostra transações com competência no mês selecionado

### Informação Visual do Modo Ativo

Adicionada informação clara sobre qual modo está ativo:

```
Modo de filtro: Competência Contábil
(Mostra transações com competência no mês selecionado)
```

ou

```
Modo de filtro: Data de Pagamento
(Mostra transações pagas no mês selecionado)
```

## Como Usar

### Cenário 1: Missões de Agosto pagas em Setembro

**Situação:**
- Missões referentes a agosto/2024
- Pagas em 15/09/2024

**Como registrar:**
- Data: 15/09/2024
- Competência: 2024-08
- Categoria: MISSOES
- Valor: R$ 1.000,00

**Resultado na Remessa:**
- **Modo "Data Pagamento" (Setembro):** Aparece em setembro
- **Modo "Competência" (Agosto):** Aparece em agosto

### Cenário 2: Aluguel de Setembro pago em Outubro

**Situação:**
- Aluguel referente a setembro/2024
- Pago em 10/10/2024

**Como registrar:**
- Data: 10/10/2024
- Competência: 2024-09
- Categoria: DESPESA_ALUGUEL
- Valor: R$ 2.000,00

**Resultado na Remessa:**
- **Modo "Data Pagamento" (Outubro):** Aparece em outubro
- **Modo "Competência" (Setembro):** Aparece em setembro

## Arquivos Modificados

### src/pages/Remittance.tsx

1. **Adicionado estado para controle do modo de filtro:**
   ```typescript
   const [filterByCompetencia, setFilterByCompetencia] = useState(false);
   ```

2. **Corrigido filtro de transações:**
   ```typescript
   const monthTx = transactions.filter(t => {
     if (t.estornada) return false;
     
     if (filterByCompetencia) {
       // Filtrar por competência
       const comp = t.competencia || t.data.substring(0, 7);
       return comp === selectedMonth;
     } else {
       // Filtrar por data de pagamento
       const d = parseISO(t.data);
       return d >= monthStart && d <= monthEnd;
     }
   });
   ```

3. **Adicionados botões de alternância:**
   ```typescript
   <div className="flex items-center gap-2 bg-slate-100 rounded-xl p-1">
     <button 
       onClick={() => setFilterByCompetencia(false)}
       className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
         !filterByCompetencia ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-800'
       }`}>
       Data Pagamento
     </button>
     <button 
       onClick={() => setFilterByCompetencia(true)}
       className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
         filterByCompetencia ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-800'
       }`}>
       Competência
     </button>
   </div>
   ```

4. **Adicionada informação visual do modo ativo:**
   ```typescript
   <p className="text-sm text-indigo-700 mt-2">
     <strong>Modo de filtro:</strong> {filterByCompetencia ? 'Competência Contábil' : 'Data de Pagamento'}
     <span className="text-indigo-500 ml-2">
       {filterByCompetencia 
         ? '(Mostra transações com competência no mês selecionado)' 
         : '(Mostra transações pagas no mês selecionado)'}
     </span>
   </p>
   ```

## Testes Realizados

1. ✅ Página abre corretamente
2. ✅ Filtro por data de pagamento funciona
3. ✅ Filtro por competência funciona
4. ✅ Alternância entre modos funciona
5. ✅ Informação visual do modo ativo é exibida
6. ✅ Exportação CSV funciona em ambos os modos
7. ✅ Impressão funciona em ambos os modos

## Build

- Build realizado com sucesso
- Sem erros de compilação
- Arquivos gerados em `dist/`

## Recomendações de Uso

### Para Tesouraria

Use o **Modo "Data Pagamento"** quando:
- Precisar saber o fluxo de caixa real do mês
- Quiser ver quando o dinheiro efetivamente saiu/entrou
- Estiver conciliando com extrato bancário

### Para Contabilidade

Use o **Modo "Competência"** quando:
- Precisar gerar balancete contábil correto
- Quiser ver o resultado real de cada mês
- Estiver preparando demonstrações financeiras
- Precisar atender aos princípios contábeis

### Exemplo Prático

**Setembro/2024:**

**Modo "Data Pagamento":**
- Dízimos recebidos em setembro: R$ 5.000,00
- Missões pagas em setembro (ref. agosto): R$ 1.000,00
- Aluguel de setembro (pago em outubro): NÃO APARECE

**Modo "Competência":**
- Dízimos com competência em setembro: R$ 5.000,00
- Missões com competência em setembro: R$ 0,00 (foram pagas em setembro, mas competência é agosto)
- Aluguel com competência em setembro: R$ 2.000,00 (mesmo pago em outubro)

## Conclusão

As correções implementadas garantem que:
1. A página de Remessa Mensal abre corretamente
2. O usuário pode escolher entre filtrar por data de pagamento ou competência
3. A informação sobre o modo ativo é clara e visível
4. O sistema atende tanto às necessidades da tesouraria (fluxo de caixa) quanto da contabilidade (regime de competência)
