# Koinonia Finance - Relatório de Desenvolvimento

**Versão:** 1.3 | **Data:** 20/10/2026 | **Status:** ✅ Produção

---

## 📋 Visão Geral

**Koinonia Finance** é um sistema completo de gestão financeira para igrejas evangélicas, desenvolvido com React, TypeScript e Vite. Inclui controle de dízimos, ofertas, despesas, remessas, provisões, congregações, pastores, cultos e relatórios detalhados.

### Arquitetura Híbrida (v1.3)
- ✅ **Funciona 100% local** (localStorage) - sem servidor necessário
- ✅ **Sincronização opcional** com backend remoto (Render + Supabase)
- ✅ **Modo offline-first** - sempre funciona, mesmo sem internet
- ✅ **Login e usuários** com perfis de acesso
- ✅ **Backup automático** para nuvem quando online

---

## 🎯 Funcionalidades Principais

### Core
- ✅ **Painel Geral do MASTER** - Visão consolidada de todas as igrejas
- ✅ **Gestão de Membros em Lote** - Importação via CSV e salvamento em massa
- ✅ **Lançamentos em Lote por Culto** - Criação múltipla de lançamentos vinculados
- ✅ **Gestão de Igrejas** - CRUD completo com pastores locais e vigência
- ✅ **Sistema de Provisões** - Controle paralelo ao fluxo de caixa
- ✅ **Valores Fixos** - Missões e Jubilados configuráveis com vigência temporal
- ✅ **Lançamentos Diretos em Cultos** - Criação rápida dentro do módulo de cultos

### Módulos
- ✅ Gestão de Membros e Dizimistas (com fotos e ordenação)
- ✅ Controle de Lançamentos (categorização automática, competência contábil)
- ✅ Gestão de Congregações (ativação/inativação por período)
- ✅ Controle de Cultos (CRUD completo com estatísticas)
- ✅ Compromissos Financeiros (com competência contábil)
- ✅ Remessa Mensal (modelo oficial com assinaturas)
- ✅ Fluxo de Caixa (regime de caixa vs competência)
- ✅ Relatórios (balancete, dizimistas, histórico individual)
- ✅ Personalização de Cores (6 temas predefinidos)
- ✅ Backup e Restauração (com chave de integridade)

---

## 🏗️ Arquitetura Técnica

### Stack Tecnológico
- **Frontend:** React 18 + TypeScript
- **Build:** Vite
- **Estilização:** Tailwind CSS
- **Ícones:** Lucide React
- **Datas:** date-fns
- **UUID:** uuid
- **Sincronização:** Sistema automático offline/online
- **Armazenamento:** localStorage (local) + PostgreSQL (remoto opcional)

### Arquitetura Híbrida (v1.3)

```
┌─────────────────────────────────────────────────────────┐
│                    USUÁRIO                               │
│                         │                                │
│                         ▼                                │
│              ┌─────────────────────┐                    │
│              │   Koinonia Finance  │                    │
│              │    (Frontend)       │                    │
│              └─────────┬───────────┘                    │
│                        │                                │
│            ┌───────────┴───────────┐                   │
│            │                       │                   │
│            ▼                       ▼                   │
│   ┌────────────────┐     ┌────────────────┐          │
│   │  localStorage  │     │  Servidor API  │          │
│   │   (Offline)    │     │   (Online)     │          │
│   └────────┬───────┘     └────────┬───────┘          │
│            │                       │                   │
│            └───────────┬───────────┘                   │
│                        │                               │
│                        ▼                               │
│              ┌─────────────────────┐                  │
│              │  SyncManager        │                  │
│              │  • Fila de ops      │                  │
│              │  • Auto-retry       │                  │
│              │  • Status visual    │                  │
│              └─────────────────────┘                  │
└─────────────────────────────────────────────────────────┘
```

**Fluxo de Operação:**
1. **Offline:** Dados salvos no localStorage, operações na fila
2. **Online:** Sincroniza automaticamente com servidor
3. **Reconexão:** Processa fila pendente automaticamente
4. **Fallback:** Se servidor falhar, continua offline

### Estrutura de Arquivos
```
src/
├── App.tsx              # Componente principal com rotas
├── main.tsx             # Ponto de entrada
├── index.css            # Estilos globais
├── store.ts             # Gerenciamento de dados (localStorage)
├── sync.ts              # Sistema de sincronização (online/offline)
├── useSync.ts           # Hook React para sincronização
├── types.ts             # Definições de tipos
└── pages/               # 20 páginas de funcionalidades
    ├── Dashboard.tsx
    ├── Members.tsx
    ├── Transactions.tsx
    ├── Provisions.tsx
    ├── CultsManagement.tsx
    └── ... (15+ páginas)
```

