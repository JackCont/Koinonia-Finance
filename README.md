# ⛪ Gestão de Tesouraria - IEAD

Sistema completo de gestão financeira para igrejas evangélicas de pequeno e micro portes.

---

## 🚀 Como Iniciar o Aplicativo

### Opção 1: Script Automático (Recomendado)

**Windows:**
```
Clique duas vezes no arquivo: INICIAR.bat
```

**Linux/Mac:**
```bash
chmod +x INICIAR.sh
./INICIAR.sh
```

### Opção 2: Manual

1. **Abra o terminal** na pasta do projeto
2. **Instale as dependências** (apenas na primeira vez):
   ```bash
   npm install
   ```
3. **Inicie o servidor**:
   ```bash
   npm run dev
   ```
4. **Abra o navegador** em: `http://localhost:3000`

---

## 📋 Requisitos

- **Node.js** versão 18 ou superior ([Download](https://nodejs.org/))
- **Navegador** moderno (Chrome, Firefox, Edge, Safari)

---

## 🔐 Primeiro Acesso

Após iniciar o servidor, acesse `http://localhost:3000` e use as credenciais fornecidas pelo administrador do sistema.

**Credenciais padrão (apenas para configuração inicial):**
- Usuário: `admin`
- Senha: `admin123`

⚠️ **Importante:** Altere a senha após o primeiro acesso!

---

## 📖 Funcionalidades

### 🏠 Painel (Dashboard)
- Visão geral das finanças
- Gráficos de tendência
- Maiores contribuintes
- Ações rápidas

### 👥 Membros
- Cadastro completo de dizimistas
- Histórico de contribuições
- Ativação/desativação de membros
- Importação via CSV

### 💰 Lançamentos
- Registro de dízimos e ofertas
- Controle de despesas por categoria
- Estorno de transações
- Vínculo com membros

### 📊 Compromissos
- Controle de despesas fixas
- Alertas de vencimento
- Frequência personalizável

### 📄 Remessa Mensal
- Planilha no modelo oficial
- Cálculo automático de remessa
- Percentuais configuráveis por período
- Impressão em paisagem

### 💹 Fluxo de Caixa
- Visão mensal e anual
- Gráficos comparativos
- Exportação em CSV

### 📈 Relatórios
- Balancete de verificação
- Listagem de dizimistas
- Histórico individual
- Resumo geral

### ⚙️ Configurações
- Dados da igreja
- Congregações
- Regras de remessa por período
- Categorias financeiras
- Ministérios

### 👤 Administração (Master/Admin)
- Gestão de usuários
- Perfis de acesso
- Controle de permissões

---

## 💾 Backup e Restauração

O sistema armazena todos os dados localmente no navegador com chave de integridade.

**Fazer Backup:**
1. Acesse "Importar/Exportar"
2. Clique em "Gerar Backup"
3. Salve o arquivo JSON

**Restaurar Backup:**
1. Acesse "Importar/Exportar"
2. Clique em "Restaurar Backup"
3. Selecione o arquivo JSON

---

## 📁 Estrutura do Projeto

```
├── src/
│   ├── pages/          # Páginas do aplicativo
│   ├── store.ts        # Gerenciamento de dados
│   ├── types.ts        # Definições de tipos
│   ├── App.tsx         # Componente principal
│   └── main.tsx        # Ponto de entrada
├── dist/               # Arquivos de produção (gerado pelo build)
├── INICIAR.bat         # Script Windows
├── INICIAR.sh          # Script Linux/Mac
└── README.md           # Este arquivo
```

---

## 🔧 Comandos Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia servidor de desenvolvimento |
| `npm run build` | Gera versão de produção |
| `npm run preview` | Visualiza versão de produção |

---

## 🆘 Solução de Problemas

### Página em branco ao abrir
- Verifique se o servidor está rodando (`npm run dev`)
- Acesse `http://localhost:3000` (não abra o arquivo HTML diretamente)

### Erro "Node.js não está instalado"
- Instale o Node.js: https://nodejs.org/
- Reinicie o terminal após instalar

### Erro ao instalar dependências
```bash
npm cache clean --force
npm install
```

### Porta 3000 já está em uso
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <numero> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

---

## 📞 Suporte

Para dúvidas ou problemas, entre em contato com o suporte técnico da sua região.

---

## 📝 Licença

Sistema desenvolvido para uso interno da IEAD.

---

**Versão:** 2.0.0  
**Última atualização:** 2026
