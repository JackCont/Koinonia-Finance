#!/usr/bin/env python3
"""
Diagnóstico do servidor - Verifica se tudo está configurado corretamente
"""

import os
import sys

print("=" * 70)
print("🔍 DIAGNÓSTICO DO SERVIDOR - Koinonia Finance")
print("=" * 70)
print()

# Verificar diretório base
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
print(f"📁 Diretório base: {BASE_DIR}")
print()

# Verificar pasta dist
DIST_DIR = os.path.join(BASE_DIR, 'dist')
print(f"📂 Verificando pasta dist: {DIST_DIR}")

if not os.path.exists(DIST_DIR):
    print("   ❌ ERRO: Pasta dist/ não existe!")
    print("   Execute: npm run build")
    sys.exit(1)

print(f"   ✅ Pasta dist/ existe")

# Verificar index.html
index_file = os.path.join(DIST_DIR, 'index.html')
if not os.path.exists(index_file):
    print(f"   ❌ ERRO: {index_file} não existe!")
    print("   Execute: npm run build")
    sys.exit(1)

print(f"   ✅ index.html existe")

# Listar arquivos na pasta dist
print()
print("📋 Arquivos na pasta dist/:")
for root, dirs, files in os.walk(DIST_DIR):
    level = root.replace(DIST_DIR, '').count(os.sep)
    indent = ' ' * 2 * level
    print(f'{indent}{os.path.basename(root)}/')
    subindent = ' ' * 2 * (level + 1)
    for file in files:
        file_path = os.path.join(root, file)
        file_size = os.path.getsize(file_path)
        print(f'{subindent}{file} ({file_size} bytes)')

# Verificar dependências
print()
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

# Verificar server.py
print()
print("🔧 Verificando server.py:")
try:
    import server
    print("   ✅ server.py importado com sucesso")
    print(f"   ✅ DIST_DIR configurado: {server.DIST_DIR}")
    print(f"   ✅ DATA_FILE configurado: {server.DATA_FILE}")
except Exception as e:
    print(f"   ❌ Erro ao importar server.py: {e}")
    sys.exit(1)

# Resumo
print()
print("=" * 70)
print("✅ DIAGNÓSTICO CONCLUÍDO - Tudo está OK!")
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
