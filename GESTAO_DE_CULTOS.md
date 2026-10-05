# Gestão de Cultos - Nova Funcionalidade

## 🎯 Visão Geral

Foi criada uma página completa de **Gestão de Cultos** que permite planejar, criar, editar e excluir cultos de forma organizada, com visualização detalhada dos lançamentos vinculados a cada culto.

---

## 📍 Localização

**Menu Lateral:** Cultos (ícone de calendário 📅)

**Acesso:** Disponível para usuários com perfis MASTER, ADMIN e TESOURARIA

---

## ✨ Funcionalidades Principais

### 1. **Listagem de Cultos**

Visualização em tabela com as seguintes informações:
- **Data** do culto (formato dd/MM/yyyy)
- **Nome** do culto
- **Tipo** (Culto, EBD, Reunião, Evento) com cores distintas
- **Lançamentos** vinculados (quantidade)
- **Valor Total** dos lançamentos vinculados
- **Ações** (Ver, Editar, Excluir)

### 2. **Filtros Avançados**

#### Busca por Nome
- Campo de pesquisa que filtra cultos pelo nome
- Busca em tempo real enquanto digita

#### Filtro por Competência (Mês)
- Seletor de mês/ano para filtrar cultos de um período específico
- Exemplo: "2026-01" para janeiro de 2026
- Útil para planejamento mensal

#### Filtro por Tipo
- Dropdown para filtrar por tipo de evento:
  - Todos os tipos
  - Culto
  - EBD (Escola Bíblica Dominical)
  - Reunião
  - Evento

### 3. **Estatísticas em Tempo Real**

Três cards no topo mostram:
- **Total de Cultos:** Quantidade de cultos filtrados
- **Lançamentos Vinculados:** Soma de todos os lançamentos dos cultos exibidos
- **Valor Total Vinculado:** Soma dos valores de todos os lançamentos

### 4. **Criar Novo Culto**

Botão "Novo Culto" abre modal com:
- **Nome do Culto** (obrigatório)
  - Ex: "Culto de Domingo Manhã", "EBD - Jovens"
- **Data** (obrigatório)
  - Seletor de data
  - Define automaticamente a competência
- **Tipo** (obrigatório)
  - Culto, EBD, Reunião ou Evento
- **Observações** (opcional)
  - Campo de texto livre para informações adicionais
  - Ex: "Pregador: Pr. João Silva", "Tema: Fé"

### 5. **Editar Culto Existente**

Botão de edição (ícone de lápis) permite:
- Alterar nome do culto
- Corrigir data
- Mudar tipo
- Atualizar observações
- **Importante:** Lançamentos vinculados NÃO são afetados

### 6. **Excluir Culto**

Botão de exclusão (ícone de lixeira) com confirmação:
- Se o culto tiver lançamentos vinculados, mostra aviso:
  - "Este culto possui X lançamento(s) vinculado(s). Deseja realmente excluí-lo? Os lançamentos NÃO serão excluídos."
- Se não tiver lançamentos, confirmação simples
- **Importante:** Lançamentos vinculados permanecem no sistema, mas perdem o vínculo com o culto

### 7. **Visualizar Detalhes do Culto**

Botão de visualização (ícone de olho) abre modal com:
- **Informações do Culto:**
  - Nome
  - Data (formato completo: "25 de janeiro de 2026")
  - Tipo (com cor)
  - Competência (mês/ano)
  - Observações (se houver)

- **Lançamentos Vinculados:**
  - Lista completa de todos os lançamentos vinculados
  - Cada lançamento mostra:
    - Indicador visual (verde para entrada, vermelho para saída)
    - Descrição (ou "Sem descrição")
    - Categoria
    - Valor (com sinal + ou -)
  - **Total de Lançamentos:** Quantidade
  - **Valor Total:** Soma de todos os valores

- **Ações:**
  - Botão "Fechar"
  - Botão "Editar Culto" (acesso rápido)

---

## 🎨 Interface Visual

### Cores por Tipo de Culto

- **Culto:** Azul (bg-blue-100 text-blue-700)
- **EBD:** Verde (bg-green-100 text-green-700)
- **Reunião:** Roxo (bg-purple-100 text-purple-700)
- **Evento:** Laranja (bg-orange-100 text-orange-700)

### Ordenação

- Cultos são ordenados automaticamente por data (mais recente primeiro)
- Facilita visualização dos cultos mais recentes

### Responsividade

- Tabela com scroll horizontal em telas pequenas
- Modal de formulário adaptável
- Modal de detalhes com scroll vertical

---

## 🔄 Fluxo de Trabalho

### Cenário 1: Planejamento Mensal

1. Acesse "Cultos" no menu lateral
2. Filtre pelo mês desejado (ex: "2026-02")
3. Clique em "Novo Culto"
4. Preencha os dados:
   - Nome: "Culto de Domingo Manhã"
   - Data: "2026-02-01"
   - Tipo: "Culto"
   - Observações: "Pregador: Pr. João"
5. Repita para todos os cultos do mês
6. Visualize estatísticas no topo

### Cenário 2: Correção de Erro

1. Identifique o culto com erro na listagem
2. Clique no ícone de edição (lápis)
3. Corrija as informações necessárias
4. Clique em "Salvar Alterações"
5. Lançamentos vinculados permanecem intactos

### Cenário 3: Análise de Culto

1. Localize o culto na listagem
2. Clique no ícone de visualização (olho)
3. Veja todos os detalhes:
   - Informações do culto
   - Lista de lançamentos vinculados
   - Totais (quantidade e valor)
