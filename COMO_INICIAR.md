# 🚀 Guia de Inicialização - Koinonia Finance

## ⚡ Início Rápido (3 opções)

### Opção 1: Windows (Mais Fácil)
```bash
# Clique duas vezes em INICIAR.bat
```

### Opção 2: Linux/Mac
```bash
chmod +x INICIAR.sh
./INICIAR.sh
```

### Opção 3: Manual (Qualquer Sistema)
```bash
python run.py
```

---

## ✅ O Que Acontece Automaticamente

O script `run.py` faz tudo automaticamente:

1. ✅ Verifica se Python e Node.js estão instalados
2. ✅ Instala dependências se necessário
3. ✅ Verifica se o frontend está buildado
4. ✅ **Faz o build automaticamente se necessário**
5. ✅ Inicia o servidor na porta 3000
6. ✅ Abre o navegador automaticamente

---

## 🎯 Acesso ao Aplicativo

Após iniciar, acesse:
- **URL:** http://localhost:3000
- **Login:** admin / admin123

---

## 🗑️ Limpar Dados

Se precisar limpar todos os dados:
```bash
python run.py --clear
```

---

## 🐛 Solução de Problemas

### Erro: "ModuleNotFoundError: No module named 'flask'"
```bash
pip install -r requirements.txt
```

### Erro: "npm: command not found"
Instale o Node.js em: https://nodejs.org/

### Erro: "Porta 3000 já está em uso"
```bash
# Use outra porta
python run.py --port 3001
```

### Erro 404 ao acessar o navegador
O script `run.py` faz o build automaticamente. Se ainda der erro:
```bash
# Build manual
npm run build

# Inicie o servidor
python run.py
```

---

## 📋 Logs Esperados

```
======================================================================
🏦 KOINONIA FINANCE - Servidor com Auto-Build
======================================================================

⚠️  Pasta dist/ não encontrada
🏗️  Iniciando build do frontend...

📦 Instalando dependências Node.js...
✅ Dependências instaladas

✅ Frontend buildado com sucesso

✅ Frontend pronto

🚀 Iniciando servidor na porta 3000...
📡 Acesse: http://localhost:3000
💾 Dados salvos em: data.json
🛑 Pressione Ctrl+C para parar

🌐 Abrindo navegador: http://localhost:3000
```

---

## 🎉 Pronto!

Agora é só usar o `run.py` ou os scripts `INICIAR.bat` / `INICIAR.sh` e o sistema funcionará automaticamente!
