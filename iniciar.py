import http.server
import socketserver
import webbrowser
import os
import sys
import threading
import time
import json
from datetime import datetime

PORT = 8080
SYNC_FILE = 'sync_queue.json'

def open_browser():
    time.sleep(1.5)
    webbrowser.open(f'http://localhost:{PORT}')

class SyncManager:
    """Gerenciador de sincronização offline/online"""
    
    def __init__(self):
        self.queue_file = SYNC_FILE
        self.load_queue()
    
    def load_queue(self):
        """Carrega fila de sincronização pendente"""
        if os.path.exists(self.queue_file):
            try:
                with open(self.queue_file, 'r', encoding='utf-8') as f:
                    self.queue = json.load(f)
            except:
                self.queue = []
        else:
            self.queue = []
    
    def save_queue(self):
        """Salva fila de sincronização"""
        with open(self.queue_file, 'w', encoding='utf-8') as f:
            json.dump(self.queue, f, indent=2, ensure_ascii=False)
    
    def add_to_queue(self, operation):
        """Adiciona operação à fila"""
        operation['timestamp'] = datetime.now().isoformat()
        self.queue.append(operation)
        self.save_queue()
    
    def process_queue(self):
        """Processa fila de sincronização"""
        if not self.queue:
            return 0
        
        processed = 0
        for operation in self.queue[:]:
            try:
                # Aqui você implementaria a lógica de envio para o servidor
                # Por enquanto, apenas marcamos como processado
                print(f"[SYNC] Processando: {operation.get('type', 'unknown')}")
                processed += 1
            except Exception as e:
                print(f"[SYNC] Erro ao processar: {e}")
                break
        
        # Remove operações processadas
        self.queue = self.queue[processed:]
        self.save_queue()
        return processed

# Inicializa gerenciador de sincronização
sync_manager = SyncManager()

script_dir = os.path.dirname(os.path.abspath(__file__))
dist_dir = os.path.join(script_dir, 'dist')

print("=" * 60)
print("  KOINONIA FINANCE - Servidor Local")
print("=" * 60)
print()

# Verifica pasta dist
if not os.path.exists(dist_dir):
    print("ERRO: Pasta 'dist' não encontrada!")
    print("Execute: npm run build")
    input("\nPressione Enter para sair...")
    sys.exit(1)

# Verifica index.html
index_path = os.path.join(dist_dir, 'index.html')
if not os.path.exists(index_path):
    print("ERRO: index.html não encontrado em dist/")
    print("Execute: npm run build")
    input("\nPressione Enter para sair...")
    sys.exit(1)

print(f"Servidor: http://localhost:{PORT}")
print(f"Diretório: {dist_dir}")
print()

# Processa fila de sincronização pendente
pending = len(sync_manager.queue)
if pending > 0:
    print(f"[SYNC] Processando {pending} operação(ões) pendente(s)...")
    processed = sync_manager.process_queue()
    print(f"[SYNC] {processed} operação(ões) sincronizada(s)")
    print()

# Inicia navegador
threading.Thread(target=open_browser, daemon=True).start()

# Handler customizado
class KoinoniaHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=dist_dir, **kwargs)
    
    def log_message(self, format, *args):
        # Log silencioso para produção
        pass
    
    def do_POST(self):
        """Endpoint para sincronização"""
        if self.path == '/api/sync':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            
            try:
                data = json.loads(post_data.decode('utf-8'))
                sync_manager.add_to_queue(data)
                
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'status': 'queued'}).encode('utf-8'))
            except Exception as e:
                self.send_response(500)
                self.end_headers()
                self.wfile.write(json.dumps({'error': str(e)}).encode('utf-8'))
        else:
            self.send_response(404)
            self.end_headers()

try:
    with socketserver.TCPServer(("", PORT), KoinoniaHandler) as httpd:
        print("Servidor iniciado com sucesso!")
        print("Pressione Ctrl+C para parar")
        print()
        httpd.serve_forever()
except KeyboardInterrupt:
    print("\n\nServidor parado.")
except OSError as e:
    if "Address already in use" in str(e):
        print(f"\nERRO: Porta {PORT} já está em uso!")
        print("Feche outros programas ou altere a porta em iniciar.py")
        input("\nPressione Enter para sair...")
    else:
        raise
