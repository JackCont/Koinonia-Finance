# Configuração Manual do Render

## 🚨 Problema Identificado

O Render está usando `gunicorn your_application.wsgi` (configuração padrão) em vez de ler o `Procfile`.

## ✅ Solução: Configurar Manualmente no Dashboard do Render

### Passo 1: Acessar Configurações do Serviço

1. Acesse: https://dashboard.render.com
2. Clique no seu serviço `koinonia-finance-api`
3. Vá em **Settings** (menu lateral esquerdo)

### Passo 2: Configurar Comandos Manualmente

Na seção **Build & Deploy**, configure:

**Build Command:**
```bash
pip install -r requirements.txt
```

**Start Command:**
```bash
gunicorn wsgi:app --bind 0.0.0.0:$PORT
```

### Passo 3: Salvar e Fazer Novo Deploy

1. Clique em **Save Changes**
2. Vá em **Manual Deploy** → **Deploy latest commit**
3. Aguarde o build completar

---

## 📋 Verificação dos Arquivos no GitHub

Confirme que estes arquivos estão no repositório:

```bash
# No terminal, execute:
git ls-files | grep -E "(wsgi|Procfile|requirements|server)"
```

Deve mostrar:
```
Procfile
requirements.txt
server.py
wsgi.py
```

Se não mostrar, execute:
```bash
git add wsgi.py Procfile requirements.txt server.py
git commit -m "Adicionar arquivos do backend"
git push origin Koinonia-Finance-v1_2
```

---

## 🔍 Estrutura Correta dos Arquivos

### wsgi.py
```python
from server import app

if __name__ == '__main__':
    app.run()
```

### Procfile
```
web: gunicorn wsgi:app --bind 0.0.0.0:$PORT
```

### requirements.txt
```
flask==3.0.0
flask-cors==4.0.0
gunicorn==21.2.0
```

### server.py
```python
from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
from datetime import datetime

app = Flask(__name__)
CORS(app)

# ... (resto do código)
```

---

## 🧪 Teste Local Antes do Deploy

Teste localmente para garantir que funciona:

```bash
# Instalar dependências
pip install -r requirements.txt

# Testar com Gunicorn
gunicorn wsgi:app --bind 0.0.0.0:8080

# Em outro terminal, testar
curl http://localhost:8080/api/health
```

Deve retornar:
```json
{
  "status": "ok",
  "service": "koinonia-finance",
  "timestamp": "..."
}
```

---

## 📞 Se Ainda Não Funcionar

### Opção 1: Verificar Logs do Render

1. No dashboard do Render, vá em **Logs**
2. Procure por:
   - ✅ `Starting gunicorn wsgi:app` (correto)
   - ❌ `Starting gunicorn your_application.wsgi` (erro)

### Opção 2: Recriar o Serviço

Se a configuração manual não funcionar:

1. No Render, vá em **Settings** → **Delete Service**
2. Crie um novo serviço:
   - **Name:** `koinonia-finance-api`
   - **Environment:** `Python 3`
   - **Repository:** Selecione seu repositório
   - **Branch:** `Koinonia-Finance-v1_2`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `gunicorn wsgi:app --bind 0.0.0.0:$PORT`
3. Clique em **Create Web Service**

### Opção 3: Usar Estrutura Alternativa

Se o Render continuar insistindo em `your_application.wsgi`, crie essa estrutura:

```bash
# Criar diretório
mkdir -p your_application

# Mover server.py para dentro
mv server.py your_application/

# Criar wsgi.py dentro do diretório
cat > your_application/wsgi.py << 'EOF'
from server import app

if __name__ == '__main__':
    app.run()
EOF

# Atualizar Procfile
echo "web: gunicorn your_application.wsgi:app --bind 0.0.0.0:\$PORT" > Procfile

# Commit e push
git add .
git commit -m "Ajustar estrutura para padrão do Render"
git push origin Koinonia-Finance-v1_2
```

---

## ✅ Checklist Final

- [ ] Arquivos `wsgi.py`, `Procfile`, `requirements.txt`, `server.py` estão no GitHub
- [ ] Branch correta: `Koinonia-Finance-v1_2`
- [ ] No Render, configurou manualmente:
  - [ ] Build Command: `pip install -r requirements.txt`
  - [ ] Start Command: `gunicorn wsgi:app --bind 0.0.0.0:$PORT`
- [ ] Fez novo deploy
- [ ] Testou `/api/health` com sucesso

---

**Status:** Aguardando configuração manual no dashboard do Render
