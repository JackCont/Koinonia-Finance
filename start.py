#!/usr/bin/env python3
"""
Koinonia Finance - Script de Inicialização Automática
Executa build do frontend (se necessário) e inicia o servidor em até 3 segundos
"""

import subprocess
import sys
import os
import time
import webbrowser
from pathlib import Path

def check_and_build():
    """Verifica e builda o frontend se necessário"""
    dist_path = Path('dist')
    index_path = dist_path / 'index.html'
    
    if index_path.exists():
        print("✅ Frontend já está buildado")
        return True
    
    print("🏗️  Buildando frontend...")
    
    # Instala dependências se necessário
    if not Path('node_modules').exists():
        print("📦 Instalando dependências...")
        result = subprocess.run(['npm', 'install'], capture_output=True)
        if result.returncode != 0:
            print("❌ Erro ao instalar dependências")
            return False
    
    # Faz o build
    result = subprocess.run(['npm', 'run', 'build'], capture_output=True)
    if result.returncode != 0:
        print("❌ Erro ao buildar frontend")
        return False
    
    print("✅ Frontend buildado com sucesso")
    return True

def check_dependencies():
    """Verifica dependências Python"""
    try:
        import flask
        import flask_cors
        return True
    except ImportError:
        print("📦 Instalando dependências Python...")
        subprocess.run([sys.executable, '-m', 'pip', 'install', 'flask', 'flask-cors'], 
                      capture_output=True)
        return True

def main():
    """Função principal"""
    print("=" * 70)
    print("🏦 KOINONIA FINANCE - Inicialização")
    print("=" * 70)
    print()
    
    # Verifica dependências
    if not check_dependencies():
        sys.exit(1)
    
    # Verifica e builda frontend
    if not check_and_build():
        sys.exit(1)
    
    print()
    print("🚀 Iniciando servidor na porta 3000...")
    print("📡 Acesse: http://localhost:3000")
    print()
    
    # Abre o navegador em 2 segundos
    def open_browser():
        time.sleep(2)
        webbrowser.open('http://localhost:3000')
    
    import threading
    threading.Thread(target=open_browser, daemon=True).start()
    
    # Inicia o servidor
    os.environ['PORT'] = '3000'
    os.system(f'{sys.executable} server.py')

if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n👋 Servidor encerrado")
        sys.exit(0)
