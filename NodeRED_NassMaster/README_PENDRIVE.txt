================================================================================
   NASSMASTER INDUSTRIAL IO-LINK SCADA & BENCH TESTER - PORTABLE SUITE
================================================================================
Release: v2.2.1-release (Production & Demo Baseline)
Date:    September 12, 2026
License: Open Source Engineering License

This directory contains the complete, self-contained portable Node-RED runtime
for industrial IO-Link Masters (e.g., IFM AL1350, Nass Magnet Smart Connectors &
Valves, Turck, Balluff) and auxiliary Mini PLC control (500ms cycle).

PACKAGE CONTENTS:
-----------------
1. flows.json               - Multi-module industrial flow definition (SCADA Dashboard,
                              Device Control, IODD Parser, Diagnostics & Mini PLC).
2. settings.js              - Portable configuration (Port 1880, isolated local context).
3. package.json             - Runtime package definitions (Node-RED, Dashboard, Dependencies).
4. start_portable_windows.bat - 1-Click launcher for Windows environments.
5. start_portable_linux.sh    - 1-Click launcher for Linux / Raspberry Pi / macOS.
6. IODD/                    - Built-in vendor IODD XML packages and ZIP archives.
7. Logs/                    - Automated CSV telemetric diagnostics and PLC event logs.
8. README.md                - Full technical specification, compliance and safety disclaimers.

HOW TO RUN FROM USB PENDRIVE:
-----------------------------
1. Copy this entire folder to any USB drive or local hard drive.
2. Launch:
   - Windows: Double-click 'start_portable_windows.bat'.
   - Linux / Raspberry Pi: Run './start_portable_linux.sh'.
3. Open in any modern web browser:
   - SCADA Supervisory Dashboard: http://localhost:1880/ui
   - Node-RED Flow Editor:        http://localhost:1880
   - Automated FAT/SAT Suite:     http://localhost:8888
4. Enter the IO-Link Master IP on the dashboard (default: 192.168.23.100).

SAFETY & COMPLIANCE NOTICE (ISO 13849-1 / EN 60204-1):
------------------------------------------------------
This software is strictly intended for test benches, QA/RMA verification, and
non-safety auxiliary sequencing. It is NOT certified for life-critical safety
circuits (SIL/PL). Sensor disconnects enforce an immediate actuator TRIP to SAFE OFF,
with Manual Reset required before reactivation.

================================================================================
NassMaster SCADA Platform © 2026
================================================================================
