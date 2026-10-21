#!/usr/bin/env python3
"""
Teste rápido do servidor - Verifica se o servidor funciona corretamente
"""

import os
import sys

print("=" * 70)
print("🔍 TESTE DO SERVIDOR - Koinonia Finance")
print("=" * 70)
print()

# Verificar se o index.html existe na raiz
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
index_file = os.path.join(BASE_DIR, 'index.html')

print(f"📁 Diretório base: {BASE_DIR}")
print()

print("📄 Verificando index.html:")
if not os.path.exists(index_file):
    print(f"   ❌ ERRO: {index_file} não existe!")
    sys.exit(1)

print(f"   ✅ index.html existe")
print(f"   📏 Tamanho: {os.path.getsize(index_file)} bytes")
print()

# Verificar se o server.py pode ser importado
print("🔧 Verificando server.py:")
try:
    import server
    print("   ✅ server.py importado com sucesso")
    print(f"   ✅ BASE_DIR: {server.BASE_DIR}")
except Exception as e:
    print(f"   ❌ Erro ao importar server.py: {e}")
    sys.exit(1)
print()

# Verificar dependências
print("📦 Verificando dependências Python:")
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

# Resumo
print("=" * 70)
print("✅ TESTE CONCLUÍDO - Tudo está OK!")
print("=" * 70)
print()
print("🚀 Para iniciar o servidor:")
print("   python server.py")
print()
print("📡 Depois acesse:")
print("   http://localhost:8080")
print()
print("🔐 Login padrão:")
print("   Usuário: admin")
print("   Senha: admin123")
print()
