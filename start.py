#!/usr/bin/env python3
"""
Koinonia Finance - Script de Inicialização Automática
Este script verifica dependências, faz build se necessário, inicia o servidor e abre o navegador
"""

import subprocess
import sys
import os
import time
import webbrowser
from pathlib import Path

def print_header():
    """Imprime cabeçalho formatado"""
    print("=" * 70)
    print("🏦 KOINONIA FINANCE - Gestão Financeira para Igrejas Evangélicas")
    print("=" * 70)
    print()

def check_python():
    """Verifica se Python está instalado"""
    print("🔍 Verificando Python...")
    if sys.version_info < (3, 8):
        print("❌ Erro: Python 3.8 ou superior é necessário")
        print(f"   Versão atual: {sys.version_info.major}.{sys.version_info.minor}")
        return False
    print(f"✅ Python {sys.version_info.major}.{sys.version_info.minor}.{sys.version_info.micro}")
    return True

def check_node():
    """Verifica se Node.js está instalado"""
    print("\n🔍 Verificando Node.js...")
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

def install_python_deps():
    """Instala dependências Python"""
    print("\n📦 Instalando dependências Python...")
    try:
        subprocess.run([sys.executable, '-m', 'pip', 'install', '-r', 'requirements.txt'], 
                      check=True, capture_output=True)
        print("✅ Dependências Python instaladas")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Erro ao instalar dependências Python: {e}")
        return False

def install_node_deps():
    """Instala dependências Node.js"""
    print("\n📦 Instalando dependências Node.js...")
    try:
        subprocess.run(['npm', 'install'], check=True, capture_output=True)
        print("✅ Dependências Node.js instaladas")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Erro ao instalar dependências Node.js: {e}")
        return False

def check_dist():
    """Verifica se a pasta dist existe e tem conteúdo"""
    print("\n🔍 Verificando frontend buildado...")
    dist_path = Path('dist')
    index_path = dist_path / 'index.html'
    
    if not dist_path.exists():
        print("⚠️  Pasta dist/ não existe")
        return False
    
    if not index_path.exists():
        print("⚠️  Arquivo dist/index.html não existe")
        return False
    
    print("✅ Frontend já está buildado")
    return True

def build_frontend():
    """Faz o build do frontend"""
    print("\n🏗️  Buildando frontend...")
    try:
        result = subprocess.run(['npm', 'run', 'build'], check=True, capture_output=True, text=True)
        print("✅ Frontend buildado com sucesso")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Erro ao buildar frontend: {e}")
        print(f"   stdout: {e.stdout}")
        print(f"   stderr: {e.stderr}")
        return False

def start_server(port=3000):
    """Inicia o servidor Flask"""
    print(f"\n🚀 Iniciando servidor na porta {port}...")
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

def clear_data():
    """Limpa todos os dados"""
    print("\n🗑️  Limpando dados...")
    
    data_file = Path('data.json')
    if data_file.exists():
        data_file.unlink()
        print("✅ Arquivo data.json removido")
    else:
        print("ℹ️  Arquivo data.json não existia")
    
    # Limpa localStorage do navegador (instrução)
    print("\n📱 Para limpar dados do navegador:")
    print("   1. Abra o aplicativo no navegador")
    print("   2. Pressione F12 para abrir DevTools")
    print("   3. Vá em Application → Local Storage")
    print("   4. Clique com botão direito → Clear")
    print()

def main():
    """Função principal"""
    print_header()
    
    # Verifica argumentos
    if len(sys.argv) > 1:
        if sys.argv[1] == '--clear':
            clear_data()
            return
        elif sys.argv[1] == '--help':
            print("Uso: python start.py [opção]")
            print()
            print("Opções:")
            print("  --clear    Limpa todos os dados")
            print("  --help     Mostra esta ajuda")
            print()
            return
    
    # Verifica pré-requisitos
    if not check_python():
        sys.exit(1)
    
    if not check_node():
        sys.exit(1)
    
    # Instala dependências se necessário
    node_modules = Path('node_modules')
    if not node_modules.exists():
        if not install_node_deps():
            sys.exit(1)
    
    # Verifica dependências Python
    try:
        import flask
        import flask_cors
    except ImportError:
        if not install_python_deps():
            sys.exit(1)
    
    # Verifica se precisa fazer build
    if not check_dist():
        if not build_frontend():
            sys.exit(1)
    
    # Inicia o servidor
    print("\n" + "=" * 70)
    start_server(port=3000)

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
