# Tesouraria IEAD - Relatório de Desenvolvimento

**Versão:** 1.2 | **Data:** 31/01/2026 | **Status:** ✅ Produção

---

## 📋 Visão Geral

Sistema completo de gestão financeira para igrejas evangélicas, desenvolvido com React, TypeScript e Vite. Inclui controle de dízimos, ofertas, despesas, remessas, provisões, congregações, pastores, cultos e relatórios detalhados.

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

### Stack
- **Frontend:** React 18 + TypeScript
- **Build:** Vite
- **Estilização:** Tailwind CSS
- **Ícones:** Lucide React
- **Datas:** date-fns
- **UUID:** uuid
- **Armazenamento:** localStorage

### Estrutura
```
src/
├── App.tsx              # Componente principal com rotas
├── main.tsx             # Ponto de entrada
├── index.css            # Estilos globais
├── store.ts             # Gerenciamento de dados
├── types.ts             # Definições de tipos
└── pages/               # 20 páginas de funcionalidades
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

### Instalação
```bash
npm install
```

### Desenvolvimento
```bash
npm run dev
```
Acesse: http://localhost:5173

### Produção
```bash
npm run build
python iniciar.py
```
Acesse: http://localhost:8080

### Login Padrão
- **Usuário:** admin
- **Senha:** admin123

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

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique o console do navegador (F12) para erros
2. Consulte este relatório
3. Entre em contato com o suporte técnico

---

**Desenvolvido para IEAD - Igreja Evangélica Assembleia de Deus**
