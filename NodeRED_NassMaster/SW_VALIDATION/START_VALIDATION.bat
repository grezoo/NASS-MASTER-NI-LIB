@echo off
title NASSMASTER FAT/SAT VALIDATION ENGINE
color 0C
echo ======================================================================
echo           NASSMASTER PLC FLOW - FAT/SAT VALIDATION WIZARD
echo ======================================================================
echo.
echo [1/2] Inditas: Python HTTP & Benchmark Motor (Port: 8888)...
echo.

cd /d "%~dp0"

start "" http://localhost:8888

python server.py

pause
