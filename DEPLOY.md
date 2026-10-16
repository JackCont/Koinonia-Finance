# Guia de Deploy - Koinonia Finance

**Deploy em GitHub Pages + Render**

---

## 🎯 Arquitetura de Deploy

```
┌─────────────────┐      ┌──────────────────┐
│  GitHub Pages   │      │     Render       │
│   (Frontend)    │─────▶│    (Backend)     │
│                 │      │                  │
│ • Carrega       │      │ • API REST       │
│   instantâneo   │      │ • Sincronização  │
│ • Estático      │      │ • Banco de dados │
│ • CDN global    │      │ • Auto-sleep     │
└─────────────────┘      └──────────────────┘
         │                        │
         └────────┬───────────────┘
                  │
                  ▼
         ┌─────────────────┐
         │   localStorage  │
         │   (Fallback)    │
         │                 │
         │ • Offline-first │
         │ • Sincroniza    │
         │   quando online │
         └─────────────────┘
```

---

## 📋 Pré-requisitos

- ✅ Conta no GitHub
- ✅ Conta no Render (gratuita)
- ✅ Repositório do projeto
- ✅ Node.js instalado localmente

---

## 🚀 Passo 1: Preparar o Repositório

### 1.1 Configurar Variáveis de Ambiente

Crie o arquivo `.env.production`:
```env
VITE_API_URL=https://koinonia-finance.onrender.com
```

### 1.2 Atualizar vite.config.js

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/koinonia-finance/', // Nome do repositório
  build: {
    outDir: 'dist',
    sourcemap: false
  }
})
```

### 1.3 Commit e Push

```bash
git add .
git commit -m "Prepare for deployment"
git push origin main
```

---

## 🌐 Passo 2: Deploy no GitHub Pages

### 2.1 Habilitar GitHub Pages

1. Vá para **Settings** do repositório
2. Navegue até **Pages**
3. Em **Source**, selecione **GitHub Actions**
4. Clique em **Save**

### 2.2 Criar Workflow de Deploy

Crie o arquivo `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout
      uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build
      run: npm run build
      env:
        VITE_API_URL: ${{ secrets.VITE_API_URL }}
    
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

### 2.3 Configurar Secrets

1. Vá para **Settings** → **Secrets and variables** → **Actions**
2. Adicione o secret:
   - **Name:** `VITE_API_URL`
   - **Value:** `https://koinonia-finance.onrender.com`

### 2.4 Verificar Deploy

Após o push, o GitHub Actions irá:
1. Buildar o projeto
2. Deployar em: `https://seu-usuario.github.io/koinonia-finance`

---

## 🖥️ Passo 3: Deploy no Render

### 3.1 Preparar Backend

Crie o arquivo `render.yaml`:

```yaml
services:
  - type: web
    name: koinonia-finance-api
    env: python
    buildCommand: pip install -r requirements.txt
    startCommand: python server.py
    envVars:
      - key: PYTHON_VERSION
        value: 3.11.0
```

### 3.2 Criar requirements.txt

```txt
flask==3.0.0
flask-cors==4.0.0
gunicorn==21.2.0
```

### 3.3 Criar server.py (Backend API)

```python
from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os

app = Flask(__name__)
CORS(app)

DATA_FILE = 'data.json'

def load_data():
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    return {}

def save_data(data):
    with open(DATA_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'service': 'koinonia-finance'})

@app.route('/api/sync', methods=['POST'])
def sync():
    try:
        operation = request.json
        data = load_data()
        
        # Processar operação
        entity = operation.get('entity')
        op_type = operation.get('type')
        op_id = operation.get('id')
        op_data = operation.get('data')
        
        if entity not in data:
            data[entity] = {}
        
        if op_type == 'CREATE' or op_type == 'UPDATE':
            data[entity][op_id] = op_data
        elif op_type == 'DELETE':
            if op_id in data[entity]:
                del data[entity][op_id]
        
        save_data(data)
        
        return jsonify({'status': 'success', 'operation': operation})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/api/data/<entity>', methods=['GET'])
def get_data(entity):
    data = load_data()
    return jsonify(data.get(entity, {}))

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 8080)))
```

### 3.4 Deployar no Render

