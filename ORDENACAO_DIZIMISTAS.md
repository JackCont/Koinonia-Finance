# Ordenação de Dizimistas no Relatório

## 🎯 Melhoria Implementada

Adicionada funcionalidade de ordenação ao relatório de listagem de dizimistas, permitindo ao usuário escolher como organizar a lista.

---

## 📋 Opções de Ordenação Disponíveis

### 1. **Valor (Maior → Menor)** ⬇️
- Ordena os dizimistas pelo valor total contribuído
- Do maior contribuinte para o menor
- **Padrão inicial** do sistema

### 2. **Valor (Menor → Maior)** ⬆️
- Ordena os dizimistas pelo valor total contribuído
- Do menor contribuinte para o maior
- Útil para identificar quem precisa de mais incentivo

### 3. **Nome (A → Z)** 🔤
- Ordena alfabeticamente pelo nome
- De A até Z
- Facilita busca por nome específico

### 4. **Nome (Z → A)** 🔡
- Ordena alfabeticamente pelo nome
- De Z até A
- Ordem alfabética inversa

---

## 🎨 Interface do Usuário

### Localização
O controle de ordenação aparece **apenas quando o relatório de dizimistas está selecionado**.

### Layout
```
┌─────────────────────────────────────────┐
│ Ordenar por:                            │
│ ┌─────────────────────────────────────┐ │
│ │ Valor (Maior → Menor)          ▼   │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

### Opções no Dropdown
- ✅ Valor (Maior → Menor)
- ✅ Valor (Menor → Maior)
- ✅ Nome (A → Z)
- ✅ Nome (Z → A)

---

## 🔄 Comportamento

### Mudança de Ordenação
1. Usuário seleciona o relatório "Listagem de Dizimistas"
2. Dropdown de ordenação aparece automaticamente
3. Usuário seleciona a opção desejada
4. Lista é reordenada instantaneamente
5. Não é necessário recarregar ou aplicar

### Persistência
- A ordenação selecionada é mantida durante a sessão
- Ao mudar para outro relatório e voltar, a ordenação é preservada
- Ao recarregar a página, volta para o padrão (Valor Maior → Menor)

---

## 📊 Exemplos de Uso

### Exemplo 1: Identificar Maiores Contribuintes
**Objetivo:** Reconhecer os dizimistas que mais contribuem

**Ordenação:** Valor (Maior → Menor)

**Resultado:**
```
1. João Silva      - R$ 5.000,00
2. Maria Souza     - R$ 4.500,00
3. Pedro Santos    - R$ 3.800,00
4. Ana Oliveira    - R$ 2.500,00
```

### Exemplo 2: Análise de Engajamento
**Objetivo:** Identificar dizimistas com menor contribuição para ações de incentivo

**Ordenação:** Valor (Menor → Maior)

**Resultado:**
```
1. Carlos Lima     - R$ 100,00
2. Beatriz Costa   - R$ 200,00
3. Lucas Ferreira  - R$ 350,00
4. João Silva      - R$ 5.000,00
```

### Exemplo 3: Busca por Nome
**Objetivo:** Encontrar rapidamente um dizimista específico

**Ordenação:** Nome (A → Z)

**Resultado:**
```
1. Ana Oliveira    - R$ 2.500,00
2. Beatriz Costa   - R$ 200,00
3. Carlos Lima     - R$ 100,00
4. João Silva      - R$ 5.000,00
```

---

## 🔧 Implementação Técnica

### Arquivo Modificado
- `src/pages/Reports.tsx`

### Estado Adicionado
```typescript
const [dizimistasSortBy, setDizimistasSortBy] = useState<
  'total-desc' | 'total-asc' | 'nome-asc' | 'nome-desc'
