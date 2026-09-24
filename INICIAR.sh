#!/bin/bash

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

clear

echo ""
echo -e "${BLUE}╔══════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                                                          ║${NC}"
echo -e "${BLUE}║         ⛪  GESTÃO DE TESOURARIA - IEAD  ⛪              ║${NC}"
echo -e "${BLUE}║                                                          ║${NC}"
echo -e "${BLUE}║         Sistema de Gestão Eclesiástica Integrada         ║${NC}"
echo -e "${BLUE}║                                                          ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${YELLOW}Iniciando o servidor de desenvolvimento...${NC}"
echo ""
echo "Aguarde até aparecer a mensagem:"
echo -e "  ${GREEN}Local: http://localhost:3000/${NC}"
echo ""
echo "Depois abra o navegador e acesse: ${GREEN}http://localhost:3000${NC}"
echo ""
echo "──────────────────────────────────────────────────────────"
echo ""

# Verificar se Node.js está instalado
if ! command -v node &> /dev/null; then
    echo -e "${RED}[ERRO] Node.js não está instalado!${NC}"
    echo ""
    echo "Por favor, instale o Node.js antes de continuar:"
    echo "https://nodejs.org/"
    echo ""
    exit 1
fi

# Verificar se node_modules existe
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}[INFO] Instalando dependências...${NC}"
    echo ""
    npm install
    echo ""
fi

echo -e "${GREEN}[INFO] Iniciando servidor...${NC}"
echo ""
echo "──────────────────────────────────────────────────────────"
echo ""

# Iniciar o servidor
npm run dev
