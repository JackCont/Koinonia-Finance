# Koinonia Finance

**Sistema Completo de Gestão Financeira Eclesiástica**

Versão 1.2 | Janeiro 2026 | Status: ✅ Produção

---

## 📋 Visão Geral

Koinonia Finance é um sistema moderno e completo para gestão financeira de igrejas evangélicas, desenvolvido com React, TypeScript e Vite. Oferece controle total de dízimos, ofertas, despesas, remessas, provisões e relatórios detalhados.

---

## 🚀 Funcionalidades Principais

### Core
- ✅ **Painel Geral do MASTER** - Visão consolidada de todas as igrejas
- ✅ **Gestão de Membros em Lote** - Importação via CSV e salvamento em massa
- ✅ **Lançamentos em Lote por Culto** - Criação múltipla de lançamentos vinculados
- ✅ **Sistema de Provisões** - Controle paralelo ao fluxo de caixa
- ✅ **Valores Fixos** - Missões e Jubilados configuráveis com vigência temporal
- ✅ **Sincronização Automática** - Offline-first com sincronização quando online

### Módulos
- ✅ Gestão de Membros e Dizimistas (com fotos e ordenação)
- ✅ Controle de Lançamentos (categorização automática, competência contábil)
- ✅ Gestão de Igrejas e Congregações (ativação/inativação por período)
- ✅ Controle de Cultos (CRUD completo com estatísticas)
- ✅ Compromissos Financeiros (com competência contábil)
- ✅ Remessa Mensal (modelo oficial com assinaturas)
- ✅ Fluxo de Caixa (regime de caixa vs competência)
- ✅ Relatórios (balancete, dizimistas, histórico individual)
- ✅ Personalização de Cores (6 temas predefinidos)
- ✅ Backup e Restauração (com chave de integridade)

---

## 🏗️ Arquitetura

### Stack Tecnológico
- **Frontend:** React 18 + TypeScript
- **Build:** Vite
- **Estilização:** Tailwind CSS
- **Ícones:** Lucide React
- **Datas:** date-fns
- **UUID:** uuid
- **Armazenamento:** localStorage (offline-first)
- **Sincronização:** Sistema automático offline/online

### Estrutura
```
src/
├── App.tsx              # Componente principal com rotas
├── main.tsx             # Ponto de entrada
├── index.css            # Estilos globais
├── store.ts             # Gerenciamento de dados
├── sync.ts              # Sistema de sincronização
├── types.ts             # Definições de tipos
└── pages/               # 20 páginas de funcionalidades
```

---

## 🚀 Como Usar

### Instalação
```bash
npm install
```

### Desenvolvimento
```bash
npm run dev
```
Acesse: http://localhost:5173

### Produção (Servidor Local)
```bash
npm run build
python iniciar.py
```
Acesse: http://localhost:8080

### Login Padrão
- **Usuário:** admin
- **Senha:** admin123

---

## 🌐 Deploy

### Opção 1: GitHub Pages + Render (Recomendado)

**Frontend (GitHub Pages):**
1. Configure o GitHub Pages no repositório
2. O frontend estático será servido instantaneamente
3. URL: `https://seu-usuario.github.io/koinonia-finance`

**Backend (Render):**
1. Crie um Web Service no Render
2. Configure a variável de ambiente `VITE_API_URL`
3. O servidor Python será hospedado automaticamente
4. URL: `https://koinonia-finance.onrender.com`

**Vantagens:**
- ✅ Frontend carrega instantaneamente
- ✅ Backend acorda automaticamente quando necessário
- ✅ Fallback automático para localStorage quando offline
- ✅ Sincronização automática quando online

### Opção 2: Vercel + Render

**Frontend (Vercel):**
1. Conecte o repositório ao Vercel
2. Deploy automático a cada push
3. URL: `https://koinonia-finance.vercel.app`

**Backend (Render):**
- Mesma configuração da Opção 1

### Opção 3: Servidor Local

Use o script `iniciar.py` para rodar tudo localmente:
```bash
python iniciar.py
```

---

## 🔄 Sincronização Automática

O sistema possui sincronização automática offline/online:

### Como Funciona
1. **Offline:** Dados são salvos no localStorage
2. **Online:** Sincroniza automaticamente com o servidor
3. **Fila:** Operações pendentes são processadas quando online
4. **Integridade:** Backup automático com chave de integridade

### Configuração
Configure a URL do servidor em:
- Variável de ambiente: `VITE_API_URL`
- Ou localStorage: `koinonia_server_url`

---

## 📱 Compatibilidade

- ✅ Desktop (Chrome, Firefox, Edge, Safari)
- ✅ Tablet (responsivo)
- ✅ Mobile (Android/iOS)

### Acesso Mobile
1. Inicie o servidor no computador
2. Conecte celular na mesma rede WiFi
3. Acesse: http://[IP-COMPUTADOR]:8080

---

## 💾 Backup

Os dados são salvos no navegador (localStorage).

**Fazer backup:**
1. Acesse "Importar/Exportar"
2. Clique em "Gerar Backup"
3. Salve o arquivo JSON

**Restaurar backup:**
1. Acesse "Importar/Exportar"
2. Clique em "Restaurar Backup"
3. Selecione o arquivo JSON

---

## 📊 Perfis de Acesso

- **MASTER:** Acesso total (inclui gestão de igrejas)
- **ADMIN:** Acesso amplo dentro de uma igreja
- **TESOURARIA:** Lançamentos, membros, relatórios
- **CONFERENTE:** Operacional dentro de uma congregação
- **USER:** Apenas lançamentos e relatórios básicos
- **CONSELHO:** Visualização de relatórios
- **CONTADOR:** Relatórios, remessas e provisões

---

## 📈 Histórico de Versões

### v1.2 (31/01/2026)
- ✅ Renomeado para "Koinonia Finance"
- ✅ Sistema de sincronização automática offline/online
- ✅ Painel Geral do MASTER
- ✅ Gestão de Membros em Lote
- ✅ Lançamentos em Lote por Culto
- ✅ Otimização de performance

### v1.1 (29/01/2026)
- ✅ Sistema de Provisões completo
- ✅ Valores Fixos com vigência temporal
- ✅ Lançamentos diretos em cultos
- ✅ Cards de remessa e provisões

### v1.0 (28/01/2026)
- ✅ Sistema completo de gestão financeira
- ✅ Remessa mensal com modelo oficial
- ✅ Fluxo de caixa com regime de competência
- ✅ Personalização de cores

---

## 🔧 Desenvolvimento

### Comandos
```bash
npm run dev      # Servidor de desenvolvimento
npm run build    # Build para produção
npm run preview  # Preview da build
```

### Variáveis de Ambiente
```env
VITE_API_URL=https://koinonia-finance.onrender.com
```

---

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique o console do navegador (F12) para erros
2. Consulte o RELATÓRIO_DE_DESENVOLVIMENTO.md
3. Entre em contato com o suporte técnico

---

## 📄 Licença

Desenvolvido para uso em igrejas evangélicas  
Todos os direitos reservados

---

**Koinonia Finance** - Gestão Financeira Eclesiástica Moderna