>('total-desc');
```

### Lógica de Ordenação
```typescript
const dizimistasData = useMemo(() => {
  // ... cálculo dos dados ...
  
  const sortedMembers = Object.values(memberMap);
  
  // Aplicar ordenação selecionada
  switch (dizimistasSortBy) {
    case 'total-desc':
      return sortedMembers.sort((a, b) => b.total - a.total);
    case 'total-asc':
      return sortedMembers.sort((a, b) => a.total - b.total);
    case 'nome-asc':
      return sortedMembers.sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
    case 'nome-desc':
      return sortedMembers.sort((a, b) => b.nome.localeCompare(a.nome, 'pt-BR'));
    default:
      return sortedMembers.sort((a, b) => b.total - a.total);
  }
}, [filteredTx, members, dizimistasSortBy]);
```

### Interface de Seleção
```tsx
{reportType === 'dizimistas' && (
  <div>
    <label className="text-xs font-medium text-slate-600 mb-1 block">
      Ordenar por
    </label>
    <select 
      value={dizimistasSortBy} 
      onChange={e => setDizimistasSortBy(e.target.value as any)}
      className="px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-400 outline-none"
    >
      <option value="total-desc">Valor (Maior → Menor)</option>
      <option value="total-asc">Valor (Menor → Maior)</option>
      <option value="nome-asc">Nome (A → Z)</option>
      <option value="nome-desc">Nome (Z → A)</option>
    </select>
  </div>
)}
```

---

## 💡 Benefícios

### 1. **Flexibilidade de Análise**
- ✅ Diferentes perspectivas dos dados
- ✅ Análise por valor ou por nome
- ✅ Adapta-se a diferentes necessidades

### 2. **Facilidade de Uso**
- ✅ Interface intuitiva com dropdown
- ✅ Mudança instantânea sem recarregar
- ✅ Opções claras com setas indicativas

### 3. **Eficiência Operacional**
- ✅ Rápida identificação de maiores contribuintes
- ✅ Fácil busca por nome específico
- ✅ Análise de engajamento simplificada

### 4. **Tomada de Decisão**
- ✅ Dados organizados conforme necessidade
- ✅ Identificação de padrões
- ✅ Suporte a ações pastorais e administrativas

---

## 🧪 Testes Realizados

### Teste 1: Ordenação por Valor (Maior → Menor)
- ✅ Selecionar relatório de dizimistas
- ✅ Selecionar "Valor (Maior → Menor)"
- ✅ Lista ordenada do maior para o menor valor
- ✅ Primeiro item tem o maior valor total

### Teste 2: Ordenação por Valor (Menor → Maior)
- ✅ Selecionar "Valor (Menor → Maior)"
- ✅ Lista ordenada do menor para o maior valor
- ✅ Primeiro item tem o menor valor total

### Teste 3: Ordenação Alfabética (A → Z)
- ✅ Selecionar "Nome (A → Z)"
- ✅ Lista ordenada alfabeticamente
- ✅ Primeiro item começa com letra próxima de A
- ✅ Ordenação considera acentos e caracteres especiais

### Teste 4: Ordenação Alfabética (Z → A)
- ✅ Selecionar "Nome (Z → A)"
- ✅ Lista ordenada alfabeticamente inversa
- ✅ Primeiro item começa com letra próxima de Z

### Teste 5: Mudança Dinâmica
- ✅ Mudar ordenação várias vezes
- ✅ Lista reordena instantaneamente
- ✅ Dados não são perdidos
- ✅ Performance mantida

### Teste 6: Persistência
- ✅ Mudar para outro relatório
- ✅ Voltar para dizimistas
- ✅ Ordenação selecionada é mantida

---

## 📝 Notas de Uso

### Quando Usar Cada Ordenação

**Valor (Maior → Menor):**
- Reconhecimento de maiores contribuintes
- Relatórios para prestação de contas
- Análise de receita por contribuinte

**Valor (Menor → Maior):**
- Identificação de quem precisa de incentivo
- Análise de engajamento
- Planejamento de ações pastorais

**Nome (A → Z):**
- Busca rápida por nome específico
- Listagem para impressão
- Organização alfabética padrão

**Nome (Z → A):**
- Quando necessário ordem inversa
- Casos específicos de organização

---

## 🎯 Resumo

**Melhoria implementada:**
- ✅ Dropdown de ordenação no relatório de dizimistas
- ✅ 4 opções de ordenação disponíveis
- ✅ Mudança instantânea sem recarregar
- ✅ Interface intuitiva e clara
- ✅ Ordenação por valor ou nome
- ✅ Ordem crescente ou decrescente

**Benefícios:**
- ✅ Flexibilidade de análise
- ✅ Facilidade de uso
- ✅ Eficiência operacional
- ✅ Suporte à tomada de decisão

**Arquivo modificado:** `src/pages/Reports.tsx`  
**Build:** Concluído com sucesso ✅

---

**Status:** ✅ Pronto para uso
