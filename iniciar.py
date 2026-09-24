import subprocess
import webbrowser
import os
import sys
import threading
import time

def open_browser():
    time.sleep(5)
    webbrowser.open('http://localhost:3000')

script_dir = os.path.dirname(os.path.abspath(__file__))
os.chdir(script_dir)

print("=" * 60)
print("  TESOURARIA IEAD - Iniciando...")
print("=" * 60)
print()

# Check if node_modules exists
if not os.path.exists('node_modules'):
    print("Instalando dependencias (primeira vez)...")
    print()
    subprocess.run(['npm', 'install'], shell=True)
    print()

print("Iniciando servidor de desenvolvimento...")
print()
print("URL: http://localhost:3000")
print("O navegador abrira automaticamente...")
print()
print("Para parar: Pressione Ctrl+C")
print()

# Start browser in a separate thread
threading.Thread(target=open_browser, daemon=True).start()

# Start Vite dev server
try:
    subprocess.run(['npm', 'run', 'dev'], shell=True)
except KeyboardInterrupt:
    print("\n\nServidor parado.")
