# NASSMASTER Industrial IO-Link SCADA & Bench Tester Suite
**Official Global Release:** v2.2.1-release (Production & Demo Baseline)  
**Status:** Feature Freeze & Acceptance Verified (100% FAT/SAT Passed)  
**License:** Open Source Engineering Framework  
**Supported Hardware:** IO-Link Masters (IFM AL1350, Nass Magnet Smart Connectors & Valve Hubs, Turck, Balluff)

---

## 1. Executive Summary & Philosophy

**NassMaster** is an open-source, portable industrial SCADA suite and test bench automation platform built for IO-Link Masters and multi-vendor field devices. 

It provides an out-of-the-box, 100% verified baseline designed for:
- Live customer demonstrations,
- Factory quality assurance (QA) and RMA testing benches,
- Open-source device integration, empowering automation engineers to easily connect and program their own custom IO-Link sensors, actuators, and valve manifolds.

> **MAINTENANCE & RELEASE POLICY:**  
> This version represents the **Frozen Production Release (v2.2.1)**. All core capabilities are verified. Feature requests are frozen; future updates will strictly focus on field-collected bug fixes on a 30-to-60-day review cycle.

---

## 2. Intended Use (Scope of Application)

NassMaster is engineered and certified for the following operational scopes:
1. **Bench Tester & Verification Station (QA / RMA / End-of-Line):**
   - Rapid testing, parameterization, and quality inspection of IO-Link devices (laser distance sensors, 14-bit analog voltage/current converters, temperature transmitters, proportional valve drivers, and digital I/O blocks).
2. **Device Management & Standardized IODD Interpretation (IEC 61131-9):**
   - Universal parsing of IODD 1.0.1 and 1.1 XML packages.
   - True process data unpacking respecting standard IEC 61987 unit codes (e.g. 1012 = cm, 1013 = mm, 1240 = V, 1211 = mA).
   - ISDU (Index / Subindex) parameter read/write engine with automatic option decoding and payload validation.
3. **Shop-Floor SCADA Visualization & Diagnostics:**
   - Live network and port status monitoring (Ethernet link speed, physical LED mirror, port modes).
   - High-resolution multi-channel real-time trend visualization with configurable CSV telemetric logging.
4. **Non-Safety Auxiliary Automation (Mini PLC Engine - 500ms):**
   - Auxiliary test sequences, condition-based cooling, sorting, and diagnostic notification loops.

---

## 3. Strict Safety Exclusions & Legal Disclaimer

> ### ⚠️ WARNING: NOT INTENDED FOR LIFE-CRITICAL OR MACHINERY SAFETY FUNCTIONS!

1. **Non-Safety-Related Control System (Exclusion of SIL / PL):**
   - NassMaster is a software-level supervisory system running on portable Node-RED / REST architecture. **It does NOT possess functional safety certification under IEC 61508 / IEC 62061 (SIL 1–4) or ISO 13849-1 (PL a–e).**
   - **DO NOT** use NassMaster as a replacement for dedicated safety relays, hardware E-STOP buttons, safety light curtains, or two-hand control circuits.
   - **STRICTLY PROHIBITED** for personnel protection, medical equipment, passenger elevators, lifting equipment, power presses, stamping machines, or explosive (ATEX) atmospheres.
2. **Deterministic Response Limits:**
   - Communication operates over standard asynchronous HTTP REST / Ethernet with an average execution cycle of 500 ms. It does not provide deterministic sub-millisecond hard real-time guarantees.
3. **Safety Interlock Architecture (Manual Reset):**
   - In adherence to **ISO 13849-1** and **EN 60204-1**, the Mini PLC implements a **Trip & Manual Reset** architecture:
     - Upon source sensor disconnect (COMM_LOST / cable break), the assigned actuator is immediately de-energized (SAFE OFF / 0).
     - The rule is automatically disabled (TRIP).
     - Reconnecting the cable **NEVER** automatically restarts the machine (anti-zombie restart protection). A conscious, manual operator reset is mandatory.

---

## 4. Standards Compliance Matrix

| Standard / Directive | Scope & Technical Implementation |
| :--- | :--- |
| **IEC 61131-9** | Single-drop digital communication interface for small sensors and actuators (IO-Link v1.0 & v1.1 protocol specification). |
| **IEC 61987** | Industrial-process measurement and control – Standardized data structures and engineering unit codes (cm, mm, V, mA, °C, bar). |
| **EN ISO 13849-1** | Safety of machinery – Safety-related parts of control systems (Manual reset and fault isolation principles). |
| **EN 60204-1** | Electrical equipment of machines – Protection against unexpected restart following power or sensor restoration. |
| **2006/42/EC** | EU Machinery Directive – Non-safety component disclaimer (Annex IV non-applicability). |

---

## 5. Quick Start (Portable Deployment)

1. **Launch:**
   - Windows: Double-click start_portable_windows.bat.
   - Linux / Raspberry Pi: Execute ./start_portable_linux.sh.
2. **Access Interfaces:**
   - **Operator SCADA Dashboard:** http://localhost:1880/ui
   - **Node-RED Engineering Canvas:** http://localhost:1880
   - **Automated FAT/SAT Acceptance Suite:** http://localhost:8888
3. **Configuration:**
   - Set the master IP directly on the dashboard (default: 192.168.23.100).
   - Dynamic port switching (IO-Link, Digital Output 24V, Digital Input, Deactivated) operates on-the-fly without master reboot.

---
*NassMaster SCADA Platform © 2026. Released under the Open Engineering License.*
