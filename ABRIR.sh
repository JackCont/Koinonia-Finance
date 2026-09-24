#!/bin/bash

# Cores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

clear

echo ""
echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                                                            ║${NC}"
echo -e "${BLUE}║           ⛪  GESTÃO DE TESOURARIA - IEAD  ⛪              ║${NC}"
echo -e "${BLUE}║                                                            ║${NC}"
echo -e "${BLUE}║         Sistema de Gestão Eclesiástica Integrada           ║${NC}"
echo -e "${BLUE}║                                                            ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${GREEN}Iniciando o aplicativo...${NC}"
echo ""

# Verificar se Python3 está disponível
if command -v python3 &> /dev/null; then
    echo -e "${GREEN}[OK]${NC} Python3 encontrado. Iniciando servidor local..."
    echo ""
    echo "O aplicativo será aberto automaticamente no navegador."
    echo "Para fechar, pressione Ctrl+C nesta janela."
    echo ""
    echo "────────────────────────────────────────────────────────"
    echo ""
    
    # Abrir navegador após 2 segundos (background)
    (sleep 2 && xdg-open http://localhost:8080 2>/dev/null || open http://localhost:8080 2>/dev/null) &
    
    # Iniciar servidor Python na pasta dist
    cd dist
    python3 -m http.server 8080
    exit 0
fi

# Verificar se Python está disponível
if command -v python &> /dev/null; then
    echo -e "${GREEN}[OK]${NC} Python encontrado. Iniciando servidor local..."
    echo ""
    echo "O aplicativo será aberto automaticamente no navegador."
    echo "Para fechar, pressione Ctrl+C nesta janela."
    echo ""
    echo "────────────────────────────────────────────────────────"
    echo ""
    
    # Abrir navegador após 2 segundos (background)
    (sleep 2 && xdg-open http://localhost:8080 2>/dev/null || open http://localhost:8080 2>/dev/null) &
    
    # Iniciar servidor Python na pasta dist
    cd dist
    python -m http.server 8080
    exit 0
fi

# Se não encontrou Python, mostrar instruções
echo ""
echo -e "${RED}[ERRO]${NC} Python não encontrado!"
echo ""
echo "════════════════════════════════════════════════════════════"
echo ""
echo "Para usar este aplicativo, você precisa instalar o Python."
echo ""
echo "PASSO 1: Instale o Python:"
echo "  - Ubuntu/Debian: sudo apt install python3"
echo "  - Fedora: sudo dnf install python3"
echo "  - Mac: brew install python3"
echo "  - Ou baixe em: https://python.org"
echo ""
echo "PASSO 2: Execute este arquivo novamente"
echo ""
echo "════════════════════════════════════════════════════════════"
echo ""
echo "Ou, se preferir, abra o arquivo INICIO.html no navegador"
echo "para ver instruções detalhadas."
echo ""
