@echo off
chcp 65001 >nul
title Koinonia Finance

echo ========================================================================
echo   🏦 KOINONIA FINANCE - Inicialização Automática
echo ========================================================================
echo.

REM Verifica se Python está instalado
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Erro: Python não encontrado
    echo    Instale em: https://www.python.org/downloads/
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

REM Executa o script de inicialização
echo 🚀 Iniciando sistema...
echo.
python start.py

pause
