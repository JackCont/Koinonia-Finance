#!/usr/bin/env python3
"""
Koinonia Finance - Inicializador Local
Faz build do frontend se necessário e inicia o servidor
"""

import subprocess
import sys
import os
import time
import webbrowser
import threading

def check_and_build():
    """Verifica se a pasta dist existe e faz build se necessário"""
    if not os.path.exists('dist') or not os.path.exists('dist/index.html'):
        print("📦 Pasta dist/ não encontrada. Fazendo build do frontend...")
        result = subprocess.run(['npm', 'run', 'build'], capture_output=True, text=True)
        if result.returncode != 0:
            print("❌ Erro no build:")
            print(result.stderr)
            return False
        print("✅ Build concluído!")
    else:
        print("✅ Frontend já buildado")
    return True

def check_dependencies():
    """Verifica se as dependências estão instaladas"""
    try:
        import flask
        import flask_cors
        return True
    except ImportError:
        print("📦 Instalando dependências Python...")
        subprocess.run([sys.executable, '-m', 'pip', 'install', '-r', 'requirements.txt'])
        return True

def open_browser():
    """Abre o navegador após 2 segundos"""
    time.sleep(2)
    webbrowser.open('http://localhost:8080')

def main():
    print("=" * 60)
    print("  🏦 KOINONIA FINANCE - Iniciando...")
    print("=" * 60)
    print()
    
    # Verifica dependências
    if not check_dependencies():
        print("❌ Erro ao instalar dependências")
        sys.exit(1)
    
    # Verifica e faz build
    if not check_and_build():
        print("❌ Erro no build do frontend")
        sys.exit(1)
    
    print()
    print("🚀 Iniciando servidor...")
    print("📡 Acesse: http://localhost:8080")
    print("💾 Dados salvos em: data.json")
    print("🛑 Pressione Ctrl+C para parar")
    print()
    
    # Abre o navegador em thread separada
    threading.Thread(target=open_browser, daemon=True).start()
    
    # Importa e inicia o servidor
    from server import app
    app.run(host='0.0.0.0', port=8080, debug=False)

if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n👋 Servidor encerrado!")
        sys.exit(0)
