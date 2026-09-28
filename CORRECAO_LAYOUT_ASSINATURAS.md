# Correção do Layout de Assinaturas na Planilha de Remessa

## 📋 Problema Identificado

Os espaços para assinatura dos tesoureiros e pastores estavam posicionados **abaixo** da tabela principal de despesas, comprometendo a legibilidade e a organização visual da planilha.

## ✅ Solução Implementada

### Layout Reestruturado

**ANTES:**
```
┌─────────────────────────────────────────────────────────────┐
│ TABELA DE DESPESAS                                          │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│ TABELA DE PASTOR                                            │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│ SALDO                                                       │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│ ASSINATURAS (abaixo, ocupando linha inteira)                │
│ [TESOUREIRO SETORIAL] [PASTOR SETORIAL]                     │
│ [PASTOR REGIONAL]     [TESOUREIRO SEDE]                     │
└─────────────────────────────────────────────────────────────┘
```

**DEPOIS:**
```
┌──────────────────────────────────┬──────────────────────────┐
│ TABELA DE PASTOR                 │                          │
│ ┌────────────────────────────┐   │                          │
│ │ ORD │ CONG │ PASTOR │ VAL  │   │                          │
│ │  1  │ ...  │ ...    │ ...  │   │                          │
│ └────────────────────────────┘   │                          │
│                                  │  ____________________    │
│ SALDO (E = A - B - C - D)        │  TESOUREIRO SETORIAL     │
│ R$ X.XXX,XX                      │                          │
│                                  │  ____________________    │
│                                  │  PASTOR SETORIAL         │
│                                  │                          │
│                                  │  ____________________    │
│                                  │  PASTOR REGIONAL         │
│                                  │                          │
│                                  │  ____________________    │
│                                  │  TESOUREIRO SEDE         │
└──────────────────────────────────┴──────────────────────────┘
```

## 🔧 Alterações Técnicas

### Arquivo Modificado
- `src/pages/Remittance.tsx`

### Mudanças Realizadas

1. **Removida a seção de assinaturas separada** (linhas 421-452)
   - Eliminado o bloco que criava assinaturas abaixo do saldo

2. **Criado layout com Grid de 2 colunas**
   ```tsx
   <div className="grid grid-cols-2 gap-4 mb-6">
   ```

3. **Coluna Esquerda: Tabela de PASTOR + SALDO**
   - Tabela de despesas com pastor (simplificada, sem colunas de assinatura)
   - Cálculo do saldo (E = A - B - C - D)
   - Data e local

4. **Coluna Direita: Espaços para Assinaturas**
   - 4 espaços empilhados verticalmente
   - Cada espaço com:
     - Linha para assinatura (`border-t border-slate-400`)
     - Margem superior de 64px (`mt-16`) para espaço de assinatura
     - Nome do cargo centralizado
   - Espaçamento entre assinaturas: `mb-8`

### Código Implementado

```tsx
{/* PASTOR + ASSINATURAS LATERAIS */}
<div className="grid grid-cols-2 gap-4 mb-6">
  {/* Coluna Esquerda: Tabela de PASTOR + SALDO */}
  <div>
    <h2>PASTOR</h2>
    <table>
      {/* Tabela simplificada sem colunas de assinatura */}
    </table>
    
    {/* SALDO */}
    <div>
      SALDO (E = A - B - C - D): R$ X.XXX,XX
    </div>
  </div>

  {/* Coluna Direita: Espaços para Assinaturas */}
  <div className="flex flex-col justify-between">
    {/* Tesoureiro Setorial */}
    <div className="mb-8">
      <div className="border-t border-slate-400 pt-2 mt-16 text-center">
        <p className="text-xs font-semibold">TESOUREIRO SETORIAL</p>
      </div>
    </div>

    {/* Pastor Setorial */}
    <div className="mb-8">
      <div className="border-t border-slate-400 pt-2 mt-16 text-center">
        <p className="text-xs font-semibold">PASTOR SETORIAL</p>
      </div>
    </div>

    {/* Pastor Regional */}
    <div className="mb-8">
      <div className="border-t border-slate-400 pt-2 mt-16 text-center">
        <p className="text-xs font-semibold">PASTOR REGIONAL</p>
      </div>
    </div>

    {/* Tesoureiro Sede */}
    <div>
      <div className="border-t border-slate-400 pt-2 mt-16 text-center">
        <p className="text-xs font-semibold">TESOUREIRO SEDE</p>
      </div>
    </div>
  </div>
</div>
```

## 📊 Benefícios da Nova Disposição

### 1. **Legibilidade Preservada**
- ✅ Tabela principal de despesas não é comprometida
- ✅ Informações financeiras ficam claras e organizadas
- ✅ Não há quebra de fluxo visual

### 2. **Uso Eficiente do Espaço**
- ✅ Aproveitamento da largura da página (layout paisagem)
- ✅ Assinaturas organizadas verticalmente
- ✅ Sem desperdício de espaço horizontal

### 3. **Organização Profissional**
- ✅ Dados financeiros à esquerda (foco principal)
- ✅ Assinaturas à direita (complementar)
- ✅ Separação clara entre informações e validações

