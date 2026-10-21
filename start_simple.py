#!/usr/bin/env python3
"""
Koinonia Finance - Script de Inicialização Simples
Este script faz o build automático e inicia o servidor
"""

import subprocess
import sys
import os
import time
import webbrowser
from pathlib import Path

def main():
    """Função principal"""
    print("=" * 70)
    print("🏦 KOINONIA FINANCE - Inicialização Automática")
    print("=" * 70)
    print()
    
    # Verifica se Python está instalado
    print("🔍 Verificando Python...")
    if sys.version_info < (3, 8):
        print("❌ Erro: Python 3.8 ou superior é necessário")
        sys.exit(1)
    print(f"✅ Python {sys.version_info.major}.{sys.version_info.minor}.{sys.version_info.micro}")
    print()
    
    # Verifica se Node.js está instalado
    print("🔍 Verificando Node.js...")
    try:
        result = subprocess.run(['node', '--version'], capture_output=True, text=True)
        if result.returncode == 0:
            print(f"✅ Node.js {result.stdout.strip()}")
        else:
            print("❌ Node.js não encontrado")
            print("   Instale em: https://nodejs.org/")
            sys.exit(1)
    except FileNotFoundError:
        print("❌ Node.js não encontrado")
        print("   Instale em: https://nodejs.org/")
        sys.exit(1)
    print()
    
    # Verifica se as dependências Python estão instaladas
    print("🔍 Verificando dependências Python...")
    try:
        import flask
        import flask_cors
        print("✅ Dependências Python instaladas")
    except ImportError:
        print("📦 Instalando dependências Python...")
        subprocess.run([sys.executable, '-m', 'pip', 'install', '-r', 'requirements.txt'], check=True)
        print("✅ Dependências Python instaladas")
    print()
    
    # Verifica se o frontend está buildado
    print("🔍 Verificando frontend...")
    dist_path = Path('dist')
    index_path = dist_path / 'index.html'
    
    if not index_path.exists():
        print("⚠️  Frontend não encontrado")
        
        # Instala dependências Node.js se necessário
        node_modules = Path('node_modules')
        if not node_modules.exists():
            print("📦 Instalando dependências Node.js...")
            subprocess.run(['npm', 'install'], check=True)
            print("✅ Dependências Node.js instaladas")
        
        # Faz o build
        print("🏗️  Buildando frontend...")
        subprocess.run(['npm', 'run', 'build'], check=True)
        print("✅ Frontend buildado com sucesso")
    else:
        print("✅ Frontend já está buildado")
    print()
    
    # Inicia o servidor
    print("=" * 70)
    print("🚀 Iniciando servidor...")
    print()
    
    port = 3000
    print(f"📡 Acesse: http://localhost:{port}")
    print(f"💾 Dados salvos em: data.json")
    print(f"🛑 Pressione Ctrl+C para parar")
    print()
    
    # Abre o navegador após 2 segundos
    def open_browser():
        time.sleep(2)
        url = f'http://localhost:{port}'
        print(f"🌐 Abrindo navegador: {url}")
        webbrowser.open(url)
    
    import threading
    threading.Thread(target=open_browser, daemon=True).start()
    
    # Inicia o servidor
    os.environ['PORT'] = str(port)
    from server import app
    app.run(host='0.0.0.0', port=port, debug=False, use_reloader=False)

if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n👋 Servidor encerrado. Até logo!")
        sys.exit(0)
    except Exception as e:
        print(f"\n❌ Erro inesperado: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
