# NASS-MASTER-NI-LIB & SCADA Mini PLC Platform

Ez a tárhely a **Nass Magnet Hungária Kft.** IO-Link Master rendszereihez készült fejlesztői könyvtárakat, valamint a teljes értékű **NASSMASTER SCADA & Mini PLC Webes Környezetet (Node-RED)** tartalmazza.

---

## 📑 A tárhely tartalma

### 1. 🌐 Node-RED SCADA & Mini PLC Platform (`NodeRED_NassMaster/`)
* **`flows.json`**: A teljes SCADA felület, dinamikus IODD motor, valós idejű többcsatornás trendgrafikon és a 64-bites Bit-Packing Mini PLC logikai vezérlő.
* **`start_nassmaster.bat`**: Egykattintásos indító parancsfájl a hordozható (pendrive) környezethez.
* **`IODD/`**: Teljes IODD könyvtár (Nass Magnet Smart Valve Driver Hub, Smart Connector A & B, ifm távadók, Balluff, Norgren stb.).
* **`FAT_SAT_TEST_PROTOCOL.md`**: Részletes 81-pontos gyári átadási és elfogadási tesztjegyzőkönyv (minden tesztpont: PASS).

### 2. 🔌 LabVIEW NI Függvénykönyvtár (`Root / SubVIs`)
* **LabVIEW VIP Package (`.vip`)**: Nass Magnet Master VIPM (VI Package Manager) telepítőcsomag.
* **SubVIs**: Előre megírt, moduláris LabVIEW alprogramok (Port konfigurációk, ISDU olvasás/írás, Process Data kicsomagolás, LED státusz lekérdezés).
* **IODD_V1.1.3_Checker**: Futtatható IODD ellenőrző segédprogram.

---

## 🚀 Főbb SCADA & PLC Képességek (Design Freeze v1.0)

1. **Dinamikus IODD Motor:**
   * XML és ZIP csomagok azonnali kliensoldali feldolgozása.
   * Automatikus típuskonverzió (Integer, Float, Boolean, String, Enum).
   * Teljes körű mérnöki skálázás és mértékegység feloldás (`°C`, `bar`, `mA`, `V`, `%`).

2. **Mini PLC Logikai Szabályozó & 64-bites Bit-Packing:**
   * Determinisztikus 500 ms ciklusidejű szabálymotor.
   * **64-bites többcsatornás bit-packing:** az egyes szelepek/csatornák (X01..X04) kapcsolásakor megőrzi a többi kimenet állapotát.
   * Szinkronizált THEN / ELSE beavatkozási ágak fizikai szelep le- és bekapcsolással, PWM szabályozással és ISDU írással.
   * Interaktív JSON exportálás és szabály-kijelölő importálás.

3. **Diagnosztika & Valós Idejű Trend:**
   * Kifejtett alindex-szintű ISDU mérés és megjelenítés.
   * 60 pontos élő HTML5 Canvas görberajzolás dinamikus Y-tengely skálázással.
   * **Zero-RAM közvetlen lemezre írás:** CSV naplózás közvetlenül a pendrive `Projects/NASSMASTER/Logs/` mappájába.

---

## 🛠️ Gyors Indítás (Node-RED SCADA)

1. Indítsd el a rendszert a `start_nassmaster.bat` futtatásával.
2. Nyisd meg a böngésződben: **`http://localhost:1880/ui`**
3. Csatlakoztasd az IO-Link Mastert a `192.168.23.100` címen.

---

## 🔧 Rendszerkövetelmények (LabVIEW)

* **LabVIEW 2022** (32-bit vagy 64-bit verzió)
* **VI Package Manager (VIPM)** a `.vip` csomag telepítéséhez

---

## 📄 Licenc
MIT License. Copyright (c) 2026 nass magnet Hungária Kft. / grezoo.
