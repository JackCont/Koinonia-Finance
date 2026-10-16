# Diagnóstico do Erro 404

**Data:** 31/01/2026  
**Status:** 🔍 Em diagnóstico

---

## 🐛 Problema Reportado

**Erro:** 404 Not Found

**Possíveis Causas:**
1. Servidor backend não está rodando no Render
2. URL do backend está incorreta no frontend
3. Deploy do Render falhou ou não completou
4. Rota `/api/health` não está sendo encontrada
5. Problema de CORS ou configuração

---

## 🔍 Diagnóstico Passo a Passo

### Passo 1: Verificar se o Backend está Rodando

**Teste direto no navegador:**
```
https://koinonia-finance-api.onrender.com/api/health
```

**Resultado esperado:**
```json
{
  "status": "ok",
  "service": "koinonia-finance",
  "timestamp": "2026-01-31T..."
}
```

**Se retornar 404:**
- O servidor não está rodando
- Verifique os logs do Render
- Verifique se o deploy foi bem-sucedido

**Se retornar 502/503:**
- O servidor está dormindo (plano gratuito do Render)
- Aguarde 30-60 segundos para acordar
- Tente novamente

---

### Passo 2: Verificar Logs do Render

1. Acesse: https://dashboard.render.com
2. Clique no serviço `koinonia-finance-api`
3. Vá em **Logs**
4. Procure por:
   - ✅ `Starting gunicorn wsgi:app`
   - ✅ `Listening at: http://0.0.0.0:8080`
   - ❌ Erros de importação
   - ❌ Erros de configuração

---

### Passo 3: Verificar Configuração do Frontend

**Arquivo:** `.env.production`
```env
VITE_API_URL=https://koinonia-finance-api.onrender.com
```

**Arquivo:** `src/sync.ts`
```typescript
private getServerUrl(): string {
  try {
    const envUrl = import.meta?.env?.VITE_API_URL;
    if (envUrl) return envUrl;
  } catch {}
  
  return localStorage.getItem('koinonia_server_url') || 'http://localhost:8080';
}
```

**Verificação:**
- ✅ URL está correta?
- ✅ Variável de ambiente está configurada?
- ✅ Frontend foi rebuildado após mudar `.env.production`?

---

### Passo 4: Testar Localmente

**Iniciar servidor local:**
```bash
python server.py
```

**Testar endpoint:**
```bash
curl http://localhost:8080/api/health
```

**Resultado esperado:**
```json
{
  "status": "ok",
  "service": "koinonia-finance",
  "timestamp": "..."
}
```

---

### Passo 5: Verificar Estrutura no Render

**Estrutura esperada:**
```
/opt/render/project/src/
├── server.py          ← API Flask
├── wsgi.py            ← Entry point
├── Procfile           ← Configuração Gunicorn
├── requirements.txt   ← Dependências
└── ...
```

**Verificar no GitHub:**
```bash
git ls-files | grep -E "(server|wsgi|Procfile|requirements)"
```

Deve mostrar:
```
Procfile
requirements.txt
server.py
wsgi.py
```

---

## 🛠️ Soluções Possíveis

### Solução 1: Servidor Não Está Rodando

**Sintoma:** Erro 502/503 ou timeout

**Solução:**
1. Verifique os logs do Render
2. Confirme que o deploy foi bem-sucedido
3. Aguarde 30-60 segundos (servidor pode estar dormindo)
4. Tente novamente

### Solução 2: URL Incorreta

**Sintoma:** Erro 404 ou CORS

**Solução:**
1. Verifique `.env.production`
2. Confirme que a URL está correta: `https://koinonia-finance-api.onrender.com`
3. Rebuild o frontend: `npm run build`
4. Faça push para o GitHub

### Solução 3: Rota Não Encontrada

**Sintoma:** Erro 404 em `/api/health`

**Solução:**
1. Verifique se `server.py` está na raiz
2. Verifique se `wsgi.py` está importando corretamente
3. Verifique os logs do Render para erros de importação
4. Confirme que o Procfile está correto

### Solução 4: Problema de CORS

**Sintoma:** Erro de CORS no console do navegador

**Solução:**
1. Verifique se `flask-cors` está instalado
2. Confirme que `CORS(app)` está no `server.py`
3. Verifique se o frontend está usando a URL correta

---

## 📋 Checklist de Diagnóstico

- [ ] Backend está rodando no Render?
- [ ] URL em `.env.production` está correta?
- [ ] Frontend foi rebuildado após mudar `.env.production`?
- [ ] Servidor funciona localmente?
- [ ] Estrutura de arquivos está correta no GitHub?
- [ ] Logs do Render mostram erros?
- [ ] Endpoint `/api/health` retorna 200?
- [ ] CORS está configurado corretamente?

---

## 🔧 Comandos de Teste

### Testar Backend Local
```bash
# Iniciar servidor
python server.py

# Testar health check
curl http://localhost:8080/api/health

# Testar sincronização
curl -X POST http://localhost:8080/api/sync \
  -H "Content-Type: application/json" \
  -d '{"type":"CREATE","entity":"test","id":"1","data":{"nome":"Teste"}}'
```

### Testar Backend no Render
```bash
# Health check
curl https://koinonia-finance-api.onrender.com/api/health

# Sincronização
curl -X POST https://koinonia-finance-api.onrender.com/api/sync \
  -H "Content-Type: application/json" \
  -d '{"type":"CREATE","entity":"test","id":"1","data":{"nome":"Teste"}}'
```

### Verificar Frontend
```bash
# Verificar variável de ambiente
cat .env.production

# Rebuild frontend
npm run build

# Verificar se foi buildado
ls -la dist/
```

---

## 📞 Próximos Passos

1. **Teste o backend no Render:**
   ```
   https://koinonia-finance-api.onrender.com/api/health
   ```

2. **Verifique os logs do Render:**
   - Acesse o dashboard
   - Vá em Logs
   - Procure por erros

3. **Teste localmente:**
   ```bash
   python server.py
   curl http://localhost:8080/api/health
   ```

4. **Compartilhe as informações:**
   - Resultado do teste de health check
   - Logs do Render (se houver erros)
   - Resultado do teste local

---

## 🎯 Informações Necessárias

Para diagnosticar o problema, preciso saber:

1. **Qual URL está retornando 404?**
   - Frontend?
   - Backend?
   - Endpoint específico?

2. **O backend está rodando no Render?**
   - Verifique os logs
   - Teste `/api/health` diretamente

3. **Funciona localmente?**
   - Teste `python server.py`
   - Teste `curl http://localhost:8080/api/health`

4. **Qual é a URL configurada no frontend?**
   - Verifique `.env.production`
   - Verifique `src/sync.ts`

---

**Status:** 🔍 Aguardando informações para diagnóstico

**Próximo passo:** Testar `https://koinonia-finance-api.onrender.com/api/health` e compartilhar o resultado
