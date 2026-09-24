@echo off
chcp 65001 >nul
title ⛪ Gestão de Tesouraria - IEAD
color 0B

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║                                                            ║
echo ║           ⛪  GESTÃO DE TESOURARIA - IEAD  ⛪              ║
echo ║                                                            ║
echo ║         Sistema de Gestão Eclesiástica Integrada           ║
echo ║                                                            ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo Iniciando o aplicativo...
echo.

REM Verificar se Python está disponível
python --version >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [OK] Python encontrado. Iniciando servidor local...
    echo.
    echo O aplicativo será aberto automaticamente no navegador.
    echo Para fechar, pressione Ctrl+C nesta janela.
    echo.
    echo ────────────────────────────────────────────────────────
    echo.
    
    REM Abrir navegador após 2 segundos
    start "" cmd /c "timeout /t 2 /nobreak >nul && start http://localhost:8080"
    
    REM Iniciar servidor Python na pasta dist
    cd dist
    python -m http.server 8080
    goto :eof
)

REM Verificar se Python3 está disponível
python3 --version >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [OK] Python3 encontrado. Iniciando servidor local...
    echo.
    echo O aplicativo será aberto automaticamente no navegador.
    echo Para fechar, pressione Ctrl+C nesta janela.
    echo.
    echo ────────────────────────────────────────────────────────
    echo.
    
    REM Abrir navegador após 2 segundos
    start "" cmd /c "timeout /t 2 /nobreak >nul && start http://localhost:8080"
    
    REM Iniciar servidor Python na pasta dist
    cd dist
    python3 -m http.server 8080
    goto :eof
)

REM Se não encontrou Python, mostrar instruções
echo.
echo [ERRO] Python não encontrado!
echo.
echo ════════════════════════════════════════════════════════════
echo.
echo Para usar este aplicativo, você precisa instalar o Python.
echo.
echo PASSO 1: Baixe o Python em:
echo          https://python.org/downloads/
echo.
echo PASSO 2: Instale o Python (marque a opção "Add Python to PATH")
echo.
echo PASSO 3: Reinicie o computador
echo.
echo PASSO 4: Execute este arquivo (ABRIR.bat) novamente
echo.
echo ════════════════════════════════════════════════════════════
echo.
echo Ou, se preferir, abra o arquivo INICIO.html no navegador
echo para ver instruções detalhadas.
echo.
pause
