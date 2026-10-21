# 🚀 Guia Rápido - Koinonia Finance

**Gestão Financeira para Igrejas Evangélicas**  
Versão 1.3 | Outubro 2026

---

## ✅ Correções Aplicadas

- ✅ Nome atualizado: "Koinonia Finance - Gestão Financeira para Igrejas Evangélicas"
- ✅ Porta padrão: 3000
- ✅ Datas corrigidas: Outubro 2026
- ✅ Tela de login com nome correto
- ✅ Servidor configurado para servir arquivos buildados

---

## 📋 Como Iniciar (3 Passos Simples)

### Passo 1: Instalar Dependências Python
```bash
pip install -r requirements.txt
```

### Passo 2: Iniciar o Servidor

**Windows:**
```bash
INICIAR.bat
```

**Linux/Mac:**
```bash
chmod +x INICIAR.sh
./INICIAR.sh
```

**Manual:**
```bash
# Se a pasta dist/ não existir ou estiver vazia:
npm run build

# Iniciar o servidor:
python server.py
```

### Passo 3: Acessar o Aplicativo

Abra o navegador e vá para:
```
http://localhost:3000
```

**Login padrão:**
- Usuário: `admin`
- Senha: `admin123`

---

## 🌐 Acesso em Rede Local

Para acessar de outros dispositivos na mesma rede WiFi:

1. Descubra o IP do seu computador:
   - **Windows:** `ipconfig` → procure por "IPv4"
   - **Linux/Mac:** `ifconfig` ou `ip addr`

2. Acesse de outro dispositivo:
   ```
   http://[SEU-IP]:3000
   ```

   Exemplo: `http://192.168.1.100:3000`

---

## 💾 Armazenamento de Dados

- **Local:** `data.json` (na raiz do projeto)
- **Formato:** JSON
- **Backup:** Use "Importar/Exportar" no menu do aplicativo

---

## 🐛 Solução de Problemas

### Erro 404 - Frontend não encontrado

**Sintoma:** Página mostra "⚠️ Frontend não encontrado"

**Solução:**
```bash
npm run build
python server.py
```

### Erro: "ModuleNotFoundError: No module named 'flask'"

**Solução:**
```bash
pip install -r requirements.txt
```

### Erro: "Address already in use" (porta 3000)

**Solução:**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID [numero] /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

Ou use outra porta:
```bash
PORT=3001 python server.py
```

### Tela de login mostra nome errado

**Solução:**
1. Limpe o cache do navegador (Ctrl+Shift+Delete)
2. Recarregue a página (Ctrl+F5)
3. Ou faça um novo build:
   ```bash
   npm run build
   python server.py
   ```

---

## 📊 Funcionalidades Disponíveis

- ✅ Controle de dízimos e ofertas
- ✅ Gestão de despesas por categoria
- ✅ Remessa mensal (modelo oficial)
- ✅ Fluxo de caixa (regime de caixa e competência)
- ✅ Sistema de provisões (reserva de emergência)
- ✅ Valores fixos (Missões R$ 850, Jubilados R$ 750)
- ✅ Cadastro de membros com fotos
- ✅ Gestão de congregações e pastores
- ✅ Lançamentos em lote por culto
- ✅ Gestão de membros em lote (CSV)
- ✅ Relatórios completos
- ✅ Sistema de autenticação com perfis
- ✅ Personalização de cores (6 temas)
- ✅ Indicador de sincronização (online/offline)
- ✅ Painel geral do MASTER

---

## 🔐 Perfis de Acesso

| Perfil | Acesso |
|--------|--------|
| **MASTER** | Total (igrejas, usuários, configurações) |
| **ADMIN** | Amplo (dentro de uma igreja) |
| **TESOURARIA** | Lançamentos, membros, relatórios |
| **CONFERENTE** | Operacional (dentro de uma congregação) |
| **USER** | Apenas lançamentos e relatórios básicos |
| **CONSELHO** | Visualização de relatórios |
| **CONTADOR** | Relatórios, remessas e provisões |

---

## 📁 Estrutura do Projeto

```
koinonia-finance/
├── server.py              ✅ Servidor Flask (porta 3000)
├── INICIAR.bat            ✅ Script Windows
├── INICIAR.sh             ✅ Script Linux/Mac
├── requirements.txt       ✅ Dependências Python
├── dist/                  ✅ Frontend buildado
│   ├── index.html
│   └── assets/
├── src/                   ✅ Código fonte React
├── package.json           ✅ Dependências Node.js
└── data.json              ✅ Dados locais (gerado automaticamente)
```

---

## 📞 Suporte

Se o problema persistir:
1. Verifique se o Python está instalado: `python --version`
2. Verifique se o Node.js está instalado: `node --version`
3. Faça o build do frontend: `npm run build`
4. Inicie o servidor: `python server.py`
5. Acesse: http://localhost:3000

---

**Koinonia Finance** - Gestão Financeira para Igrejas Evangélicas

**Versão:** 1.3  
**Data:** Outubro 2026  
**Status:** ✅ Pronto para uso local
