#!/bin/bash

echo "========================================================================"
echo "  🏦 KOINONIA FINANCE - Gestão Financeira para Igrejas Evangélicas"
echo "========================================================================"
echo ""

# Verifica se Python está instalado
if ! command -v python3 &> /dev/null; then
    echo "❌ Erro: Python3 não encontrado"
    echo "   Instale com: sudo apt install python3 (Ubuntu/Debian)"
    echo "   Ou: brew install python3 (Mac)"
    exit 1
fi

echo "✅ Python3 encontrado"
echo ""

# Verifica se a pasta dist existe
if [ ! -f "dist/index.html" ]; then
    echo "🏗️  Buildando frontend..."
    npm run build
    if [ $? -ne 0 ]; then
        echo "❌ Erro ao buildar o frontend"
        exit 1
    fi
    echo "✅ Frontend buildado com sucesso"
    echo ""
fi

# Inicia o servidor Python
echo "🚀 Iniciando servidor na porta 3000..."
echo "📡 Acesse: http://localhost:3000"
echo "💾 Dados salvos em: data.json"
echo "🛑 Pressione Ctrl+C para parar"
echo ""
python3 server.py

# Se o script Python falhar, mostra mensagem de erro
if [ $? -ne 0 ]; then
    echo ""
    echo "❌ Erro ao iniciar o servidor"
    exit 1
fi