### Perfis de Acesso
- **MASTER:** Acesso total (inclui gestão de igrejas)
- **ADMIN:** Acesso amplo dentro de uma igreja
- **TESOURARIA:** Lançamentos, membros, relatórios
- **CONFERENTE:** Operacional dentro de uma congregação
- **USER:** Apenas lançamentos e relatórios básicos
- **CONSELHO:** Visualização de relatórios
- **CONTADOR:** Relatórios, remessas e provisões

---

## 🚀 Como Usar

### Modo 1: Execução Local (Recomendado para Início)

**Instalação:**
```bash
npm install
```

**Desenvolvimento:**
```bash
npm run dev
```
Acesse: http://localhost:3000

**Produção (servidor local simples):**
```bash
npm run build
npx serve dist -l 3000
```
Acesse: http://localhost:3000

### Modo 2: Deploy Completo (Frontend + Backend)

**Frontend (GitHub Pages):**
- Deploy automático via GitHub Actions
- URL: https://seu-usuario.github.io/koinonia-finance
- Carregamento instantâneo (CDN global)

**Backend (Render):**
- API REST em Python/Flask
- URL: https://koinonia-finance-api.onrender.com
- Auto-sleep (acorda quando recebe requisição)

**Banco de Dados (Supabase):**
- PostgreSQL gerenciado (gratuito)
- Backup automático diário
- Sincronização em tempo real

### Login Padrão
- **Usuário:** admin
- **Senha:** admin123

⚠️ **Importante:** Altere a senha após o primeiro acesso!

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

## 📊 Histórico de Versões

### v1.3 (20/10/2026) - Versão Atual
**Arquitetura Híbrida e Sincronização**
- ✅ Funciona 100% local (localStorage) sem servidor
- ✅ Sistema de sincronização automática offline/online
- ✅ Indicador visual de status (online/offline/fallback)
- ✅ Fila de operações pendentes com retry automático
- ✅ Timeout de 5 segundos com fallback automático
- ✅ Login e autenticação de usuários
- ✅ Perfis de acesso granulares (MASTER, ADMIN, TESOURARIA, etc.)
- ✅ Backup automático para nuvem quando online
- ✅ Pré-carregamento de dados no primeiro acesso
- ✅ Limpeza de arquivos redundantes
- ✅ Documentação consolidada

**Correções Críticas:**
- ✅ Erro de tela branca nas provisões (campo `data`)
- ✅ Sincronização entre componentes (useEffect)
- ✅ Cálculo de remessa (dízimos + ofertas)
- ✅ Filtro de congregações inativas
- ✅ Lançamentos em lote por culto
- ✅ Gestão de membros em lote
- ✅ Painel geral do MASTER

### v1.2 (31/01/2026)
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

### Estrutura de Dados
- **Membros:** Cadastro completo com fotos e ministérios
- **Lançamentos:** Categorias normalizadas, competência contábil
- **Cultos:** Tipos (Culto, EBD, Reunião, Evento)
- **Provisões:** Controle paralelo com status (Pendente, Utilizada, Cancelada)
- **Valores Fixos:** Missões e Jubilados com vigência temporal

### Integrações
- ✅ Cultos vinculados a lançamentos
- ✅ Provisões criadas via checkbox em lançamentos
- ✅ Valores fixos aparecem automaticamente na remessa
- ✅ Congregações com pastor responsável e vigência

---

## 🔐 Sistema de Autenticação

### Perfis de Acesso
- **MASTER:** Acesso total (inclui gestão de igrejas e usuários)
- **ADMIN:** Acesso amplo dentro de uma igreja específica
- **TESOURARIA:** Lançamentos, membros, relatórios
- **CONFERENTE:** Operacional dentro de uma congregação
- **USER:** Apenas lançamentos e relatórios básicos
- **CONSELHO:** Visualização de relatórios e fluxo de caixa
- **CONTADOR:** Relatórios, remessas e provisões

### Login Padrão
- **Usuário:** admin
- **Senha:** admin123

⚠️ **Importante:** Altere a senha após o primeiro acesso!

---

## 💾 Sistema de Backup e Sincronização

### Modo Offline (localStorage)
- ✅ Dados salvos automaticamente no navegador
- ✅ Funciona sem internet
- ✅ Backup manual via "Importar/Exportar"
- ✅ Chave de integridade para validação

### Modo Online (Sincronização Automática)
- ✅ Sincroniza com servidor quando online
- ✅ Fila de operações pendentes
- ✅ Retry automático (3 tentativas)
- ✅ Indicador visual de status (🟢 online / 🟡 offline / 🟠 fallback)
- ✅ Timeout de 5 segundos com fallback automático

