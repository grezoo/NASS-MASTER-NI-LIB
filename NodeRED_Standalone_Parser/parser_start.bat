@echo off
setlocal enabledelayedexpansion

:: ============================================================================
:: NASS MAGNET IODD PARSER - HORDOZHATÓ (PENDRIVE) INDÍTÓ
:: ============================================================================
title NASS IODD Parser Engine (Node-RED)
color 0B

set "ROOT_DIR=%~dp0"
if "%ROOT_DIR:~-1%"=="\" set "ROOT_DIR=%ROOT_DIR:~0,-1%"

set "NODE_EXE=%ROOT_DIR%\node.exe"
set "NODE_RED_CLI=%ROOT_DIR%\node_modules\node-red\red.js"
set "PARSER_USER_DIR=%ROOT_DIR%\Projects\PARSER"
set "PORT=1880"
set "DASHBOARD_URL=http://localhost:%PORT%/ui"

cls
echo ============================================================================
echo   NASS MAGNET - STANDALONE IODD PARSER ENGINE
echo   Hordozhato Pendrive Kornyezet
echo ============================================================================
echo.
echo [INFO] Mappa: %ROOT_DIR%
echo [INFO] Node.js Runtime: %NODE_EXE%
echo [INFO] Projekt: %PARSER_USER_DIR%
echo [INFO] Web Felulet: %DASHBOARD_URL%
echo.

:: 1. Node.exe ellenőrzése
if not exist "%NODE_EXE%" (
    echo [HIBA] A helyi node.exe nem talalhato: "%NODE_EXE%"
    echo Kilepeshez nyomj meg egy billentyut...
    pause >nul
    exit /b 1
)

:: 2. Node-RED CLI ellenőrzése
if not exist "%NODE_RED_CLI%" (
    echo [HIBA] A Node-RED red.js nem talalhato: "%NODE_RED_CLI%"
    echo Kilepeshez nyomj meg egy billentyut...
    pause >nul
    exit /b 1
)

:: 3. Korábbi folyamatok leállítása az 1880-as portról
echo [INFO] Port %PORT% ellenorzese es takaritasa...
powershell -NoProfile -Command "Get-Process node -ErrorAction SilentlyContinue | Where-Object { $_.Path -like '*%ROOT_DIR%*' } | Stop-Process -Force -ErrorAction SilentlyContinue" >nul 2>&1

:: 4. Böngésző automatikus megnyitása a háttérben
echo [INFO] Bongeszo megnyitasa: %DASHBOARD_URL%
start "" "%DASHBOARD_URL%"

echo.
echo ============================================================================
echo   A PARSER SZERVER ELINDULT! A FELULET A BONGESZODBEN MEGNYILT.
echo   A LEALLITASHOZ ZARD BE EZT AZ ABLAKOT VAGY NYOMJ CTRL+C-T.
echo ============================================================================
echo.

:: 5. Node-RED indítása a PARSER projekttel
"%NODE_EXE%" "%NODE_RED_CLI%" --userDir "%PARSER_USER_DIR%" --port %PORT% --title "NASS IODD Parser Engine"

pause
