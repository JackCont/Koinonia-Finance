@echo off
chcp 65001 >nul
title Koinonia Finance - Servidor Local

echo ========================================================================
echo   🏦 KOINONIA FINANCE - Sistema de Gestão Financeira Eclesiástica
echo ========================================================================
echo.

REM Verifica se Python está instalado
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Erro: Python não encontrado
    echo    Instale em: https://www.python.org/downloads/
    echo    Durante a instalação, marque "Add Python to PATH"
    pause
    exit /b 1
)

echo ✅ Python encontrado
echo.

REM Verifica se Node.js está instalado
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Erro: Node.js não encontrado
    echo    Instale em: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js encontrado
echo.

REM Executa o script Python de inicialização
echo 🚀 Iniciando servidor local...
echo.
python iniciar.py

REM Se o script Python falhar, mostra mensagem de erro
if %errorlevel% neq 0 (
    echo.
    echo ❌ Erro ao iniciar o servidor
    pause
)
