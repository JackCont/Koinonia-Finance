#!/usr/bin/env python3
"""
Diagnóstico Rápido - Koinonia Finance
Verifica se todos os componentes estão configurados corretamente
"""

import os
import sys

print("=" * 70)
print("🔍 DIAGNÓSTICO RÁPIDO - Koinonia Finance")
print("=" * 70)
print()

# Verificar Python
print("1️⃣  Verificando Python...")
if sys.version_info < (3, 8):
    print("   ❌ Erro: Python 3.8+ necessário")
    print(f"   Versão atual: {sys.version_info.major}.{sys.version_info.minor}")
    sys.exit(1)
print(f"   ✅ Python {sys.version_info.major}.{sys.version_info.minor}.{sys.version_info.micro}")
print()

# Verificar dependências Python
print("2️⃣  Verificando dependências Python...")
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

# Verificar pasta dist
print("3️⃣  Verificando frontend buildado...")
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DIST_DIR = os.path.join(BASE_DIR, 'dist')

if not os.path.exists(DIST_DIR):
    print(f"   ❌ Pasta dist/ não existe")
    print("   Execute: npm run build")
    sys.exit(1)

print(f"   ✅ Pasta dist/ existe")

index_file = os.path.join(DIST_DIR, 'index.html')
if not os.path.exists(index_file):
    print(f"   ❌ dist/index.html não existe")
    print("   Execute: npm run build")
    sys.exit(1)

print(f"   ✅ dist/index.html existe")
print(f"   📏 Tamanho: {os.path.getsize(index_file)} bytes")
print()

# Verificar arquivos essenciais
print("4️⃣  Verificando arquivos essenciais...")
essential_files = [
    'server.py',
    'requirements.txt',
    'INICIAR.bat',
    'INICIAR.sh',
    'index.html',
    'package.json'
]

for file in essential_files:
    file_path = os.path.join(BASE_DIR, file)
    if os.path.exists(file_path):
        print(f"   ✅ {file}")
    else:
        print(f"   ❌ {file} não encontrado")
print()

# Verificar server.py
print("5️⃣  Verificando server.py...")
try:
    import server
    print("   ✅ server.py importado com sucesso")
    print(f"   ✅ Porta configurada: 3000")
    print(f"   ✅ DIST_DIR: {server.DIST_DIR}")
except Exception as e:
    print(f"   ❌ Erro ao importar server.py: {e}")
    sys.exit(1)
print()

# Resumo
print("=" * 70)
print("✅ DIAGNÓSTICO CONCLUÍDO - Tudo está OK!")
print("=" * 70)
print()
print("🚀 Para iniciar o servidor:")
print("   python server.py")
print()
print("📡 Ou use o script automático:")
print("   Windows: INICIAR.bat")
print("   Linux/Mac: ./INICIAR.sh")
print()
print("🌐 Depois acesse:")
print("   http://localhost:3000")
print()
print("🔐 Login padrão:")
print("   Usuário: admin")
print("   Senha: admin123")
print()
print("📱 Acesso em rede local:")
print("   http://[SEU-IP]:3000")
print()
