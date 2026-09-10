# 🏭 NASS-MASTER-NI-LIB (Nass Magnet Industrial SCADA & IO-Link Suite)

**Official Repository for Nass Magnet IO-Link Control, SCADA Mimic, Mini PLC, and National Instruments LabVIEW Integration.**

[![Release](https://img.shields.io/badge/Release-v2.1.0--stable-magenta.svg)](https://github.com/grezoo/NASS-MASTER-NI-LIB/releases)
[![Architecture](https://img.shields.io/badge/Architecture-3--Tier%20Modular-blue.svg)](#modulok)
[![Platform](https://img.shields.io/badge/Platform-Windows%20%7C%20Air--Gapped%20Offline-green.svg)](#telepítésmentes-futtatás)
[![Standard](https://img.shields.io/badge/IO--Link-IEC%2061131--9%20V1.1.3-orange.svg)](#funkciók)

---

## 🏛️ A Projekt Moduljai

A tároló 3 szigorúan elhatárolt, önálló ipari modulból épül fel:

```
NASS-MASTER-NI-LIB/
├── 📁 NodeRED_NassMaster/        # NassMaster 2.1 SCADA, Folyamatábra & Mini PLC Rendszer
│   ├── NassMaster.exe          # 100% Hordozható Zero-Install Asztali Indító (Nass Magnet Ikonnal)
│   ├── start_nassmaster.bat    # Parancssori hordozható batch indító
│   ├── flows.json              # Teljes SCADA, Mini PLC & IODD motor (Offline JSZip, 64-bit Bitpacking)
│   ├── nass_logo.ico / .png    # Hivatalos Nass Magnet arculati elemek
│   ├── FAT_SAT_TEST_PROTOCOL.md # FAT/SAT Átadás-Átvételi Tesztjegyzőkönyv
│   └── 📁 IODD/                # Gyári IODD csomagok (Nass Magnet Smart Hub, Connector, ifm, Balluff)
│
├── 📁 NodeRED_Standalone_Parser/ # Dedikált IODD Elemző & Adatkinyerő Modul
│   ├── parser_start.bat        # Önálló parser batch indító
│   ├── flows.json              # Független IODD konvertáló és XML flattener motor
│   └── package.json            # Függőségek és konfiguráció
│
└── 📁 NI_LabVIEW_Library/        # National Instruments LabVIEW VI Könyvtárak & VIP Csomagok
    ├── *.vip / *.vipb          # VIPM (VI Package Manager) telepítőcsomagok
    ├── *.vi                    # LabVIEW blokkdiagramok (Query, Switch, PWM, Power, Status)
    └── IODD_V1.1.3_Checker.exe  # Hivatalos IODD konformitás ellenőrző szoftver
```

---

## 🚀 Főbb Képességek & Funkciók (v2.1.0 Stable)

1. **🏭 Grafikus SCADA Folyamatábra (Visual Process Mimic Canvas):**
   * Drag-and-drop szerkesztőfelület beépített vektoros ipari géptárral (Nass szelep, szállítószalag, daráló, tartály, távadók, végálláskapcsolók, munkahengerek).
   * **`🎛️ Dinamikus Potméter / PWM Csúszka`:** Egérrel valós időben tekerhető analóg kimenetvezérlő.
   * **Egyedi képfeltöltés:** Bármilyen gépfotó, P&ID rajz vagy alaprajz behúzható a pendrive-ról.
   * **3-Szintű Auto-Save (0 ms fülváltás):** `localStorage` azonnali állapotmegőrzés és csendes JSON fájlmentés.

2. **⚡ Mini PLC Logikai Szabályzó Motor:**
   * 500 ms valós idejű ciklusidő, 64 bites többcsatornás Bit-Packing (IEC 61131-9 szabvány).
   * **Zéró Hardcode Dinamikus IODD Észlelés:** Automatikus átváltás diszkrét (BE/KI) és több-bites numerikus (PWM) vezérlés között.
   * **Fix Értékadás & Arányos P-Skálázás:** Bemeneti mért értékek arányos transzformálása a kimeneti PWM tartományra.
   * Szabályok exportálása/importálása és élő eseménynaplózás.

3. **📊 Valós Idejű Diagnosztika & Hardvervédelem:**
   * 60 pontos HTML5 Canvas trendgörbe automatikus Y-skála illesztéssel.
   * **Zéró RAM terhelésű közvetlen CSV naplózás:** `Projects/NASSMASTER/Logs/nassmaster_diagnostics_log.csv`.
   * **4-Portos Nass Hub PWM védelem:** 1000 (100.0%) alapértelmezett kivezérlés a prototípus NYÁK megbízható meghúzásához.

4. **🔒 100% Air-Gapped Offline Működés:**
   * Beágyazott helyi `JSZip` motor (zéró Cloudflare / CDN függőség).
   * Teljesen elzárt gyári hálózatokon is azonnali IODD ZIP kibontás és futtatás.

---

## 💻 Telepítésmentes Futtatás (Zero-Install & 0 Admin Rights)

A szoftver nem igényel semmilyen telepítést vagy rendszergazdai jóváhagyást:

1. Másold át a mappát bármilyen **USB pendrive-ra**.
2. Csatlakoztasd a Mastert (alapértelmezett IP: `192.168.23.100`).
3. Duplán kattints a **`NassMaster.exe`** fájlra.
4. Az alkalmazás **önálló, letisztult asztali SCADA ablakban** indul el, háttérbe rejtett Node.js motorral és tálcaikonnal.

---

## 📜 Verziótörténet

* **v2.1.0-stable (2026-09-10):**
  * Hivatalos jóváhagyott vállalati koncepció-kiadás (Enterprise Release).
  * Teljesen dinamikus IODD PWM skálázás és Arányos P-szabályzás a Mini PLC-ben.
  * Drag-isolation és 0 ms `localStorage` állapotmegőrzés a SCADA Mimic vásznon.
  * Beágyazott offline JSZip és 4-portos 1000 PWM biztonsági kivezérlés.
* **v2.0.0 (2026-09-01):** Grafikus SCADA Folyamatábra (Visual Process Mimic) és beépített ipari SVG géptár bevezetése.
* **v1.0.0 (2026-08-31):** Alap SCADA felület, 4-portos eszközvezérlés, FAT/SAT tesztjegyzőkönyv és LabVIEW könyvtár integráció.

---

**Copyright © 2026 nass magnet Hungária Kft. Minden jog fenntartva.**
