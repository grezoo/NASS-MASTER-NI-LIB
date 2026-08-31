# NASS-MASTER-NI-LIB & SCADA Mini PLC Platform

Ez a tárhely a **Nass Magnet Hungária Kft.** IO-Link Master rendszereihez készült fejlesztői könyvtárakat, valamint a teljes értékű **NASSMASTER SCADA & Mini PLC Webes Környezetet és az Önálló IODD Parser Eszköztárat (Node-RED)** tartalmazza.

---

## 📑 A tárhely felépítése (3 Különálló Modul)

```text
grezoo/NASS-MASTER-NI-LIB/
├── 📁 NodeRED_NassMaster/          <-- 1. FŐ SCADA & MINI PLC RENDSZER (PENDRIVE VERZIÓ)
│   ├── 📁 IODD/                   (Gyári IODD csomagok: Nass Hub, Connectors, ifm, Balluff...)
│   ├── flows.json                 (A teljes letesztelt SCADA & Mini PLC logika)
│   ├── start_nassmaster.bat       (Egykattintásos indító parancsfájl a pendrive-hoz)
│   ├── settings.js                (Runtime konfiguráció)
│   └── FAT_SAT_TEST_PROTOCOL.md   (81-pontos gyári átadási tesztjegyzőkönyv: PASS)
│
├── 📁 NodeRED_Standalone_Parser/   <-- 2. ÖNÁLLÓ IODD PARSER & SÉMAGENERÁLÓ MODUL
│   ├── flows.json                 (Önálló IODD ZIP/XML feltöltő és feldolgozó motor)
│   ├── parser_start.bat           (Egykattintásos indító a Parser projekthez)
│   ├── package.json               (Csomagfüggőségek)
│   └── settings.js                (Parser környezeti beállítások)
│
├── 📁 NI_LabVIEW_Library/          <-- 3. NATIONAL INSTRUMENTS LABVIEW ESZKÖZTÁR
│   ├── *.vi                       (SubVI-ok: Config, Reset, Counter, JSON to Temp/Volt/Current stb.)
│   ├── *.vip, *.vipb              (VIPM telepítőcsomagok v1.0.0.6 - v1.0.0.9)
│   └── IODD_V1.1.3_Checker.exe    (Különálló IODD ellenőrző)
│
├── .gitignore
├── LICENSE
└── README.md                      (Ez a leírás)
```

---

## 🚀 Főbb Képességek

### 1. 🌐 NASSMASTER SCADA & Mini PLC (`NodeRED_NassMaster/`)
* **Dinamikus IODD Motor:** Valós idejű XML/ZIP kibontás, skálázás, mértékegységek (`°C`, `bar`, `mA`, `V`, `%`).
* **Mini PLC Logikai Szabályozó:** Determinisztikus 500 ms ciklusidő, **64-bites Bit-Packing**, szinkronizált THEN / ELSE szelepműködtetés, PWM állítás és interaktív JSON import/export.
* **Diagnosztika & Valós Idejű Trend:** 60-pontos HTML5 Canvas görberajzolás és **Zero-RAM közvetlen lemezre írás** a pendrive `Projects/NASSMASTER/Logs/` mappájába.
* **Indítás:** `start_nassmaster.bat` &rarr; Böngésző: `http://localhost:1880/ui`

### 2. 📦 Standalone IODD Parser (`NodeRED_Standalone_Parser/`)
* Dedikált tesztelő és IODD XML & ZIP struktúra-elemző munkaállomás.
* **Indítás:** `parser_start.bat` &rarr; Böngésző: `http://localhost:1880/ui`

### 3. 🔌 LabVIEW NI Függvénykönyvtár (`NI_LabVIEW_Library/`)
* Előre megírt, moduláris LabVIEW alprogramok és VIPM csomagok National Instruments rendszerekhez.

---

## 📄 Licenc
MIT License. Copyright (c) 2026 nass magnet Hungária Kft. / grezoo.
