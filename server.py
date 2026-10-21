from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import json
import os
import subprocess
from datetime import datetime

# Obter o diretório base do script
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DIST_DIR = os.path.join(BASE_DIR, 'dist')

def check_and_build():
    """Verifica se o frontend está buildado e faz o build se necessário"""
    index_path = os.path.join(DIST_DIR, 'index.html')
    
    if not os.path.exists(index_path):
        print("⚠️  Frontend não encontrado. Fazendo build automático...")
        print()
        
        # Verifica se node_modules existe
        if not os.path.exists(os.path.join(BASE_DIR, 'node_modules')):
            print("📦 Instalando dependências Node.js...")
            result = subprocess.run(['npm', 'install'], cwd=BASE_DIR, capture_output=True, text=True)
            if result.returncode != 0:
                print(f"❌ Erro ao instalar dependências: {result.stderr}")
                return False
            print("✅ Dependências instaladas")
            print()
        
        # Faz o build
        print("🏗️  Buildando frontend...")
        result = subprocess.run(['npm', 'run', 'build'], cwd=BASE_DIR, capture_output=True, text=True)
        if result.returncode != 0:
            print(f"❌ Erro ao buildar frontend: {result.stderr}")
            return False
        
        print("✅ Frontend buildado com sucesso")
        print()
    
    return True

# Verifica e builda o frontend antes de iniciar o servidor
if not check_and_build():
    print("❌ Erro ao preparar o frontend. Verifique os logs acima.")
    exit(1)

app = Flask(__name__, static_folder=DIST_DIR, static_url_path='')
CORS(app)

DATA_FILE = os.path.join(BASE_DIR, 'data.json')

def load_data():
    """Carrega dados do arquivo JSON"""
    if os.path.exists(DATA_FILE):
        try:
            with open(DATA_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
        except:
            return {}
    return {}

def save_data(data):
    """Salva dados no arquivo JSON"""
    with open(DATA_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

@app.route('/')
def index():
    """Serve o frontend React"""
    return send_from_directory(DIST_DIR, 'index.html')

@app.route('/assets/<path:path>')
def serve_assets(path):
    """Serve arquivos de assets"""
    assets_dir = os.path.join(DIST_DIR, 'assets')
    if os.path.exists(os.path.join(assets_dir, path)):
        return send_from_directory(assets_dir, path)
    return "Asset não encontrado", 404

@app.route('/<path:path>')
def static_files(path):
    """Serve arquivos estáticos do frontend"""
    file_path = os.path.join(DIST_DIR, path)
    if os.path.exists(file_path):
        return send_from_directory(DIST_DIR, path)
    return "Arquivo não encontrado", 404

@app.route('/api/health', methods=['GET'])
def health():
    """Endpoint de health check"""
    return jsonify({
        'status': 'ok',
        'service': 'koinonia-finance',
        'timestamp': datetime.now().isoformat()
    })

@app.route('/api/sync', methods=['POST'])
def sync():
    """Endpoint para sincronização de dados"""
    try:
        operation = request.json
        
        if not operation:
            return jsonify({'status': 'error', 'message': 'No operation provided'}), 400
        
        data = load_data()
        
        entity = operation.get('entity')
        op_type = operation.get('type')
        op_id = operation.get('id')
        op_data = operation.get('data')
        
        if not entity or not op_type or not op_id:
            return jsonify({'status': 'error', 'message': 'Missing required fields'}), 400
        
        # Inicializar entidade se não existir
        if entity not in data:
            data[entity] = {}
        
        # Processar operação
        if op_type == 'CREATE' or op_type == 'UPDATE':
            data[entity][op_id] = {
                'data': op_data,
                'timestamp': datetime.now().isoformat()
            }
        elif op_type == 'DELETE':
            if op_id in data[entity]:
                del data[entity][op_id]
        else:
            return jsonify({'status': 'error', 'message': f'Unknown operation type: {op_type}'}), 400
        
        # Salvar dados
        save_data(data)
        
        return jsonify({
            'status': 'success',
            'operation': operation,
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

@app.route('/api/data/<entity>', methods=['GET'])
def get_data(entity):
    """Endpoint para obter dados de uma entidade"""
    try:
        data = load_data()
        entity_data = data.get(entity, {})
        
        return jsonify({
            'status': 'success',
            'entity': entity,
            'data': entity_data,
            'count': len(entity_data)
        })
        
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

@app.route('/api/data', methods=['GET'])
def get_all_data():
    """Endpoint para obter todos os dados"""
    try:
        data = load_data()
        
        return jsonify({
            'status': 'success',
            'data': data,
            'entities': list(data.keys())
        })
        
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 3000))
    print(f"🏦 Koinonia Finance - Gestão Financeira para Igrejas Evangélicas")
    print(f"🚀 Servidor Local Iniciado")
    print(f"📡 Acessar: http://localhost:{port}")
    print(f"💾 Dados salvos em: {DATA_FILE}")
    print(f"🛑 Pressione Ctrl+C para parar")
    print()
    app.run(host='0.0.0.0', port=port, debug=True)
