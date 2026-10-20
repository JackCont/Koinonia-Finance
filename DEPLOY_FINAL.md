# 🚀 Guia Final de Deploy - Koinonia Finance

## ✅ Checklist de Implementação

### Backend (Render + Supabase)
- [x] `backend/server.py` - API Flask com PostgreSQL
- [x] `backend/wsgi.py` - Entry point para Gunicorn
- [x] `backend/requirements.txt` - Dependências Python
- [x] `backend/Procfile` - Configuração Gunicorn
- [x] `render.yaml` - Configuração do Render (rootDir: backend)
- [ ] **CONFIGURAR_SUPABASE.md** - Seguir guia para criar banco

### Frontend (GitHub Pages)
- [x] `src/` - Código React/TypeScript
- [x] `vite.config.js` - Configuração Vite
- [x] `.github/workflows/deploy-frontend.yml` - CI/CD automático
- [x] **Build concluído** - `dist/` gerado com sucesso

---

## 📋 Passo a Passo para Deploy Completo

### 1. Configurar Supabase (5 minutos)

Siga o guia: **CONFIGURAR_SUPABASE.md**

**Resumo rápido:**
1. Crie conta em https://supabase.com
2. Crie projeto `koinonia-finance`
3. Copie connection string do PostgreSQL
4. Adicione no Render como `DATABASE_URL`

### 2. Deploy do Backend (Render)

**No dashboard do Render:**

1. **Configurar variáveis de ambiente:**
   ```
   DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres
   CORS_ORIGINS=https://jackcont.github.io,http://localhost:5173
   PORT=8080
   ```

2. **Verificar configurações:**
   - Root Directory: `backend`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `gunicorn wsgi:app --bind 0.0.0.0:$PORT`

3. **Deploy:**
   - Push para GitHub
   - Render detecta automaticamente
   - Aguarde ~3 minutos

4. **Testar:**
   ```bash
   curl https://koinonia-finance-api.onrender.com/api/health
   ```
   Deve retornar: `{"status":"ok","service":"koinonia-finance-api"}`

### 3. Deploy do Frontend (GitHub Pages)

**Configurar GitHub Pages:**

1. No repositório, vá em **Settings** → **Pages**
2. Source: **GitHub Actions**
3. Salve

**Deploy automático:**

1. Push para branch `main`
2. Workflow executa automaticamente
3. Aguarde ~2 minutos
4. Acesse: `https://jackcont.github.io/koinonia-finance`

### 4. Configurar Frontend para Usar API

**Criar `.env.production`:**
```env
VITE_API_URL=https://koinonia-finance-api.onrender.com
```

**Rebuild:**
```bash
npm run build
git add .
git commit -m "Configurar API URL"
git push origin main
```

---

## 🧪 Testes de Integração

### Teste 1: Backend
```bash
# Health check
curl https://koinonia-finance-api.onrender.com/api/health

# Criar membro
curl -X POST https://koinonia-finance-api.onrender.com/api/sync \
  -H "Content-Type: application/json" \
  -d '{
    "type": "CREATE",
    "entity": "members",
    "id": "test-123",
    "data": {"nome": "João Silva", "cpf": "123.456.789-00"}
  }'

# Listar membros
curl https://koinonia-finance-api.onrender.com/api/data/members
```

### Teste 2: Frontend
1. Acesse: `https://jackcont.github.io/koinonia-finance`
2. Faça login (admin/admin123)
3. Crie um membro
4. Verifique se aparece na lista
5. Recarregue a página
6. ✅ Membro deve persistir (salvo no PostgreSQL)

### Teste 3: Sincronização
1. Crie um membro no frontend
2. Verifique no Supabase (SQL Editor):
   ```sql
   SELECT * FROM members;
   ```
3. ✅ Membro deve estar no banco

---

## 📊 Arquitetura Final

```
┌─────────────────┐
│   GitHub Pages  │  ← Frontend React (estático)
│   (CDN global)  │
└────────┬────────┘
         │
         │ HTTPS
         │
┌────────▼────────┐
│     Render      │  ← Backend Flask (API REST)
│   (Python)      │
└────────┬────────┘
         │
         │ PostgreSQL
         │
┌────────▼────────┐
│    Supabase     │  ← Banco de dados (gratuito)
│  (PostgreSQL)   │
└─────────────────┘
```

**Vantagens:**
- ✅ Frontend carrega instantaneamente (CDN)
- ✅ Backend escala automaticamente
- ✅ Banco de dados gerenciado (backup automático)
- ✅ Custo zero (free tier)
- ✅ Dados seguros e persistentes

---

## 🔧 Manutenção

### Atualizar Frontend
```bash
npm run build
git add dist/
git commit -m "Update frontend"
git push origin main
```
GitHub Pages deploya automaticamente.

### Atualizar Backend
```bash
git add backend/
git commit -m "Update backend"
git push origin main
```
Render detecta e deploya automaticamente.

### Backup do Banco
Supabase faz backup automático diário. Para backup manual:
1. Supabase → Database → Backups
2. Clique em **"Download backup"**

---

## 🆘 Troubleshooting

### Frontend não carrega dados
- Verifique console do navegador (F12)
- Confirme que `VITE_API_URL` está correto
- Teste API diretamente: `curl https://koinonia-finance-api.onrender.com/api/health`

### Backend retorna erro 500
- Verifique logs no Render
- Confirme que `DATABASE_URL` está configurado
- Teste conexão com Supabase

### Dados não persistem
- Verifique se o frontend está chamando a API
- Confirme que o banco foi inicializado (logs do Render)
- Teste diretamente: `curl -X POST .../api/sync ...`

---

## 📈 Próximos Passos

### Opcional: Melhorias Futuras
- [ ] Autenticação JWT
- [ ] Rate limiting
- [ ] Cache Redis
- [ ] Monitoramento (Sentry)
- [ ] CI/CD completo (testes automatizados)

### Opcional: Upgrade de Plano
- Supabase Pro: $25/mês (mais recursos)
- Render Starter: $7/mês (sem cold start)

---

## ✅ Status Final

- [x] Backend configurado (Flask + PostgreSQL)
- [x] Frontend configurado (React + Vite)
- [x] CI/CD configurado (GitHub Actions)
- [x] Documentação completa
- [ ] **Aguardando configuração do Supabase**
- [ ] **Aguardando deploy no Render**
- [ ] **Aguardando deploy no GitHub Pages**

---

**Próximo passo:** Seguir CONFIGURAR_SUPABASE.md para criar o banco de dados

**Tempo estimado:** 10-15 minutos para completar todo o deploy

**Custo:** $0 (free tier)