### 4. **Impressão Otimizada**
- ✅ Layout aproveita melhor a página A4 paisagem
- ✅ Assinaturas não ocupam página adicional
- ✅ Tudo em uma única página quando possível

## 🎯 Estrutura Final da Planilha

```
┌─────────────────────────────────────────────────────────────────────┐
│                    PLANILHA MENSAL DE MOVIMENTAÇÃO                  │
│                    Região: SUL DE MINAS GERAIS                      │
│                    Cidade: JACUÍ-MG    Setor: XXX                   │
│                    Ano: 2026    Mês: Fevereiro                      │
├─────────────────────────────────────────────────────────────────────┤
│ RECEITAS DO PERÍODO                                                 │
│ ┌───────────────────────────────────────────────────────────────┐  │
│ │ ORD │ CONGREGAÇÃO │ DÍZIMOS │ OFERTAS │ REC.BRUTA │ REMESSA │  │
│ │  1  │ JACUÍ-MG    │ 2.673,65│  360,15 │  3.033,80 │  606,76 │  │
│ │TOTAL│             │ 2.673,65│  360,15 │  3.033,80 │  606,76 │  │
│ └───────────────────────────────────────────────────────────────┘  │
├─────────────────────────────────────────────────────────────────────┤
│ MISSÕES (tabela separada)                                           │
│ ┌───────────────────────────────────────────────────────────────┐  │
│ │ ORD │ CONGREGAÇÃO │ VALOR                                     │  │
│ │  1  │ JACUÍ-MG    │ 850,00                                    │  │
│ │TOTAL│             │ 850,00                                    │  │
│ └───────────────────────────────────────────────────────────────┘  │
├─────────────────────────────────────────────────────────────────────┤
│ DESPESAS DO PERÍODO                                                 │
│ ┌───────────────────────────────────────────────────────────────┐  │
│ │ ORD │ CONG │ ÁGUA │ LUZ │ ALUG │ IPTU │ JUBIL │ ... │ TOTAL │  │
│ │  1  │ ...  │ ...  │ ... │ ...  │ ...  │ ...   │ ... │ ...   │  │
│ │TOTAL│      │ ...  │ ... │ ...  │ ...  │ ...   │ ... │ ...   │  │
│ └───────────────────────────────────────────────────────────────┘  │
├──────────────────────────────────┬──────────────────────────────────┤
│ PASTOR                           │                                  │
│ ┌────────────────────────────┐   │  ____________________________    │
│ │ ORD │ CONG │ PASTOR │ VAL  │   │  TESOUREIRO SETORIAL           │
│ │  1  │ ...  │ ...    │ ...  │   │                                  │
│ │TOTAL│      │        │ ...  │   │  ____________________________    │
│ └────────────────────────────┘   │  PASTOR SETORIAL                 │
│                                  │                                  │
│ SALDO (E = A - B - C - D)        │  ____________________________    │
│ R$ 1.327,04                      │  PASTOR REGIONAL                 │
│                                  │                                  │
│ Jacuí/MG, 24 de março de 2026    │  ____________________________    │
│                                  │  TESOUREIRO SEDE                 │
└──────────────────────────────────┴──────────────────────────────────┘
```

## 🖨️ Resultado na Impressão

### Vantagens
- ✅ **Tudo em uma página** (quando possível)
- ✅ **Dados financeiros** lado a lado com **área de validação**
- ✅ **Fluxo lógico**: Dados → Cálculos → Assinaturas
- ✅ **Não compromete** a legibilidade das tabelas principais

### Espaçamento
- **Margem superior para assinatura**: 64px (`mt-16`)
- **Espaço entre assinaturas**: 32px (`mb-8`)
- **Linha para assinatura**: 1px (`border-t`)
- **Gap entre colunas**: 16px (`gap-4`)

## 📝 Notas de Implementação

### Por que Grid de 2 Colunas?
- Aproveita a largura da página A4 paisagem (297mm)
- Mantém as tabelas financeiras com largura adequada
- Reserva espaço lateral para assinaturas sem quebrar o layout

### Por que Assinaturas Empilhadas?
- Mais fácil de assinar (uma abaixo da outra)
- Aproveita melhor o espaço vertical disponível
- Mantém alinhamento visual consistente

### Por que mt-16 (64px)?
- Espaço suficiente para assinatura manuscrita
- Não compromete o layout das tabelas
- Padrão profissional para documentos financeiros

## ✅ Build e Testes

- ✅ Build concluído sem erros
- ✅ Layout responsivo mantido
- ✅ Impressão otimizada para paisagem
- ✅ Espaços de assinatura adequados

## 🎯 Resumo

A correção reestrutura o layout da planilha de remessa, movendo os espaços de assinatura da parte inferior para a lateral direita, ao lado da tabela de despesas com pastor e saldo. Isso preserva a legibilidade das tabelas principais e aproveita melhor o espaço da página em formato paisagem.

**Arquivo modificado:** `src/pages/Remittance.tsx`  
**Build:** Concluído com sucesso  
**Status:** ✅ Pronto para uso
