@echo off
chcp 65001 >nul
title Gestão de Tesouraria - IEAD
echo.
echo ╔══════════════════════════════════════════════════════════╗
echo ║                                                          ║
echo ║         ⛪  GESTÃO DE TESOURARIA - IEAD  ⛪              ║
echo ║                                                          ║
echo ║         Sistema de Gestão Eclesiástica Integrada         ║
echo ║                                                          ║
echo ╚══════════════════════════════════════════════════════════╝
echo.
echo Iniciando o servidor de desenvolvimento...
echo.
echo Aguarde até aparecer a mensagem:
echo   "Local: http://localhost:3000/"
echo.
echo Depois abra o navegador e acesse: http://localhost:3000
echo.
echo ──────────────────────────────────────────────────────────
echo.

REM Verificar se Node.js está instalado
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERRO] Node.js não está instalado!
    echo.
    echo Por favor, instale o Node.js antes de continuar:
    echo https://nodejs.org/
    echo.
    pause
    exit /b 1
)

REM Verificar se node_modules existe
if not exist "node_modules\" (
    echo [INFO] Instalando dependências...
    echo.
    call npm install
    echo.
)

echo [INFO] Iniciando servidor...
echo.
echo ──────────────────────────────────────────────────────────
echo.

REM Iniciar o servidor
call npm run dev

pause
