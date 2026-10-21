#!/usr/bin/env python3
"""
Koinonia Finance - Script de Inicialização Definitivo
Este script garante que o frontend está buildado e inicia o servidor
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
    print("🏦 KOINONIA FINANCE - Inicialização")
    print("=" * 70)
    print()
    
    # Verifica se a pasta dist existe e tem o index.html
    dist_path = Path('dist')
    index_path = dist_path / 'index.html'
    
    if not index_path.exists():
        print("🏗️  Frontend não encontrado. Fazendo build...")
        print()
        
        # Instala dependências se necessário
        node_modules = Path('node_modules')
        if not node_modules.exists():
            print("📦 Instalando dependências Node.js...")
            result = subprocess.run(['npm', 'install'], capture_output=True, text=True)
            if result.returncode != 0:
                print(f"❌ Erro: {result.stderr}")
                sys.exit(1)
            print("✅ Dependências instaladas")
            print()
        
        # Faz o build
        print("🏗️  Buildando frontend...")
        result = subprocess.run(['npm', 'run', 'build'], capture_output=True, text=True)
        if result.returncode != 0:
            print(f"❌ Erro: {result.stderr}")
            sys.exit(1)
        
        print("✅ Frontend buildado com sucesso")
        print()
    else:
        print("✅ Frontend já está buildado")
        print()
    
    # Verifica dependências Python
    print("📦 Verificando dependências Python...")
    try:
        import flask
        import flask_cors
        print("✅ Dependências Python OK")
    except ImportError:
        print("📦 Instalando dependências Python...")
        subprocess.run([sys.executable, '-m', 'pip', 'install', '-r', 'requirements.txt'], check=True)
        print("✅ Dependências Python instaladas")
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
    
    # Importa e inicia o servidor
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
