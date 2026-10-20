#!/bin/bash
# Script de build completo para o Render
# Builda tanto o backend Python quanto o frontend React

set -e

echo "🔧 Iniciando build completo..."

# 1. Instalar dependências Python
echo "📦 Instalando dependências Python..."
pip install -r requirements.txt

# 2. Instalar dependências Node.js
echo "📦 Instalando dependências Node.js..."
npm install

# 3. Buildar o frontend React
echo "🏗️  Buildando frontend React..."
npm run build

# 4. Verificar se a pasta dist foi criada
if [ -d "dist" ]; then
    echo "✅ Frontend buildado com sucesso!"
    echo "📁 Arquivos em dist/:"
    ls -la dist/
else
    echo "❌ Erro: Pasta dist não foi criada!"
    exit 1
fi

echo "✅ Build completo finalizado!"
