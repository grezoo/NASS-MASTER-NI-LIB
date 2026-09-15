# 🏭 NASS-MASTER-NI-LIB (Nass Magnet Industrial SCADA & IO-Link Suite)

**Official Repository for Nass Magnet IO-Link Control, SCADA Mimic, Mini PLC, Multilingual Global Suite, and National Instruments LabVIEW Integration.**

[![Release](https://img.shields.io/badge/Release-v2.2.0--global-gold.svg)](https://github.com/grezoo/NASS-MASTER-NI-LIB/releases/tag/v2.2.0-global)
[![Stable Release](https://img.shields.io/badge/Release-v2.1.0--stable-magenta.svg)](https://github.com/grezoo/NASS-MASTER-NI-LIB/releases/tag/v2.1.0-stable)
[![Architecture](https://img.shields.io/badge/Architecture-3--Tier%20Modular-blue.svg)](#modulok)
[![Languages](https://img.shields.io/badge/Languages-HU%20%7C%20EN%20%7C%20DE%20%7C%20FR%20%7C%20ZH%20%7C%20HI-brightgreen.svg)](#nyelvi-szótár-global-edition)
[![Platform](https://img.shields.io/badge/Platform-Windows%20%7C%20Air--Gapped%20Offline-green.svg)](#telepítésmentes-futtatás)
[![Standard](https://img.shields.io/badge/IO--Link-IEC%2061131--9%20V1.1.3-orange.svg)](#főbb-képességek--funkciók)

---

## 🏛️ A Projekt Moduljai

A tároló 3 szigorúan elhatárolt, önálló ipari modulból épül fel:

```
NASS-MASTER-NI-LIB/
├── 📁 NodeRED_NassMaster/        # NassMaster 2.2 Global SCADA, Folyamatábra & Mini PLC Rendszer
│   ├── NassMaster.exe          # 100% Hordozható Zero-Install Asztali Indító (Nass Magnet Ikonnal)
│   ├── start_nassmaster.bat    # Parancssori hordozható batch indító
│   ├── flows.json              # Teljes SCADA, Mini PLC & IODD motor (Offline JSZip, 64-bit Bitpacking, Global Footers)
│   ├── nass_logo.ico / .png    # Hivatalos Nass Magnet arculati elemek
│   ├── FAT_SAT_TEST_PROTOCOL.md # FAT/SAT Átadás-Átvételi Tesztjegyzőkönyv
│   ├── 📁 Data/                # Perzisztens konfigurációk és nyelvi szótárak
│   │   └── languages.json      # 6-Nyelvű Vállalati Szótár (HU, EN, DE, FR, ZH, HI)
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

## 🌍 Nyelvi Szótár (Global Edition)

A rendszer tartalmazza a nyílt, ember által szerkeszthető **`NodeRED_NassMaster/Data/languages.json`** szótárfájlt, amely támogatja az alábbi 6 nyelvet:
* 🇭🇺 **HU (Magyar)** - Hivatalos ipari terminológia
* 🇬🇧 **EN (English)** - International industrial standard
* 🇩🇪 **DE (Deutsch)** - Deutsche Industrieausgabe
* 🇫🇷 **FR (Français)** - Version industrielle française
* 🇨🇳 **ZH (中文 - Simplified Chinese)** - Ázsiai piac & Easter Egg
* 🇮🇳 **HI (हिन्दी - Hindi)** - Indiai kirendeltség & Easter Egg

A szótár bármikor szerkeszthető egy sima szövegszerkesztővel (Jegyzettömb, VS Code, Excel/CSV), így az értékesítők és termékmenedzserek a programkód érintése nélkül szabhatják testre a terminológiát.

---

## 🚀 Főbb Képességek & Funkciók

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

---

## 📜 Hivatalos Kiadások & Verziótörténet

* **v3.0.0-smi (2026-09-16)** — *`branch: smi-v3.0`*
  * **SMI Wrapper v3.0 – Pipeline Serialization & Optimistic Cache:**
    * Minden HTTP kérés szigorúan szekvenciálisan hajtódik végre (`Promise` sor), megszüntetve a socket-kimerülést és a 1,2 s `COMM_LOST` késleltetést.
    * 60 ms olvasási cache-ablak + 600 ms DO-írás utáni zárolás a `readProcessData`-ban (zéró felesleges újraolvasás).
    * Optimista cache-írás a `writeProcessData`-ban: a DO állapota azonnal tükröződik az UI-ban, mielőtt a nyugtázás megérkezne.
  * **DO Pattogás-Mentesítő (Debounce) az UI-ban:**
    * `doLock` objektum és 800 ms timeout a `toggleDo(p)` függvénybe (Device Control fül).
    * `sync_ports` és `state_update` szekciók figyelik a zárolást; pattogásmentes, stabil kapcsolást biztosítanak.
  * **Mért Teljesítmény-Benchmark** (192.168.23.100, REST API port 80):
    → Lásd a ⚡ Teljesítmény szekciót lent.
* **v2.2.0-global (2026-09-10):**
  * Hivatalos **Multilingual Global Edition Release**.
  * 6-nyelvű nyitott szótárstruktúra (`Data/languages.json`) bevezetése (HU, EN, DE, FR, ZH, HI).
  * Minden SCADA felületi panelen egységes, ipari **NASSMASTER Global Version v2.2.0** lábléc sáv (100% Offline Air-Gapped jelzéssel).
* **v2.1.0-stable (2026-09-10):**
  * Hivatalos jóváhagyott vállalati koncepció-kiadás (Enterprise Release).
  * Teljesen dinamikus IODD PWM skálázás és Arányos P-szabályzás a Mini PLC-ben.
  * Drag-isolation és 0 ms `localStorage` állapotmegőrzés a SCADA Mimic vásznon.
  * Beágyazott offline JSZip és 4-portos 1000 PWM biztonsági kivezérlés.
* **v2.0.0 (2026-09-01):** Grafikus SCADA Folyamatábra (Visual Process Mimic) és beépített ipari SVG géptár bevezetése.
* **v1.0.0 (2026-08-31):** Alap SCADA felület, 4-portos eszközvezérlés, FAT/SAT tesztjegyzőkönyv és LabVIEW könyvtár integráció.

---

## ⚡ Teljesítmény-Benchmark (SMI v3.0 – `smi-v3.0` branch)

A mérések a **NASS Magnet 4P ETH Master** (`192.168.23.100`) ellen futottak, Windows 11 gazdagépen, `node.js` HTTP klienssel (`process.hrtime()` nano-szekundumos felbontással).

| Teszt | Iterációk | Átlag | Min | Max |
|-------|-----------|-------|-----|-----|
| Egyedi Process Data lekérdezés (Port 1) | 30× | **10,88 ms** | 4,68 ms | 88,16 ms |
| Teljes 4-portos ciklus (port1–4 szekvenciálisan) | 20× | **41,20 ms** | 19,82 ms | 144,29 ms |
| Teljes újracsatlakozás-szinkron (`syncAll`: Ident + Config + Ports + PD1–4) | 15× | **26,38 ms** | 22,99 ms | 34,93 ms |
| DO írás (C/Q 4-es érintkező, `cqValue` toggle) | 20× (10 pár) | **4,04 ms** | 2,91 ms | 5,78 ms |

### Architekturális változások hatása

| Területek | Régi (NASSMASTER_SMI v1) | Új (SMI v3.0) |
|-----------|--------------------------|----------------|
| HTTP kérések sorrendje | Párhuzamos (4 egyidejű socket) | **Szekvenciális pipeline** (0 socket-kimerülés) |
| `COMM_LOST` felismerés | ~1200 ms fix timeout | **< 35 ms** (első sikertelen válasz) |
| DO kapcsoló-pattogás | 200–800 ms billegés | **0 ms** (800 ms UI lock + 600 ms cache-zár) |
| Process Data cache | Nincs | **60 ms ablak** (felesleges lekérdezések ≈ 0) |
| Teljes szinkron idő | ~350 ms (4× párhuzamos + poll ütközés) | **26,38 ms** átlag |

> **Megjegyzés:** Az IO-Link master REST API inherensen szekvenciális. A párhuzamos kérések socket-foglalás-ütközést okoznak, ami 1–5× lassabb választ és "connection reset" hibákat eredményez. A v3.0 pipeline ezt teljesen kiküszöböli.

---

**Copyright © 2026 nass magnet Hungária Kft. Minden jog fenntartva.**

