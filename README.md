# Sistema de Tesouraria para Igrejas

Sistema completo de gestão financeira para igrejas evangélicas, desenvolvido com React, TypeScript e Vite.

## 🚀 Funcionalidades

### Gestão de Membros
- Cadastro completo de membros e dizimistas
- Controle de status (ativo/inativo/transferido)
- Histórico de contribuições por membro
- Exportação de relatórios

### Lançamentos Financeiros
- Registro de entradas (dízimos, ofertas, doações)
- Registro de saídas (despesas operacionais, manutenção, pessoal)
- Sistema de estorno com auditoria
- Categorização completa de transações

### Fluxo de Caixa
- Visualização mensal e anual
- Gráficos de tendência
- Comparativo entre períodos
- Saldo acumulado

### Remessa Mensal
- Geração automática de remessa denominacional
- Percentuais configuráveis por período
- Relatório completo de receitas e despesas
- Exportação em formato padrão

### Relatórios
- Balancete de verificação
- Relação de dizimistas
- Histórico individual por membro
- Resumo geral com gráficos

### Segurança
- Sistema de login com perfis de acesso
- Controle de permissões por função
- Backup com chave de integridade
- Auditoria completa de alterações

## 🔐 Perfis de Acesso

- **MASTER**: Acesso total ao sistema
- **ADMIN**: Gestão completa exceto usuários master
- **TESOURARIA**: Lançamentos e relatórios financeiros
- **CONSELHO**: Visualização de relatórios
- **CONTADOR**: Acesso a relatórios contábeis

## 💾 Armazenamento

O sistema utiliza **localStorage** do navegador para armazenamento dos dados, com:
- Backup criptografado com chave de integridade
- Exportação/importação via CSV
- Restauração completa de backups

## 🛠️ Tecnologias

- **React 18** - Framework UI
- **TypeScript** - Tipagem estática
- **Vite** - Build tool
- **Tailwind CSS** - Estilização
- **date-fns** - Manipulação de datas
- **lucide-react** - Ícones
- **uuid** - Geração de IDs únicos

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build
npm run preview
```

## 🎯 Como Usar

### Primeiro Acesso

1. Abra o aplicativo no navegador
2. Clique em "Acessar Sistema" na tela de boas-vindas
3. Faça login com as credenciais padrão:
   - **Usuário**: admin
   - **Senha**: admin123

### Configuração Inicial

1. Acesse **Configurações** no menu lateral
2. Preencha os dados da igreja (nome, CNPJ, endereço)
3. Configure as congregações (se houver múltiplas)
4. Ajuste as regras de remessa por período
5. Personalize as categorias financeiras

### Cadastro de Membros

1. Acesse **Membros** no menu
2. Clique em "Novo Membro"
3. Preencha os dados (nome, CPF, contato, etc.)
4. Selecione a congregação
5. Defina os ministérios
6. Salve o cadastro

### Lançamentos Financeiros

1. Acesse **Lançamentos** no menu
2. Clique em "Novo Lançamento"
3. Selecione o tipo (Entrada/Saída)
4. Escolha a categoria
5. Informe o valor e descrição
6. Vincule a um membro (opcional)
7. Salve o lançamento

### Geração de Remessa

1. Acesse **Remessa Mensal** no menu
2. Selecione o mês de referência
3. O sistema calcula automaticamente:
   - Total de dízimos e ofertas
   - Remessa denominacional (percentual configurado)
   - Total de despesas por categoria
   - Saldo final
4. Exporte em CSV ou imprima o relatório

### Backup e Restauração

1. Acesse **Importar/Exportar** no menu
2. Para backup:
   - Clique em "Gerar Backup"
   - O arquivo JSON será baixado
3. Para restaurar:
   - Clique em "Restaurar Backup"
   - Selecione o arquivo JSON
   - A chave de integridade será verificada

## 📊 Modelos CSV

O sistema fornece modelos CSV para importação em massa:

### Membros
```csv
nome;cpf;email;telefone;endereco;dataNascimento;dataAdmissao;status;ministerios;congregacao;observacoes
João Silva;123.456.789-00;joao@email.com;(35) 99999-0000;Rua A, 123;01/01/1990;01/01/2020;ATIVO;Louvor;JACUÍ-MG;
```

### Lançamentos
```csv
data;tipo;categoria;valor;descricao;congregacao;memberId
01/02/2026;ENTRADA;DIZIMO;2673.65;Dízimos congregação;JACUÍ-MG;
01/02/2026;SAIDA;LUZ;500.00;Conta de luz;JACUÍ-MG;
```

## 🔒 Segurança

- Senhas armazenadas com hash
- Chave de integridade em backups
- Auditoria completa de alterações
- Controle de acesso por perfis
- Dados armazenados localmente

## 📱 Responsivo

O sistema é totalmente responsivo e funciona em:
- Desktop
- Tablet
- Mobile

## 🖨️ Impressão

Relatórios otimizados para impressão:
- Remessa mensal em formato paisagem
- Balancetes e relatórios financeiros
- Histórico de membros

## 📝 Notas

- Os dados são armazenados localmente no navegador
- Faça backups regulares
- Use navegadores modernos (Chrome, Firefox, Edge, Safari)
- Recomendado: mantenha o sistema atualizado

## 🤝 Suporte

Para dúvidas ou suporte, consulte a documentação interna do sistema ou entre em contato com o administrador.

---

**Versão**: 2.0.0  
**Desenvolvido para**: Igrejas Evangélicas  
**Licença**: Uso interno
