#!/usr/bin/env python3
"""
Script de teste rápido para verificar se o servidor funciona
"""

import sys
import os

print("=" * 60)
print("🔍 Teste de Funcionamento - Koinonia Finance")
print("=" * 60)
print()

# Teste 1: Verificar se o Python é compatível
print("1️⃣  Verificando Python...")
if sys.version_info < (3, 8):
    print("   ❌ Erro: Python 3.8+ necessário")
    sys.exit(1)
print(f"   ✅ Python {sys.version_info.major}.{sys.version_info.minor}.{sys.version_info.micro}")
print()

# Teste 2: Verificar se as dependências estão instaladas
print("2️⃣  Verificando dependências...")
try:
    import flask
    print(f"   ✅ Flask {flask.__version__}")
except ImportError:
    print("   ❌ Flask não instalado")
    print("   Execute: pip install -r requirements.txt")
    sys.exit(1)

try:
    import flask_cors
    print(f"   ✅ Flask-CORS instalado")
except ImportError:
    print("   ❌ Flask-CORS não instalado")
    print("   Execute: pip install -r requirements.txt")
    sys.exit(1)
print()

# Teste 3: Verificar se o frontend está buildado
print("3️⃣  Verificando frontend...")
if not os.path.exists('dist'):
    print("   ❌ Pasta dist/ não encontrada")
    print("   Execute: npm run build")
    sys.exit(1)

if not os.path.exists('dist/index.html'):
    print("   ❌ dist/index.html não encontrado")
    print("   Execute: npm run build")
    sys.exit(1)

print("   ✅ Frontend buildado")
print()

# Teste 4: Verificar se o server.py pode ser importado
print("4️⃣  Verificando server.py...")
try:
    import server
    print("   ✅ server.py importado com sucesso")
except Exception as e:
    print(f"   ❌ Erro ao importar server.py: {e}")
    sys.exit(1)
print()

# Teste 5: Verificar se o app Flask está configurado
print("5️⃣  Verificando configuração do Flask...")
try:
    app = server.app
    print(f"   ✅ App Flask configurado")
    print(f"   ✅ Rotas registradas: {len(app.url_map._rules)}")
except Exception as e:
    print(f"   ❌ Erro na configuração: {e}")
    sys.exit(1)
print()

print("=" * 60)
print("✅ Todos os testes passaram!")
print("=" * 60)
print()
print("🚀 Para iniciar o servidor, execute:")
print("   python server.py")
print()
print("📡 Depois acesse: http://localhost:8080")
print()
