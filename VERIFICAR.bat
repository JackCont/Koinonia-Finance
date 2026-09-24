@echo off
echo.
echo ================================================
echo   VERIFICACAO DO SISTEMA
echo ================================================
echo.

REM Verificar Python
echo [1/4] Verificando Python...
python --version >nul 2>&1
if %errorlevel% equ 0 (
    echo       OK - Python encontrado
    python --version
) else (
    echo       ERRO - Python nao encontrado!
    echo       Instale em: https://python.org
    goto :erro
)
echo.

REM Verificar pasta dist
echo [2/4] Verificando pasta dist...
if exist "dist\index.html" (
    echo       OK - Pasta dist encontrada
) else (
    echo       ERRO - Pasta dist nao encontrada!
    echo       Execute: npm run build
    goto :erro
)
echo.

REM Verificar iniciar.py
echo [3/4] Verificando iniciar.py...
if exist "iniciar.py" (
    echo       OK - iniciar.py encontrado
) else (
    echo       ERRO - iniciar.py nao encontrado!
    goto :erro
)
echo.

REM Verificar porta 8080
echo [4/4] Verificando porta 8080...
netstat -ano | findstr :8080 >nul 2>&1
if %errorlevel% equ 0 (
    echo       AVISO - Porta 8080 ja esta em uso!
    echo       Feche outros programas ou edite iniciar.py
    echo       para usar outra porta.
) else (
    echo       OK - Porta 8080 disponivel
)
echo.

echo ================================================
echo   VERIFICACAO CONCLUIDA COM SUCESSO!
echo ================================================
echo.
echo Agora execute: INICIAR.bat
echo.
pause
goto :fim

:erro
echo.
echo ================================================
echo   VERIFICACAO FALHOU!
echo ================================================
echo.
pause

:fim
