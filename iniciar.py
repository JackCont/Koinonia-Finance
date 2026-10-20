#!/usr/bin/env python3
"""
Koinonia Finance - Script de Inicialização Local
Este script prepara e inicia o servidor local para desenvolvimento e uso em rede local.
"""

import subprocess
import sys
import os
import time
import webbrowser
from pathlib import Path

def print_header():
    """Imprime o cabeçalho do script"""
    print("=" * 70)
    print("  🏦 KOINONIA FINANCE - Sistema de Gestão Financeira Eclesiástica")
    print("=" * 70)
    print()

def check_python_version():
    """Verifica se a versão do Python é compatível"""
    if sys.version_info < (3, 8):
        print("❌ Erro: Python 3.8 ou superior é necessário")
        print(f"   Versão atual: {sys.version_info.major}.{sys.version_info.minor}")
        return False
    print(f"✅ Python {sys.version_info.major}.{sys.version_info.minor}.{sys.version_info.micro}")
    return True

def check_node_installed():
    """Verifica se o Node.js está instalado"""
    try:
        result = subprocess.run(['node', '--version'], capture_output=True, text=True)
        if result.returncode == 0:
            print(f"✅ Node.js {result.stdout.strip()}")
            return True
    except FileNotFoundError:
        pass
    print("❌ Erro: Node.js não encontrado")
    print("   Instale em: https://nodejs.org/")
    return False

def install_python_dependencies():
    """Instala as dependências Python"""
    print("\n📦 Instalando dependências Python...")
    try:
        subprocess.run([sys.executable, '-m', 'pip', 'install', '-r', 'requirements.txt'], check=True)
        print("✅ Dependências Python instaladas")
        return True
    except subprocess.CalledProcessError:
        print("❌ Erro ao instalar dependências Python")
        return False

def install_node_dependencies():
    """Instala as dependências Node.js"""
    print("\n📦 Instalando dependências Node.js...")
    try:
        subprocess.run(['npm', 'install'], check=True)
        print("✅ Dependências Node.js instaladas")
        return True
    except subprocess.CalledProcessError:
        print("❌ Erro ao instalar dependências Node.js")
        return False

def build_frontend():
    """Faz o build do frontend React"""
    print("\n🏗️  Buildando frontend...")
    try:
        subprocess.run(['npm', 'run', 'build'], check=True)
        print("✅ Frontend buildado com sucesso")
        return True
    except subprocess.CalledProcessError:
        print("❌ Erro ao buildar frontend")
        return False

def start_server(port=8080):
    """Inicia o servidor Flask"""
    print(f"\n🚀 Iniciando servidor na porta {port}...")
    print(f"📡 Acesse: http://localhost:{port}")
    print(f"🌐 Rede local: http://[SEU-IP]:{port}")
    print(f"💾 Dados salvos em: data.json")
    print(f"🛑 Pressione Ctrl+C para parar")
    print()
    
    # Abre o navegador após 2 segundos
    def open_browser():
        time.sleep(2)
        webbrowser.open(f'http://localhost:{port}')
    
    import threading
    threading.Thread(target=open_browser, daemon=True).start()
    
    # Inicia o servidor
    os.environ['PORT'] = str(port)
    from server import app
    app.run(host='0.0.0.0', port=port, debug=False)

def main():
    """Função principal"""
    print_header()
    
    # Verifica pré-requisitos
    print("🔍 Verificando pré-requisitos...")
    if not check_python_version():
        sys.exit(1)
    
    if not check_node_installed():
        sys.exit(1)
    
    # Verifica se é primeira execução
    node_modules_exists = Path('node_modules').exists()
    data_file_exists = Path('data.json').exists()
    dist_exists = Path('dist').exists()
    
    if not node_modules_exists or not data_file_exists or not dist_exists:
        print("\n📋 Primeira execução detectada - preparando ambiente...")
        
        # Instala dependências Python
        if not install_python_dependencies():
            sys.exit(1)
        
        # Instala dependências Node.js
        if not install_node_dependencies():
            sys.exit(1)
        
        # Builda o frontend
        if not build_frontend():
            sys.exit(1)
        
        print("\n✅ Ambiente preparado com sucesso!")
    else:
        print("\n✅ Ambiente já preparado")
    
    # Pergunta se quer rebuildar
    print("\n🔄 Deseja rebuildar o frontend? (s/n)")
    response = input().strip().lower()
    if response == 's':
        if not build_frontend():
            print("⚠️  Erro ao rebuildar, continuando com versão atual...")
    
    # Inicia o servidor
    print("\n" + "=" * 70)
    start_server()

if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n👋 Servidor encerrado. Até logo!")
        sys.exit(0)
    except Exception as e:
        print(f"\n❌ Erro inesperado: {e}")
        sys.exit(1)
