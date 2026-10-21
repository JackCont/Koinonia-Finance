#!/usr/bin/env python3
"""
Koinonia Finance - Servidor de Desenvolvimento Local
Usa o servidor do Vite para desenvolvimento e Flask para API
"""

import subprocess
import sys
import os
import time
import webbrowser
import threading
import signal

def check_node():
    """Verifica se Node.js está instalado"""
    try:
        result = subprocess.run(['node', '--version'], capture_output=True, text=True)
        if result.returncode == 0:
            print(f"✅ Node.js {result.stdout.strip()}")
            return True
    except FileNotFoundError:
        pass
    print("❌ Node.js não encontrado")
    print("   Instale em: https://nodejs.org/")
    return False

def check_dependencies():
    """Verifica se node_modules existe"""
    if not os.path.exists('node_modules'):
        print("📦 Instalando dependências Node.js...")
        result = subprocess.run(['npm', 'install'], capture_output=True, text=True)
        if result.returncode != 0:
            print("❌ Erro ao instalar dependências:")
            print(result.stderr)
            return False
        print("✅ Dependências instaladas")
    else:
        print("✅ Dependências já instaladas")
    return True

def check_python_deps():
    """Verifica se as dependências Python estão instaladas"""
    try:
        import flask
        import flask_cors
        return True
    except ImportError:
        print("📦 Instalando dependências Python...")
        subprocess.run([sys.executable, '-m', 'pip', 'install', '-r', 'requirements.txt'])
        return True

def start_vite_server():
    """Inicia o servidor de desenvolvimento do Vite"""
    print("🚀 Iniciando servidor de desenvolvimento...")
    print("📡 Acesse: http://localhost:3000")
    print("💾 Dados salvos em: data.json")
    print("🛑 Pressione Ctrl+C para parar")
    print()
    
    # Inicia Vite em subprocesso
    vite_process = subprocess.Popen(
        ['npm', 'run', 'dev'],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True
    )
    
    return vite_process

def open_browser():
    """Abre o navegador após 3 segundos"""
    time.sleep(3)
    webbrowser.open('http://localhost:3000')

def main():
    print("=" * 60)
    print("  🏦 KOINONIA FINANCE - Modo Desenvolvimento")
    print("=" * 60)
    print()
    
    # Verifica Node.js
    if not check_node():
        sys.exit(1)
    
    # Verifica dependências
    if not check_dependencies():
        sys.exit(1)
    
    if not check_python_deps():
        sys.exit(1)
    
    print()
    
    # Abre o navegador em thread separada
    threading.Thread(target=open_browser, daemon=True).start()
    
    # Inicia servidor Vite
    vite_process = start_vite_server()
    
    try:
        # Aguarda o processo
        vite_process.wait()
    except KeyboardInterrupt:
        print("\n\n👋 Encerrando servidor...")
        vite_process.terminate()
        vite_process.wait()
        print("✅ Servidor encerrado")
        sys.exit(0)

if __name__ == '__main__':
    main()
