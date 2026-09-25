@echo off
chcp 65001 >nul
title Criar Atalho - Tesouraria IEAD
color 0B

echo.
echo ================================================
echo   CRIAR ATALHO PERSONALIZADO
echo   Tesouraria IEAD
echo ================================================
echo.

REM Obter caminho do script atual
set "SCRIPT_DIR=%~dp0"
set "INICIAR_SCRIPT=%SCRIPT_DIR%iniciar.py"
set "SHORTCUT_NAME=Tesouraria IEAD"

REM Verificar se iniciar.py existe
if not exist "%INICIAR_SCRIPT%" (
    echo [ERRO] Arquivo iniciar.py nao encontrado!
    echo.
    pause
    exit /b 1
)

echo Criando atalho na area de trabalho...
echo.

REM Criar arquivo VBS para gerar o atalho
set "VBS_FILE=%TEMP%\criar_atalho.vbs"

(
echo Set oWS = WScript.CreateObject^("WScript.Shell"^)
echo sLinkFile = oWS.SpecialFolders^("Desktop"^) ^& "\%SHORTCUT_NAME%.lnk"
echo Set oLink = oWS.CreateShortcut^(sLinkFile^)
echo oLink.TargetPath = "pythonw.exe"
echo oLink.Arguments = """%INICIAR_SCRIPT%"""
echo oLink.WorkingDirectory = "%SCRIPT_DIR%"
echo oLink.Description = "Sistema de Gestao de Tesouraria - IEAD"
echo oLink.IconLocation = "%%SystemRoot%%\System32\Shell32.dll,176"
echo oLink.Save
) > "%VBS_FILE%"

REM Executar o script VBS
cscript //nologo "%VBS_FILE%"

REM Remover arquivo temporario
del "%VBS_FILE%"

if %errorlevel% equ 0 (
    echo.
    echo ================================================
    echo   [OK] Atalho criado com sucesso!
    echo ================================================
    echo.
    echo O atalho "%SHORTCUT_NAME%" foi criado na area de trabalho.
    echo.
    echo Para personalizar o icone:
    echo   1. Clique com o botao direito no atalho
    echo   2. Selecione "Propriedades"
    echo   3. Clique em "Alterar Icone..."
    echo   4. Escolha um icone da lista ou browse por um arquivo .ico
    echo.
) else (
    echo.
    echo [ERRO] Falha ao criar o atalho!
    echo.
)

pause
