#!/bin/bash

echo "========================================================================"
echo "  🏦 KOINONIA FINANCE - Sistema de Gestão Financeira Eclesiástica"
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

# Verifica se Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Erro: Node.js não encontrado"
    echo "   Instale em: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js encontrado"
echo ""

# Executa o script Python de inicialização
echo "🚀 Iniciando servidor local..."
echo ""
python3 iniciar.py

# Se o script Python falhar, mostra mensagem de erro
if [ $? -ne 0 ]; then
    echo ""
    echo "❌ Erro ao iniciar o servidor"
    exit 1
fi
