# 🚀 Guia Rápido - Enviar Arquivos para o GitHub

**Problema:** O Render não encontra o `requirements.txt` porque os arquivos não foram enviados para o GitHub.

---

## ✅ Solução Rápida

### Passo 1: Verificar Status do Git

Abra o terminal na pasta do projeto e execute:

```bash
git status
```

Você verá os arquivos que precisam ser enviados.

### Passo 2: Adicionar Todos os Arquivos

```bash
git add .
```

### Passo 3: Commit das Mudanças

```bash
git commit -m "Adicionar arquivos essenciais para deploy no Render"
```

### Passo 4: Push para o GitHub

```bash
git push origin main
```

Ou se estiver em outra branch:

```bash
git push origin Koinonia-Finance-v1_2
```

---

## 📋 Arquivos Essenciais que Devem ser Enviados

✅ **requirements.txt** - Dependências Python
✅ **server.py** - API Flask
✅ **Procfile** - Configuração Gunicorn
✅ **render.yaml** - Configuração Render
✅ **.env.production** - Variáveis de ambiente
✅ **.gitignore** - Ignorar arquivos
✅ **src/sync.ts** - Sistema de sincronização

---

## 🔍 Verificar se os Arquivos Estão no GitHub

### Opção 1: Via GitHub Web

1. Acesse: https://github.com/JackCont/Koinonia-Finance
2. Verifique se os arquivos estão na raiz do repositório:
   - requirements.txt
   - server.py
   - Procfile
   - render.yaml

### Opção 2: Via Terminal

```bash
# Ver arquivos rastreados pelo git
git ls-files | grep -E "(requirements|server|Procfile|render)"
```

Deve mostrar:
```
Procfile
render.yaml
requirements.txt
server.py
```

---

## 🐛 Problemas Comuns

### Problema 1: "fatal: not a git repository"

**Solução:**
```bash
git init
git remote add origin https://github.com/JackCont/Koinonia-Finance.git
git add .
git commit -m "Initial commit"
git push -u origin main
```

### Problema 2: "Updates were rejected because the remote contains work"

**Solução:**
```bash
git pull origin main --rebase
git push origin main
```

### Problema 3: Arquivos não aparecem no GitHub

**Solução:**
```bash
# Verificar se os arquivos estão staged
git status

# Adicionar arquivos específicos
git add requirements.txt server.py Procfile render.yaml

# Commit
git commit -m "Adicionar arquivos de deploy"

# Push
git push origin main
```

---

## 🔄 Após o Push

1. Aguarde 2-3 minutos para o GitHub processar
2. No Render, clique em **Manual Deploy** → **Deploy latest commit**
3. Aguarde o build completar
4. Verifique os logs para confirmar que o `requirements.txt` foi encontrado

---

## 📞 Se Ainda Não Funcionar

### Verificar Branch Correta

O Render está usando a branch `Koinonia-Finance-v1_2`. Certifique-se de que os arquivos estão nesta branch:

```bash
# Mudar para a branch correta
git checkout Koinonia-Finance-v1_2

# Adicionar arquivos
git add .

# Commit
git commit -m "Adicionar arquivos essenciais para deploy"

# Push
git push origin Koinonia-Finance-v1_2
```

### Verificar Configuração do Render

1. No Render, vá em **Settings**
2. Verifique **Branch:** deve ser `Koinonia-Finance-v1_2`
3. Verifique **Build Command:** `pip install -r requirements.txt`
4. Verifique **Start Command:** (automático via Procfile)

---

## ✅ Checklist Final

- [ ] Arquivos essenciais criados localmente
- [ ] `git add .` executado
- [ ] `git commit` executado
- [ ] `git push` executado para a branch correta
- [ ] Arquivos visíveis no GitHub
- [ ] Render configurado para a branch correta
- [ ] Deploy manual iniciado no Render

---

**Próximo passo:** Execute os comandos acima e tente o deploy novamente!
