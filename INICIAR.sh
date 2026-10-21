#!/bin/bash

echo "========================================================================"
echo "  🏦 KOINONIA FINANCE - Gestão Financeira para Igrejas Evangélicas"
echo "========================================================================"
echo ""

# Verifica se Python está instalado
if ! command -v python3 &> /dev/null; then
    echo "❌ Erro: Python3 não encontrado"
    echo "   Instale em: https://www.python.org/downloads/"
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

# Executa o script de inicialização
echo "🚀 Iniciando sistema automático..."
echo ""
python3 start.py
