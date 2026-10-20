from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
from datetime import datetime
import psycopg2
from psycopg2.extras import RealDictCursor

app = Flask(__name__)

# Configuração CORS para aceitar requisições do GitHub Pages
CORS(app, origins=[
    'https://jackcont.github.io',
    'http://localhost:5173',
    'http://localhost:3000'
])

# Configuração do banco de dados PostgreSQL (Supabase)
DATABASE_URL = os.environ.get('DATABASE_URL')

def get_db_connection():
    """Conecta ao banco de dados PostgreSQL"""
    if not DATABASE_URL:
        raise Exception("DATABASE_URL não configurado")
    
    conn = psycopg2.connect(DATABASE_URL, cursor_factory=RealDictCursor)
    return conn

def init_db():
    """Inicializa o banco de dados com as tabelas necessárias"""
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        # Tabela de membros
        cur.execute('''
            CREATE TABLE IF NOT EXISTS members (
                id TEXT PRIMARY KEY,
                nome TEXT NOT NULL,
                cpf TEXT,
                email TEXT,
                telefone TEXT,
                endereco TEXT,
                data_nascimento TEXT,
                data_admissao TEXT,
                status TEXT DEFAULT 'ATIVO',
                ministerios TEXT[],
                congregacao TEXT,
                observacoes TEXT,
                foto TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Tabela de transações
        cur.execute('''
            CREATE TABLE IF NOT EXISTS transactions (
                id TEXT PRIMARY KEY,
                data TEXT NOT NULL,
                tipo TEXT NOT NULL,
                categoria TEXT NOT NULL,
                valor DECIMAL(10, 2) NOT NULL,
                descricao TEXT,
                congregacao TEXT,
                member_id TEXT REFERENCES members(id),
                culto_id TEXT,
                documento TEXT,
                estornada BOOLEAN DEFAULT FALSE,
                estorno_motivo TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                competencia TEXT,
                eh_provisao BOOLEAN DEFAULT FALSE,
                usa_provisao BOOLEAN DEFAULT FALSE,
                provison_utilizadas JSONB,
                afeta_caixa BOOLEAN DEFAULT TRUE
            )
        ''')
        
        # Tabela de provisões
        cur.execute('''
            CREATE TABLE IF NOT EXISTS provisions (
                id TEXT PRIMARY KEY,
                data TEXT NOT NULL,
                competencia TEXT NOT NULL,
                competencia_destino TEXT NOT NULL,
                valor DECIMAL(10, 2) NOT NULL,
                descricao TEXT,
                categoria_destino TEXT,
                status TEXT DEFAULT 'PENDENTE',
                congregacao TEXT,
                observacoes TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                valor_utilizado DECIMAL(10, 2) DEFAULT 0,
                saldo_disponivel DECIMAL(10, 2)
            )
        ''')
        
        # Tabela de cultos
        cur.execute('''
            CREATE TABLE IF NOT EXISTS cults (
                id TEXT PRIMARY KEY,
                nome TEXT NOT NULL,
                data TEXT NOT NULL,
                tipo TEXT NOT NULL,
                observacoes TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Tabela de congregações
        cur.execute('''
            CREATE TABLE IF NOT EXISTS congregations (
                id TEXT PRIMARY KEY,
                nome TEXT NOT NULL,
                cidade TEXT,
                setor TEXT,
                pastor TEXT,
                ativo BOOLEAN DEFAULT TRUE,
                data_inicio TEXT,
                data_fim TEXT,
                endereco TEXT,
                telefone TEXT,
                observacoes TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Tabela de igrejas
        cur.execute('''
            CREATE TABLE IF NOT EXISTS churches (
                id TEXT PRIMARY KEY,
                nome TEXT NOT NULL,
                cnpj TEXT,
                endereco TEXT,
                telefone TEXT,
                email TEXT,
                pastor_presidente TEXT,
                tesoureiro TEXT,
                regiao TEXT,
                cidade TEXT,
                setor TEXT,
                ativo BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Tabela de valores fixos
        cur.execute('''
            CREATE TABLE IF NOT EXISTS fixed_values (
                id TEXT PRIMARY KEY,
                categoria TEXT NOT NULL,
                valor DECIMAL(10, 2) NOT NULL,
                descricao TEXT,
                data_inicio TEXT,
                data_fim TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        conn.commit()
        cur.close()
        conn.close()
        print("✅ Banco de dados inicializado com sucesso")
    except Exception as e:
        print(f"❌ Erro ao inicializar banco de dados: {e}")

# Inicializar banco de dados na inicialização
with app.app_context():
    init_db()

@app.route('/api/health', methods=['GET'])
def health():
    """Endpoint de health check"""
    return jsonify({
        'status': 'ok',
        'service': 'koinonia-finance-api',
        'timestamp': datetime.now().isoformat()
    })

@app.route('/api/sync', methods=['POST'])
def sync():
    """Endpoint para sincronização de dados"""
    try:
        operation = request.json
        
        if not operation:
            return jsonify({'status': 'error', 'message': 'No operation provided'}), 400
        
        entity = operation.get('entity')
        op_type = operation.get('type')
        op_id = operation.get('id')
        op_data = operation.get('data')
        
        if not entity or not op_type or not op_id:
            return jsonify({'status': 'error', 'message': 'Missing required fields'}), 400
        
        conn = get_db_connection()
        cur = conn.cursor()
        
        # Processar operação baseada no tipo
        if op_type == 'CREATE' or op_type == 'UPDATE':
            # Converter dados para formato SQL
            columns = ', '.join(op_data.keys())
            placeholders = ', '.join([f'%({k})s' for k in op_data.keys()])
            
            if op_type == 'CREATE':
                query = f"INSERT INTO {entity} (id, {columns}) VALUES (%(id)s, {placeholders})"
            else:
                set_clause = ', '.join([f"{k} = %({k})s" for k in op_data.keys()])
                query = f"UPDATE {entity} SET {set_clause} WHERE id = %(id)s"
            
            params = {'id': op_id, **op_data}
            cur.execute(query, params)
        
        elif op_type == 'DELETE':
            cur.execute(f"DELETE FROM {entity} WHERE id = %s", (op_id,))
        
        conn.commit()
        cur.close()
        conn.close()
        
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
        conn = get_db_connection()
        cur = conn.cursor()
        
        cur.execute(f"SELECT * FROM {entity}")
        rows = cur.fetchall()
        
        cur.close()
        conn.close()
        
        # Converter para lista de dicionários
        data = [dict(row) for row in rows]
        
        return jsonify({
            'status': 'success',
            'entity': entity,
            'data': data,
            'count': len(data)
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
        conn = get_db_connection()
        cur = conn.cursor()
        
        # Obter todas as tabelas
        cur.execute("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
        """)
        tables = [row['table_name'] for row in cur.fetchall()]
        
        data = {}
        for table in tables:
            cur.execute(f"SELECT * FROM {table}")
            rows = cur.fetchall()
            data[table] = [dict(row) for row in rows]
        
        cur.close()
        conn.close()
        
        return jsonify({
            'status': 'success',
            'data': data,
            'entities': tables
        })
        
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

# Para desenvolvimento local
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8080))
    app.run(host='0.0.0.0', port=port, debug=True)
