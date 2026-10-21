# 🏦 Koinonia Finance

**Gestão Financeira para Igrejas Evangélicas**  
Versão 1.3 | Janeiro 2026

---

## 🚀 Início Rápido

### Windows
```bash
# Clique duas vezes em INICIAR.bat
```

### Linux/Mac
```bash
chmod +x INICIAR.sh
./INICIAR.sh
```

### Manual
```bash
# 1. Instalar dependências Python
pip install -r requirements.txt

# 2. Instalar dependências Node.js
npm install

# 3. Buildar frontend
npm run build

# 4. Iniciar servidor
python iniciar.py
```

**Acesse:** http://localhost:8080

**Login padrão:**
- Usuário: `admin`
- Senha: `admin123`

---

## 📋 Requisitos

- **Python 3.8+** - [Download](https://www.python.org/downloads/)
- **Node.js 18+** - [Download](https://nodejs.org/)

---

## 💾 Armazenamento

Os dados são salvos localmente em `data.json` no formato JSON.

**Backup:**
1. Acesse "Importar/Exportar" no menu
2. Clique em "Gerar Backup"
3. Salve o arquivo em local seguro

**Restauração:**
1. Acesse "Importar/Exportar" no menu
2. Clique em "Restaurar Backup"
3. Selecione o arquivo de backup

---

## 🌐 Acesso em Rede Local

Para acessar de outros dispositivos na mesma rede WiFi:

1. Descubra o IP do seu computador:
   - **Windows:** `ipconfig` → procure por "IPv4"
   - **Linux/Mac:** `ifconfig` ou `ip addr`

2. Acesse de outro dispositivo:
   ```
   http://[SEU-IP]:8080
   ```

**Exemplo:** Se seu IP é `192.168.1.100`, acesse:
```
http://192.168.1.100:8080
```

---

## 📱 Compatibilidade

- ✅ Desktop (Chrome, Firefox, Edge, Safari)
- ✅ Tablet (responsivo)
- ✅ Mobile (Android/iOS)

---

## 🎯 Funcionalidades

### Gestão Financeira
- ✅ Controle de dízimos e ofertas
- ✅ Gestão de despesas por categoria
- ✅ Remessa mensal (modelo oficial)
- ✅ Fluxo de caixa (regime de caixa e competência)
- ✅ Sistema de provisões (reserva de emergência)

### Gestão de Pessoas
- ✅ Cadastro de membros com fotos
- ✅ Gestão de congregações
- ✅ Controle de pastores com vigência
- ✅ Ministérios e departamentos

### Relatórios
- ✅ Balancete de verificação
- ✅ Listagem de dizimistas
- ✅ Histórico individual
- ✅ Relatório de provisões
- ✅ Exportação CSV e impressão

### Recursos Avançados
- ✅ Lançamentos em lote por culto
- ✅ Gestão de membros em lote (CSV)
- ✅ Valores fixos configuráveis (Missões, Jubilados)
- ✅ Personalização de cores (6 temas)
- ✅ Sistema de autenticação com perfis

---

## 🔐 Perfis de Acesso

| Perfil | Acesso |
|--------|--------|
| **MASTER** | Total (igrejas, usuários, configurações) |
| **ADMIN** | Amplo (dentro de uma igreja) |
| **TESOURARIA** | Lançamentos, membros, relatórios |
| **CONFERENTE** | Operacional (dentro de uma congregação) |
| **USER** | Lançamentos e relatórios básicos |
| **CONSELHO** | Visualização de relatórios |
| **CONTADOR** | Relatórios, remessas e provisões |

---

## 🛠️ Desenvolvimento

### Modo Desenvolvimento
```bash
npm run dev
```
Acesse: http://localhost:3000

### Build para Produção
```bash
npm run build
```

### Verificar Tipos
```bash
npm run typecheck
```

---

## 📁 Estrutura do Projeto

```
koinonia-finance/
├── src/                    # Código fonte React
│   ├── App.tsx            # Componente principal
│   ├── main.tsx           # Ponto de entrada
│   ├── store.ts           # Gerenciamento de dados
│   ├── sync.ts            # Sistema de sincronização
│   ├── types.ts           # Definições de tipos
│   └── pages/             # Páginas da aplicação
├── dist/                   # Build de produção
├── server.py              # Servidor backend local
├── iniciar.py             # Script de inicialização
├── INICIAR.bat            # Script Windows
├── INICIAR.sh             # Script Linux/Mac
├── requirements.txt       # Dependências Python
├── package.json           # Dependências Node.js
└── data.json              # Dados locais (gerado automaticamente)
```

---

## 🐛 Solução de Problemas

### Servidor não inicia
```bash
# Verifique se as portas estão livres
netstat -ano | findstr :8080  # Windows
lsof -i :8080                 # Linux/Mac

# Mate o processo se necessário
taskkill /PID [numero] /F     # Windows
kill -9 [numero]              # Linux/Mac
```

### Erro de dependências
```bash
# Reinstale dependências Python
pip install -r requirements.txt --force-reinstall

# Reinstale dependências Node.js
rm -rf node_modules package-lock.json
npm install
```

### Frontend não carrega
```bash
# Rebuild o frontend
npm run build

# Limpe o cache do navegador
Ctrl+Shift+Delete (Windows)
Cmd+Shift+Delete (Mac)
```

---

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique o console do navegador (F12)
2. Consulte o RELATÓRIO_DE_DESENVOLVIMENTO.md
3. Entre em contato com o suporte técnico

---

## 📄 Licença

**Desenvolvido para:** IEAD - Igreja Evangélica Assembleia de Deus  
**Licença:** Uso interno da igreja  
**Todos os direitos reservados**

---

**Koinonia Finance** - Gestão Financeira Eclesiástica Moderna

**Versão:** 1.3  
**Data:** 20/10/2026  
**Status:** ✅ Produção - Pronto para uso local
