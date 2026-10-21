@echo off
chcp 65001 >nul
title Koinonia Finance - Servidor Local

echo ========================================================================
echo   🏦 KOINONIA FINANCE - Gestão Financeira para Igrejas Evangélicas
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

REM Verifica se a pasta dist existe
if not exist "dist\index.html" (
    echo 🏗️  Buildando frontend...
    call npm run build
    if %errorlevel% neq 0 (
        echo ❌ Erro ao buildar o frontend
        pause
        exit /b 1
    )
    echo ✅ Frontend buildado com sucesso
    echo.
)

REM Inicia o servidor Python
echo 🚀 Iniciando servidor na porta 3000...
echo 📡 Acesse: http://localhost:3000
echo 💾 Dados salvos em: data.json
echo 🛑 Pressione Ctrl+C para parar
echo.
python server.py

REM Se o script Python falhar, mostra mensagem de erro
if %errorlevel% neq 0 (
    echo.
    echo ❌ Erro ao iniciar o servidor
    pause
)
