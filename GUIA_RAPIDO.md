# 🚀 Guia Rápido - Execução Local

## ✅ Correções Aplicadas

1. **Erro de sintaxe corrigido** no `server.py` (linha 66)
2. **Build do frontend** concluído com sucesso
3. **Estrutura simplificada** - apenas o essencial

---

## 📋 Como Iniciar (Passo a Passo)

### 1. Instalar Dependências Python

```bash
pip install -r requirements.txt
```

Isso instala:
- Flask (servidor web)
- Flask-CORS (permite requisições do frontend)
- Gunicorn (servidor de produção)

### 2. Verificar se o Frontend está Buildado

A pasta `dist/` deve conter:
- `index.html`
- `assets/index-*.css`
- `assets/index-*.js`

Se não existir, execute:
```bash
npm run build
```

### 3. Iniciar o Servidor

**Opção A: Script automático (recomendado)**
```bash
# Windows
INICIAR.bat

# Linux/Mac
chmod +x INICIAR.sh
./INICIAR.sh
```

**Opção B: Manual**
```bash
python server.py
```

### 4. Acessar o Aplicativo

Abra o navegador e acesse:
```
http://localhost:8080
```

**Login padrão:**
- Usuário: `admin`
- Senha: `admin123`

---

## 🌐 Acesso em Rede Local

Para acessar de outros dispositivos na mesma rede WiFi:

1. Descubra o IP do seu computador:
   - **Windows:** `ipconfig` → procure por "IPv4 Address"
   - **Linux/Mac:** `ifconfig` ou `ip addr`

2. Acesse de outro dispositivo:
   ```
   http://[SEU-IP]:8080
   ```

   Exemplo: `http://192.168.1.100:8080`

---

## 🐛 Solução de Problemas

### Erro: "ModuleNotFoundError: No module named 'flask'"

**Solução:**
```bash
pip install -r requirements.txt
```

### Erro: "Address already in use" (porta 8080)

**Solução:**
```bash
# Windows
netstat -ano | findstr :8080
taskkill /PID [numero] /F

# Linux/Mac
lsof -ti:8080 | xargs kill -9
```

Ou use outra porta:
```bash
PORT=3000 python server.py
```

### Erro: "dist/index.html not found"

**Solução:**
```bash
npm run build
```

### Página em branco no navegador

**Solução:**
1. Abra o console do navegador (F12)
2. Verifique se há erros
3. Recarregue a página (Ctrl+F5)

---

## 📁 Estrutura Mínima Necessária

```
koinonia-finance/
├── server.py              # Servidor backend
├── requirements.txt       # Dependências Python
├── iniciar.py             # Script de inicialização
├── INICIAR.bat            # Script Windows
├── INICIAR.sh             # Script Linux/Mac
├── dist/                  # Frontend buildado
│   ├── index.html
│   └── assets/
├── src/                   # Código fonte React
├── package.json           # Dependências Node.js
└── data.json              # Dados locais (gerado automaticamente)
```

---

## 💾 Armazenamento de Dados

- **Local:** `data.json` (na raiz do projeto)
- **Formato:** JSON
- **Backup:** Use "Importar/Exportar" no menu do aplicativo

---

## ✅ Checklist de Funcionamento

- [ ] Python 3.8+ instalado
- [ ] Node.js 18+ instalado (apenas para build)
- [ ] Dependências Python instaladas (`pip install -r requirements.txt`)
- [ ] Frontend buildado (pasta `dist/` existe)
- [ ] Servidor iniciado (`python server.py`)
- [ ] Navegador acessa `http://localhost:8080`
- [ ] Login funciona (admin/admin123)

---

## 🎯 Funcionalidades Disponíveis

Todas as funcionalidades desenvolvidas estão disponíveis:

- ✅ Controle de dízimos e ofertas
- ✅ Gestão de despesas por categoria
- ✅ Remessa mensal (modelo oficial)
- ✅ Fluxo de caixa (regime de caixa e competência)
- ✅ Sistema de provisões
- ✅ Valores fixos (Missões, Jubilados)
- ✅ Cadastro de membros com fotos
- ✅ Gestão de congregações e pastores
- ✅ Lançamentos em lote por culto
- ✅ Gestão de membros em lote (CSV)
- ✅ Relatórios completos
- ✅ Sistema de autenticação com perfis
- ✅ Personalização de cores

---

**Status:** ✅ Pronto para uso local!

**Próximo passo:** Execute `pip install -r requirements.txt` e depois `python server.py`