4. Se necessário, clique em "Editar Culto"

### Cenário 4: Exclusão de Culto

1. Localize o culto na listagem
2. Clique no ícone de exclusão (lixeira)
3. Leia a mensagem de confirmação:
   - Se tiver lançamentos: aviso sobre vínculos
   - Se não tiver: confirmação simples
4. Confirme a exclusão
5. Culto é removido, lançamentos permanecem

---

## 💡 Casos de Uso

### 1. **Planejamento de Cultos**
- Criar todos os cultos do mês antes do início
- Definir pregadores e temas nas observações
- Ter visão geral do mês

### 2. **Correção de Dados**
- Corrigir data de culto cadastrado incorretamente
- Atualizar nome do pregador nas observações
- Mudar tipo de evento (ex: de "Reunião" para "Culto")

### 3. **Análise Financeira**
- Ver total arrecadado em cada culto
- Identificar cultos com maior/menor arrecadação
- Comparar cultos do mesmo tipo

### 4. **Prestação de Contas**
- Exportar lista de cultos do período
- Mostrar lançamentos vinculados a cada culto
- Comprovar arrecadação por evento

### 5. **Gestão de EBD**
- Criar cultos de EBD semanalmente
- Vincular lançamentos de ofertas da EBD
- Acompanhar arrecadação por classe

---

## 🔧 Implementação Técnica

### Arquivo Criado
- `src/pages/CultsManagement.tsx`

### Dependências
- `lucide-react` para ícones
- `date-fns` para formatação de datas
- `uuid` para geração de IDs
- Store functions: `getCultos`, `saveCulto`, `deleteCulto`, `getTransactions`

### Estado Gerenciado
```typescript
const [cultos, setCultos] = useState(getCultos());
const [search, setSearch] = useState('');
const [filterMonth, setFilterMonth] = useState('');
const [filterType, setFilterType] = useState<string>('all');
const [showForm, setShowForm] = useState(false);
const [editingCulto, setEditingCulto] = useState<Culto | null>(null);
const [viewingCulto, setViewingCulto] = useState<Culto | null>(null);
```

### Funções Principais
- `getTransactionCount(cultoId)`: Conta lançamentos vinculados
- `getTransactionTotal(cultoId)`: Soma valores dos lançamentos
- `handleSave()`: Cria ou atualiza culto
- `handleEdit(culto)`: Prepara formulário para edição
- `handleDelete(id)`: Exclui culto com confirmação
- `handleView(culto)`: Abre modal de detalhes

### Integração com Lançamentos
- Cultos são vinculados através do campo `cultoId` em `Transaction`
- Ao selecionar culto no formulário de lançamento:
  - Data é ajustada automaticamente
  - Competência é ajustada automaticamente
- Lançamentos podem existir sem culto vinculado

---

## 📊 Estatísticas e Relatórios

### Cards de Estatísticas
1. **Total de Cultos:** Soma de cultos filtrados
2. **Lançamentos Vinculados:** Soma de todos os lançamentos
3. **Valor Total Vinculado:** Soma de todos os valores

### Visualização na Tabela
- Cada linha mostra:
  - Quantidade de lançamentos do culto
  - Valor total dos lançamentos do culto
- Facilita identificação de cultos sem lançamentos

---

## ✅ Vantagens

### 1. **Organização**
- Centraliza gestão de cultos em um único local
- Facilita planejamento mensal
- Permite visualização completa

### 2. **Flexibilidade**
- Criação prévia de cultos
- Edição a qualquer momento
- Exclusão com segurança

### 3. **Controle**
- Visualização de lançamentos vinculados
- Estatísticas em tempo real
- Filtros avançados

### 4. **Integração**
- Vínculo automático com lançamentos
- Ajuste automático de data e competência
- Manutenção de vínculos ao editar

### 5. **Segurança**
- Confirmação antes de excluir
- Aviso sobre lançamentos vinculados
- Lançamentos não são excluídos automaticamente

---

## 🎯 Resumo

A página de **Gestão de Cultos** proporciona:

✅ **Planejamento:** Criar cultos previamente por competência  
✅ **Organização:** Listagem com filtros avançados  
✅ **Visualização:** Detalhes completos com lançamentos vinculados  
✅ **Edição:** Corrigir informações a qualquer momento  
✅ **Controle:** Estatísticas em tempo real  
✅ **Segurança:** Confirmações antes de exclusões  
✅ **Integração:** Vínculo automático com lançamentos  

**Status:** ✅ Pronto para uso!

---

## 📝 Notas de Uso

### Boas Práticas

1. **Planeje com antecedência:** Crie cultos antes do início do mês
2. **Use observações:** Registre pregadores, temas, informações importantes
3. **Verifique antes de excluir:** Confira se há lançamentos vinculados
4. **Utilize filtros:** Organize por mês ou tipo para melhor visualização
5. **Analise estatísticas:** Use os cards para ter visão geral rápida

### Limitações Conhecidas

- Lançamentos não são excluídos automaticamente ao excluir culto
- Não há validação de data duplicada (mesmo nome e data)
- Não há importação em massa de cultos (apenas criação individual)

### Futuras Melhorias

- [ ] Importação de cultos via CSV
- [ ] Exportação de lista de cultos
- [ ] Calendário visual de cultos
- [ ] Notificações de cultos próximos
- [ ] Templates de cultos recorrentes