### Backup para Nuvem (Opcional)
- ✅ Supabase (PostgreSQL gratuito)
- ✅ Backup automático diário
- ✅ Restauração point-in-time
- ✅ 500 MB gratuito

---

## 🌐 Opções de Deploy

### Opção 1: Apenas Frontend (Mais Simples)
**GitHub Pages + localStorage**
- ✅ Custo: $0
- ✅ Carregamento instantâneo
- ✅ Dados no navegador do usuário
- ✅ Backup manual via exportação
- ⚠️ Dados isolados por dispositivo

### Opção 2: Frontend + Backend (Recomendado)
**GitHub Pages + Render + Supabase**
- ✅ Custo: $0 (free tier)
- ✅ Sincronização automática
- ✅ Dados centralizados
- ✅ Backup automático
- ✅ Multi-dispositivo
- ⚠️ Cold start de ~50s no Render

### Opção 3: Full-Stack Local
**Servidor Python local**
- ✅ Custo: $0
- ✅ Controle total dos dados
- ✅ Sem dependência de internet
- ⚠️ Requer computador ligado

---

## 🚀 Guia de Deploy Rápido

### Deploy no GitHub Pages (Frontend)

1. **Configurar GitHub Pages:**
   - Vá em Settings → Pages
   - Source: GitHub Actions

2. **Criar workflow `.github/workflows/deploy.yml`:**
```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [ main ]
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - uses: actions/setup-node@v3
      with:
        node-version: '18'
    - run: npm ci
    - run: npm run build
    - uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

3. **Push para o GitHub:**
```bash
git add .
git commit -m "Deploy para GitHub Pages"
git push origin main
```

4. **Acessar:**
   - URL: `https://seu-usuario.github.io/koinonia-finance`

### Deploy no Render (Backend - Opcional)

1. **Criar serviço no Render:**
   - Name: `koinonia-finance-api`
   - Environment: Python 3
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `gunicorn wsgi:app`

2. **Configurar variáveis de ambiente:**
   - `DATABASE_URL`: Connection string do Supabase
   - `CORS_ORIGINS`: `https://seu-usuario.github.io`

3. **Deploy automático** a cada push

### Configurar Supabase (Banco de Dados - Opcional)

1. **Criar conta em https://supabase.com**
2. **Criar projeto** `koinonia-finance`
3. **Copiar connection string** do PostgreSQL
4. **Adicionar no Render** como `DATABASE_URL`

---

## 📞 Suporte e Troubleshooting

### Problemas Comuns

**Aplicação não carrega:**
- Verifique o console do navegador (F12)
- Confirme que o build foi feito: `npm run build`
- Verifique se o servidor está rodando

**Dados não sincronizam:**
- Verifique o indicador de status (🟢/🟡/🟠)
- Confirme que a URL do servidor está correta
- Verifique os logs do console

**Erro de CORS:**
- Confirme que o backend permite o domínio do frontend
- Verifique a variável `CORS_ORIGINS` no Render

**Tela branca:**
- Limpe o cache do navegador
- Verifique se há erros no console
- Recarregue a página (F5)

### Recursos de Suporte
1. Console do navegador (F12) para logs de erro
2. Este relatório de desenvolvimento
3. Logs do Render (se usando backend)
4. Suporte técnico da sua região

---

## 🎯 Roadmap Futuro

### Versão 1.4 (Planejada)
- [ ] Notificações push para vencimentos
- [ ] Relatórios em PDF
- [ ] Exportação para Excel
- [ ] Gráficos avançados (Chart.js)
- [ ] App mobile nativo (React Native)

### Versão 2.0 (Planejada)
- [ ] Multi-igreja (holding)
- [ ] Integração bancária (OFX, CNAB)
- [ ] Emissão de recibos automáticos
- [ ] API REST pública
- [ ] Webhooks para integrações

---

## 📄 Licença e Créditos

**Desenvolvido para:** IEAD - Igreja Evangélica Assembleia de Deus  
**Licença:** Uso interno da igreja  
**Todos os direitos reservados**

### Tecnologias Utilizadas
- React 18 - Framework JavaScript para UI
- TypeScript - Superset JavaScript com tipos
- Vite - Build tool ultra-rápido
- Tailwind CSS - Framework CSS utility-first
- Lucide React - Ícones modernos
- date-fns - Manipulação de datas
- uuid - Geração de identificadores únicos

---

**Koinonia Finance** - Gestão Financeira Eclesiástica Moderna e Conectada

**Versão:** 1.3  
**Data:** 20/10/2026  
**Status:** ✅ Produção - Pronto para Deploy
