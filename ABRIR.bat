@echo off
title Tesouraria IEAD

echo.
echo ================================================
echo    TESOURARIA IEAD - Iniciando...
echo ================================================
echo.

REM Check if Python is available
python --version >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [OK] Python found. Starting local server...
    echo.
    echo The app will open automatically in your browser.
    echo To stop: close this window or press Ctrl+C
    echo.
    echo ------------------------------------------------
    echo.
    
    REM Open browser after 2 seconds
    start "" cmd /c "timeout /t 2 /nobreak >nul && start http://localhost:8080"
    
    REM Start server in dist folder
    cd dist
    python -m http.server 8080
    goto :eof
)

REM Check if Python3 is available
python3 --version >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [OK] Python3 found. Starting local server...
    echo.
    echo The app will open automatically in your browser.
    echo To stop: close this window or press Ctrl+C
    echo.
    echo ------------------------------------------------
    echo.
    
    REM Open browser after 2 seconds
    start "" cmd /c "timeout /t 2 /nobreak >nul && start http://localhost:8080"
    
    REM Start server in dist folder
    cd dist
    python3 -m http.server 8080
    goto :eof
)

REM If Python not found, show instructions
echo.
echo [ERROR] Python not found!
echo.
echo ================================================
echo.
echo To use this app, you need to install Python.
echo.
echo STEP 1: Download Python from:
echo         https://python.org/downloads/
echo.
echo STEP 2: Install Python (check "Add Python to PATH")
echo.
echo STEP 3: Restart your computer
echo.
echo STEP 4: Run this file (ABRIR.bat) again
echo.
echo ================================================
echo.
pause
