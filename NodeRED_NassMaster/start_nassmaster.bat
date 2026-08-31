@echo off
REM ============================================================
REM PROJECT:     NASSMASTER
REM VERSION:     v1.3.2 (HEALTH-CHECKED ASYNC LAUNCH)
REM DESCRIPTION: Portable IO-Link Demonstration Platform
REM ============================================================

COLOR 0A
SETLOCAL Enabledelayedexpansion

TITLE NASSMASTER IO-Link Demonstration Platform v1.3.2

echo ============================================================
echo          NASSMASTER PORTABLE INITIALIZATION START            
echo ============================================================
echo System Date: %DATE% - Time: %TIME%
echo.

SET "ROOT_DIR=%~dp0"
IF "%ROOT_DIR:~-1%"=="\" SET "ROOT_DIR=%ROOT_DIR:~0,-1%"

SET "PROJECT_DIR=%ROOT_DIR%\Projects\NASSMASTER"
SET "LOGS_DIR=%PROJECT_DIR%\Logs"
SET "DATA_DIR=%PROJECT_DIR%\Data"
SET "CONFIG_DIR=%PROJECT_DIR%\Config"
SET "IODD_DIR=%PROJECT_DIR%\IODD"
SET "TARGET_FLOW_FILE=%PROJECT_DIR%\flows.json"

echo [INFO] Gyoker mappa:    %ROOT_DIR%
echo [INFO] Projekt mappa:    %PROJECT_DIR%
echo.

echo [INFO] Hatterfolyamatok es beragadt portok takaritasa...
taskkill /f /im node.exe >nul 2>&1
echo [OK] Node.exe instances cleared.
echo.

echo [INFO] Projekt konyvtarak ellenorzese es letrehozasa...
IF NOT EXIST "%PROJECT_DIR%" mkdir "%PROJECT_DIR%"
IF NOT EXIST "%LOGS_DIR%"    mkdir "%LOGS_DIR%"
IF NOT EXIST "%DATA_DIR%"    mkdir "%DATA_DIR%"
IF NOT EXIST "%CONFIG_DIR%"  mkdir "%CONFIG_DIR%"
IF NOT EXIST "%IODD_DIR%"    mkdir "%IODD_DIR%"
echo [OK] Directory structure verified.
echo.

cd /d "%ROOT_DIR%"
echo [INFO] Node modulok ellenorzese (jszip)...
IF NOT EXIST "%ROOT_DIR%\node_modules\jszip" (
    echo [WARN] jszip hianyzik. Automatikus telepites...
    call npm install jszip --no-audit --no-fund
) else (
    echo [OK] jszip rendben.
)
echo.

echo [INFO] flows.json kozvetlen betoltese aktiv (Nincs feluliras).
echo [INFO] PowerShell policy beallitasa...
powershell -ExecutionPolicy Bypass -Command "Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process -Force" >nul 2>&1

SET "NODE_RED_USER_DIR=%PROJECT_DIR%"
SET "LOCAL_NODE_RED_CLI=%ROOT_DIR%\node_modules\node-red\red.js"

echo.
echo ============================================================
echo          LAUNCHING NASSMASTER RUNTIME ENGINE (ASYNC)       
echo ============================================================
echo.

:: Node-RED inditasa hatterfolyamatként, a logok maradnak ebben az ablakban
start /b node "%LOCAL_NODE_RED_CLI%" --userDir "%NODE_RED_USER_DIR%" --port 1880 --title "NASSMASTER Runtime"

echo [INFO] Vrakozas a Node-RED szerver valaszara (Port 1880)...

:WAIT_SERVER
timeout /t 1 /nobreak >nul
powershell -Command "try { $socket = New-Object System.Net.Sockets.TcpClient('localhost', 1880); $socket.Close(); exit 0 } catch { exit 1 }" >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    goto WAIT_SERVER
)

echo [SUCCESS] Szerver elindult es elerheto!
echo [INFO] Bongeszo inditasa: http://localhost:1880/ui
start "" "http://localhost:1880/ui"

echo.
echo ============================================================
echo           SYSTEM RUNNING. PRESS ANY KEY TO STOP.             
echo ============================================================
echo.

pause >nul
taskkill /f /im node.exe >nul 2>&1

ENDLOCAL