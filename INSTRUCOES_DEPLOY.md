# 🚀 Instruções para Deploy no Render

**Problema Resolvido:** O Render estava usando `gunicorn your_application.wsgi` em vez de `gunicorn wsgi:app`.

---

## ✅ Correções Aplicadas

1. ✅ Criado `wsgi.py` - Entry point para Gunicorn
2. ✅ Atualizado `Procfile` - Aponta para `wsgi:app`
3. ✅ Atualizado `render.yaml` - Branch e startCommand corretos
4. ✅ Atualizado `.env.production` - URL do backend

---

## 📤 Enviar para o GitHub

Execute estes comandos no terminal:

```bash
# 1. Adicionar todos os arquivos
git add .

# 2. Commit
git commit -m "Corrigir configuração do Render - adicionar wsgi.py"

# 3. Push para a branch correta
git push origin Koinonia-Finance-v1_2
```

---

## 🔧 Configurar no Render

### Opção A: Configuração Automática (Recomendado)

O Render deve ler automaticamente o `render.yaml` com as configurações corretas.

### Opção B: Configuração Manual

Se o Render não ler o `render.yaml` automaticamente:

1. Acesse o dashboard do Render
2. Selecione o serviço `koinonia-finance-api`
3. Vá em **Settings**
4. Configure manualmente:
   - **Branch:** `Koinonia-Finance-v1_2`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `gunicorn wsgi:app --bind 0.0.0.0:$PORT --workers 2 --timeout 120`
   - **Health Check Path:** `/api/health`

---

## 🔄 Fazer Novo Deploy

1. No Render, clique em **Manual Deploy**
2. Selecione **Deploy latest commit**
3. Aguarde o build completar
4. Verifique nos logs:
   - ✅ `Installing dependencies from requirements.txt`
   - ✅ `Starting gunicorn wsgi:app`
   - ❌ NÃO deve aparecer `your_application.wsgi`

---

## 🧪 Testar

### Teste 1: Health Check

```bash
curl https://koinonia-finance-api.onrender.com/api/health
```

**Resultado esperado:**
```json
{
  "status": "ok",
  "service": "koinonia-finance",
  "timestamp": "2026-01-31T..."
}
```

### Teste 2: Sincronização

```bash
curl -X POST https://koinonia-finance-api.onrender.com/api/sync \
  -H "Content-Type: application/json" \
  -d '{
    "type": "CREATE",
    "entity": "members",
    "id": "test-123",
    "data": {"nome": "Teste", "valor": 100}
  }'
```

**Resultado esperado:**
```json
{
  "status": "success",
  "operation": {...},
  "timestamp": "2026-01-31T..."
}
```

---

## 🐛 Troubleshooting

### Erro: "ModuleNotFoundError: No module named 'your_application'"

**Causa:** O Render ainda está usando a configuração antiga.

**Solução:**
1. Verifique se o `wsgi.py` está no repositório
2. Verifique se o `Procfile` está correto
3. Faça novo deploy no Render
4. Verifique os logs para confirmar que está usando `wsgi:app`

### Erro: "requirements.txt not found"

**Causa:** Arquivos não foram enviados para o GitHub.

**Solução:**
```bash
git add requirements.txt server.py wsgi.py Procfile render.yaml
git commit -m "Adicionar arquivos essenciais"
git push origin Koinonia-Finance-v1_2
```

### Erro: "Branch not found"

**Causa:** Branch incorreta no Render.

**Solução:**
1. No Render, vá em **Settings**
2. Mude a **Branch** para `Koinonia-Finance-v1_2`
3. Salve e faça novo deploy

---

## 📋 Checklist Final

- [ ] `wsgi.py` criado
- [ ] `Procfile` atualizado
- [ ] `render.yaml` atualizado
- [ ] `.env.production` atualizado
- [ ] Arquivos enviados para o GitHub
- [ ] Push feito para `Koinonia-Finance-v1_2`
- [ ] Configurações verificadas no Render
- [ ] Novo deploy iniciado
- [ ] Health check testado com sucesso
- [ ] Sincronização testada com sucesso

---

## 📞 Suporte

Se o problema persistir:

1. Verifique os logs do Render
2. Confirme que todos os arquivos estão no GitHub
3. Verifique se a branch está correta
4. Teste localmente: `gunicorn wsgi:app`

---

**Status:** ✅ Pronto para deploy

**Próximo passo:** Execute `git push origin Koinonia-Finance-v1_2` e faça novo deploy no Render!
