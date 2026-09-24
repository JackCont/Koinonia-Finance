# Guia Rápido de Uso

## 🚀 Primeiros Passos

### 1. Acessar o Sistema
- Abra o arquivo `dist/index.html` no navegador
- Ou execute `npm run dev` para modo desenvolvimento
- Clique em **"Acessar Sistema"** na tela de boas-vindas

### 2. Fazer Login
**Credenciais padrão:**
- Usuário: `admin`
- Senha: `admin123`

⚠️ **IMPORTANTE**: Após o primeiro acesso, altere a senha em Configurações → Administração → Usuários

### 3. Configuração Inicial

#### Dados da Igreja
1. Menu lateral → **Configurações**
2. Preencha:
   - Nome da igreja
   - CNPJ
   - Endereço completo
   - Pastor presidente
   - Tesoureiro responsável

#### Congregações (se houver múltiplas)
1. Em **Configurações** → **Congregações**
2. Clique em **"Nova Congregação"**
3. Informe: nome, cidade, pastor responsável
4. Salve

#### Regras de Remessa
1. Em **Configurações** → **Regras de Remessa**
2. Configure o percentual padrão (ex: 20%)
3. Defina período de vigência (data início e fim)
4. Para períodos diferentes, adicione novas regras

### 4. Cadastrar Membros

1. Menu → **Membros**
2. Clique em **"Novo Membro"**
3. Preencha os dados:
   - Nome completo *
   - CPF
   - Telefone
   - Email
   - Endereço
   - Data de nascimento
   - Data de admissão
   - Congregação
   - Ministérios (selecione os que participa)
4. Status: **ATIVO** (padrão)
5. Clique em **Salvar**

**Dica**: Para importar vários membros de uma vez:
- Menu → **Importar/Exportar**
- Baixe o modelo CSV de membros
- Preencha os dados
- Importe o arquivo

### 5. Registrar Lançamentos

#### Entrada (Dízimo/Oferta)
1. Menu → **Lançamentos**
2. Clique em **"Novo Lançamento"**
3. Tipo: **ENTRADA**
4. Categoria: **Dízimo** ou **Oferta**
5. Valor: R$ 100,00
6. Descrição: "Dízimo João Silva - Fevereiro/2026"
7. Membro: selecione o dizimista
8. Congregação: selecione
9. Data: data do recebimento
10. Clique em **Salvar**

#### Saída (Despesa)
1. Tipo: **SAIDA**
2. Categoria: selecione (Água, Luz, Aluguel, etc.)
3. Valor: R$ 500,00
4. Descrição: "Conta de luz - Fevereiro/2026"
5. Anexo: número do comprovante (opcional)
6. Clique em **Salvar**

### 6. Gerar Remessa Mensal

1. Menu → **Remessa Mensal**
2. Selecione o mês de referência
3. O sistema mostra automaticamente:
   - Total de dízimos
   - Total de ofertas
   - Receita bruta
   - Remessa calculada (percentual configurado)
   - Total de despesas por categoria
   - Saldo final
4. Opções:
   - **Imprimir**: gera PDF em formato paisagem
   - **Exportar CSV**: salva planilha

### 7. Consultar Relatórios

#### Balancete de Verificação
1. Menu → **Relatórios**
2. Selecione: **Balancete**
3. Escolha o período (data início e fim)
4. Visualize ou exporte

#### Relação de Dizimistas
1. Menu → **Relatórios**
2. Selecione: **Relação de Dizimistas**
3. Escolha o período
4. Mostra: nome, total de dízimos, total de ofertas, total geral
5. Exporte em CSV ou imprima

#### Histórico Individual
1. Menu → **Relatórios**
2. Selecione: **Histórico Individual**
3. Escolha o membro
4. Visualize todas as contribuições
5. Exporte ou imprima

### 8. Fluxo de Caixa

1. Menu → **Fluxo de Caixa**
2. Selecione o ano
3. Visualize:
   - Gráfico mensal de entradas/saídas
   - Saldo acumulado
   - Tendência dos últimos 6 meses
4. Clique em um mês para ver detalhes

### 9. Backup e Restauração

#### Fazer Backup
1. Menu → **Importar/Exportar**
2. Clique em **"Gerar Backup"**
3. Arquivo JSON será baixado
4. Guarde em local seguro

#### Restaurar Backup
1. Clique em **"Restaurar Backup"**
2. Selecione o arquivo JSON
3. Confirme a operação
4. Sistema verifica integridade e restaura

⚠️ **ATENÇÃO**: A restauração substitui TODOS os dados atuais!

### 10. Gerenciar Usuários (Apenas MASTER/ADMIN)

1. Menu → **Administração**
2. Clique em **"Novo Usuário"**
3. Preencha:
   - Nome completo
   - Usuário (login)
   - Senha
   - Perfil de acesso
   - Congregação (opcional)
4. Salve

**Perfis disponíveis:**
- **MASTER**: Acesso total
- **ADMIN**: Gestão completa
- **TESOURARIA**: Lançamentos e relatórios
- **CONSELHO**: Apenas visualização
- **CONTADOR**: Relatórios contábeis

## 💡 Dicas Importantes

### Estorno de Lançamento
- Não delete lançamentos incorretos
- Use a função **"Estornar"**
- Informe o motivo
- O sistema cria lançamento compensatório

### Importação em Massa
- Use modelos CSV fornecidos pelo sistema
- Respeite o formato (separador: ponto e vírgula ";")
- Valide os dados antes de importar

### Backup Regular
- Faça backup semanalmente
- Guarde em múltiplos locais (nuvem, HD externo)
- Teste a restauração periodicamente

### Impressão
- Remessa mensal: formato paisagem (A4)
- Relatórios: formato retrato (A4)
- Use "Imprimir" do navegador para PDF

## 🔍 Solução de Problemas

### Esqueci a senha
- Apenas usuário MASTER pode resetar
- Acesse: Administração → Usuários → Editar → Nova senha

### Dados sumiram
- Verifique se não limpou o cache do navegador
- Restaure o último backup
- Dados ficam no localStorage do navegador

### Erro ao importar CSV
- Verifique o formato (separador ";")
- Confira os cabeçalhos
- Valide datas (formato: dd/mm/aaaa)
- Valores numéricos sem vírgula (use ponto)

### Remessa com valor errado
- Verifique as regras de remessa em Configurações
- Confira o período de vigência
- Ajuste o percentual se necessário

## 📞 Suporte

Para mais informações:
1. Consulte o README.md
2. Verifique a documentação interna
3. Entre em contato com o administrador do sistema

---

**Bom uso do sistema!** 🙏
