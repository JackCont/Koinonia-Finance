# 🗄️ Configuração do Supabase (PostgreSQL Gratuito)

## Passo 1: Criar Conta no Supabase

1. Acesse: https://supabase.com
2. Clique em **"Start your project"**
3. Faça login com GitHub (recomendado)
4. Crie uma nova organização (gratuita)

## Passo 2: Criar Projeto

1. Clique em **"New Project"**
2. Preencha:
   - **Name:** `koinonia-finance`
   - **Database Password:** (gere uma senha forte e guarde)
   - **Region:** US East (mais próximo do Render)
3. Clique em **"Create new project"**
4. Aguarde ~2 minutos para o projeto ser criado

## Passo 3: Obter Credenciais

1. No dashboard do Supabase, vá em **Settings** (ícone de engrenagem)
2. Clique em **Database**
3. Copie:
   - **Connection string** → `postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres`
   - Substitua `[PASSWORD]` pela senha que você criou
   - Substitua `[PROJECT]` pelo ID do seu projeto

## Passo 4: Configurar no Render

1. Acesse: https://dashboard.render.com
2. Clique no serviço **koinonia-finance-api**
3. Vá em **Environment**
4. Adicione a variável:
   - **Key:** `DATABASE_URL`
   - **Value:** Cole a connection string do Passo 3
5. Adicione outra variável:
   - **Key:** `CORS_ORIGINS`
   - **Value:** `https://jackcont.github.io,http://localhost:5173`
6. Clique em **"Save Changes"**

## Passo 5: Verificar Tabelas

O backend cria as tabelas automaticamente na primeira execução. Para verificar:

1. No Supabase, vá em **SQL Editor**
2. Execute:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';
```

Deve mostrar:
- members
- transactions
- provisions
- cults
- congregations
- churches
- fixed_values

## Passo 6: Testar Conexão

1. No Render, vá em **Logs**
2. Procure por: `✅ Banco de dados inicializado com sucesso`
3. Se aparecer, está funcionando!

## 🔒 Segurança

### Nunca commite:
- ❌ Senhas do banco
- ❌ Connection strings
- ❌ API keys

### Sempre use:
- ✅ Variáveis de ambiente
- ✅ Secrets do Render
- ✅ `.gitignore` para `.env`

## 💡 Dicas

### Backup Automático
O Supabase Free Tier inclui:
- ✅ Backups diários automáticos
- ✅ Retenção de 7 dias
- ✅ Point-in-time recovery

### Limites do Free Tier
- ✅ 500 MB de banco de dados
- ✅ 1 GB de armazenamento
- ✅ 2 GB de transferência/mês
- ✅ 50.000 usuários ativos/mês

### Upgrade (se necessário)
Se precisar de mais recursos:
- Pro: $25/mês
- Team: $599/mês

## 🆘 Problemas Comuns

### Erro: "DATABASE_URL não configurado"
**Solução:** Adicione a variável no Render (Passo 4)

### Erro: "Connection refused"
**Solução:** Verifique se o projeto do Supabase está ativo

### Erro: "permission denied"
**Solução:** Verifique se a senha está correta na connection string

## 📞 Suporte Supabase

- Docs: https://supabase.com/docs
- Discord: https://discord.supabase.com
- Status: https://status.supabase.com

---

**Status:** ✅ Guia completo criado

**Próximo passo:** Configurar Supabase seguindo os passos acima
