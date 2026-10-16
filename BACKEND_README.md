# Koinonia Finance - Backend API

API Flask para sincronização de dados do Koinonia Finance.

## 🚀 Deploy no Render

### Configuração Automática

O Render usará automaticamente:
- **Build Command:** `pip install -r requirements.txt`
- **Start Command:** `gunicorn wsgi:app --bind 0.0.0.0:$PORT`
- **Health Check:** `/api/health`

### Configuração Manual (se necessário)

1. Acesse o dashboard do Render
2. Selecione o serviço
3. Vá em **Settings**
4. Configure:
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `gunicorn wsgi:app --bind 0.0.0.0:$PORT --workers 2 --timeout 120`
   - **Health Check Path:** `/api/health`

## 📡 Endpoints

### Health Check
```
GET /api/health
```
Retorna status do servidor.

### Sincronização
```
POST /api/sync
Content-Type: application/json

{
  "type": "CREATE|UPDATE|DELETE",
  "entity": "members|transactions|...",
  "id": "unique-id",
  "data": {...}
}
```

### Obter Dados
```
GET /api/data/<entity>
```
Retorna todos os dados de uma entidade.

### Obter Todos os Dados
```
GET /api/data
```
Retorna todos os dados de todas as entidades.

## 🔧 Desenvolvimento Local

```bash
# Instalar dependências
pip install -r requirements.txt

# Rodar servidor
python server.py

# Testar health check
curl http://localhost:8080/api/health
```

## 📦 Estrutura

```
├── server.py          # API Flask principal
├── wsgi.py            # Entry point para Gunicorn
├── requirements.txt   # Dependências Python
├── Procfile           # Configuração Gunicorn
└── render.yaml        # Configuração Render
```

## 🔒 Segurança

- CORS habilitado para permitir requisições do frontend
- Validação de dados em todos os endpoints
- Tratamento de erros adequado

## 📊 Monitoramento

- Health check em `/api/health`
- Logs detalhados de todas as operações
- Timestamp em todas as respostas

---

**Koinonia Finance** - Backend API