1. Acesse [render.com](https://render.com)
2. Clique em **New** → **Web Service**
3. Conecte seu repositório GitHub
4. Configure:
   - **Name:** `koinonia-finance-api`
   - **Environment:** `Python 3`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `python server.py`
5. Adicione variável de ambiente:
   - **Key:** `PORT`
   - **Value:** `8080`
6. Clique em **Create Web Service**

### 3.5 Obter URL do Backend

Após o deploy, o Render fornecerá uma URL como:
```
https://koinonia-finance.onrender.com
```

---

## 🔗 Passo 4: Integrar Frontend e Backend

### 4.1 Atualizar Frontend

No arquivo `src/sync.ts`, atualize a URL do servidor:

```typescript
private getServerUrl(): string {
  try {
    // @ts-ignore
    const envUrl = import.meta?.env?.VITE_API_URL;
    if (envUrl) return envUrl;
  } catch {}
  
  return localStorage.getItem('koinonia_server_url') || 
         'https://koinonia-finance.onrender.com';
}
```

### 4.2 Testar Integração

1. Acesse o frontend: `https://seu-usuario.github.io/koinonia-finance`
2. Faça login
3. Crie alguns dados
4. Verifique no console se a sincronização está funcionando
5. Acesse o backend: `https://koinonia-finance.onrender.com/api/health`
6. Deve retornar: `{"status": "ok", "service": "koinonia-finance"}`

---

## 🔄 Passo 5: Configurar Sincronização Automática

### 5.1 Como Funciona

1. **Offline:** Dados salvos no localStorage
2. **Online:** Sincroniza automaticamente com Render
3. **Fila:** Operações pendentes processadas quando online
4. **Fallback:** Se Render estiver dormindo, usa localStorage

### 5.2 Testar Sincronização

```javascript
// No console do navegador
import { syncManager } from './sync';

// Verificar status
console.log(syncManager.getStatus());

// Forçar sincronização
syncManager.forceSync().then(result => {
  console.log('Sincronizado:', result);
});
```

---

## 📊 Passo 6: Monitoramento

### 6.1 GitHub Pages

- **URL:** `https://seu-usuario.github.io/koinonia-finance`
- **Status:** https://www.githubstatus.com
- **Analytics:** Configure Google Analytics se desejar

### 6.2 Render

- **URL:** `https://koinonia-finance.onrender.com`
- **Logs:** Painel do Render → Logs
- **Métricas:** CPU, Memória, Requests

---

## 🛠️ Manutenção

### Atualizar Frontend

```bash
git add .
git commit -m "Update features"
git push origin main
```

O GitHub Actions irá automaticamente:
1. Buildar o projeto
2. Deployar no GitHub Pages

### Atualizar Backend

```bash
git add .
git commit -m "Update API"
git push origin main
```

O Render irá automaticamente:
1. Detectar mudanças
2. Rebuildar o serviço
3. Redeployar

---

## 🐛 Troubleshooting

### Problema: Frontend não carrega

**Solução:**
1. Verifique se o GitHub Pages está habilitado
2. Verifique se o workflow rodou com sucesso
3. Acesse: `https://seu-usuario.github.io/koinonia-finance`

### Problema: Backend não responde

**Solução:**
1. Verifique se o Render está ativo
2. Acesse: `https://koinonia-finance.onrender.com/api/health`
3. Se estiver dormindo, aguarde ~30 segundos para acordar

### Problema: Sincronização não funciona

**Solução:**
1. Verifique a URL do servidor em `src/sync.ts`
2. Verifique se CORS está habilitado no backend
3. Verifique o console do navegador para erros

---

## 📈 Otimizações

### GitHub Pages
- ✅ CDN global (Cloudflare)
- ✅ Cache automático
- ✅ Compressão gzip

### Render
- ✅ Auto-sleep (economia de recursos)
- ✅ Auto-wake (quando recebe request)
- ✅ Logs detalhados

### Frontend
- ✅ Code splitting
- ✅ Lazy loading
- ✅ Service Worker (PWA)

---

## 🔒 Segurança

### GitHub Pages
- ✅ HTTPS automático
- ✅ CDN protegido
- ✅ Sem dados sensíveis no frontend

### Render
- ✅ HTTPS automático
- ✅ Variáveis de ambiente
- ✅ CORS configurado

### Boas Práticas
- ✅ Nunca commitar `.env` com secrets
- ✅ Usar variáveis de ambiente
- ✅ Validar dados no backend
- ✅ Implementar autenticação

---

## 📞 Suporte

### GitHub Pages
- Documentação: https://pages.github.com
- Status: https://www.githubstatus.com

### Render
- Documentação: https://render.com/docs
- Status: https://status.render.com

---

## 🎯 Próximos Passos

1. ✅ Deployar frontend no GitHub Pages
2. ✅ Deployar backend no Render
3. ✅ Configurar variáveis de ambiente
4. ✅ Testar sincronização
5. ✅ Monitorar performance
6. ✅ Implementar autenticação (opcional)

---

**Koinonia Finance** - Deploy Completo
