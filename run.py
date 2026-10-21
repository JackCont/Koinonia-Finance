#!/usr/bin/env python3
"""
Koinonia Finance - Servidor com Auto-Build
Este script verifica se o frontend está buildado e faz o build automaticamente se necessário
"""

import subprocess
import sys
import os
import time
import webbrowser
from pathlib import Path

def check_and_build():
    """Verifica se o frontend está buildado e faz o build se necessário"""
    dist_path = Path('dist')
    index_path = dist_path / 'index.html'
    
    print("=" * 70)
    print("🏦 KOINONIA FINANCE - Servidor com Auto-Build")
    print("=" * 70)
    print()
    
    # Verifica se a pasta dist existe
    if not dist_path.exists():
        print("⚠️  Pasta dist/ não encontrada")
        print("🏗️  Iniciando build do frontend...")
        print()
        
        # Verifica se node_modules existe
        if not Path('node_modules').exists():
            print("📦 Instalando dependências Node.js...")
            result = subprocess.run(['npm', 'install'], capture_output=True, text=True)
            if result.returncode != 0:
                print(f"❌ Erro ao instalar dependências: {result.stderr}")
                return False
            print("✅ Dependências instaladas")
            print()
        
        # Faz o build
        result = subprocess.run(['npm', 'run', 'build'], capture_output=True, text=True)
        if result.returncode != 0:
            print(f"❌ Erro ao buildar frontend: {result.stderr}")
            return False
        
        print("✅ Frontend buildado com sucesso")
        print()
    
    # Verifica se o index.html existe
    if not index_path.exists():
        print("❌ Erro: dist/index.html não encontrado mesmo após o build")
        return False
    
    print("✅ Frontend pronto")
    print()
    return True

def start_server(port=3000):
    """Inicia o servidor Flask"""
    print(f"🚀 Iniciando servidor na porta {port}...")
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
    
    try:
        from server import app
        app.run(host='0.0.0.0', port=port, debug=False, use_reloader=False)
    except Exception as e:
        print(f"❌ Erro ao iniciar servidor: {e}")
        return False
    
    return True

def main():
    """Função principal"""
    # Verifica argumentos
    if len(sys.argv) > 1:
        if sys.argv[1] == '--clear':
            data_file = Path('data.json')
            if data_file.exists():
                data_file.unlink()
                print("✅ Arquivo data.json removido")
            return
        elif sys.argv[1] == '--help':
            print("Uso: python run.py [opção]")
            print()
            print("Opções:")
            print("  --clear    Limpa todos os dados")
            print("  --help     Mostra esta ajuda")
            print()
            return
    
    # Verifica e builda o frontend se necessário
    if not check_and_build():
        sys.exit(1)
    
    # Inicia o servidor
    if not start_server(port=3000):
        sys.exit(1)

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
