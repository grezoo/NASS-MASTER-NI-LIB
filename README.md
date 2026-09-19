# 🏭 NASS-MASTER-NI-LIB (Nass Magnet Industrial SCADA & IO-Link Suite)

**Official Repository for Nass Magnet IO-Link Control, SCADA Mimic, Mini PLC, Multilingual Global Suite, and National Instruments LabVIEW Integration.**

[![Release](https://img.shields.io/badge/Release-v2.2.0--global-gold.svg)](https://github.com/grezoo/NASS-MASTER-NI-LIB/releases/tag/v2.2.0-global)
[![Stable Release](https://img.shields.io/badge/Release-v2.1.0--stable-magenta.svg)](https://github.com/grezoo/NASS-MASTER-NI-LIB/releases/tag/v2.1.0-stable)
[![Architecture](https://img.shields.io/badge/Architecture-3--Tier%20Modular-blue.svg)](#modulok)
[![Languages](https://img.shields.io/badge/Languages-HU%20%7C%20EN%20%7C%20DE%20%7C%20FR%20%7C%20ZH%20%7C%20HI-brightgreen.svg)](#nyelvi-szótár-global-edition)
[![Platform](https://img.shields.io/badge/Platform-Windows%20%7C%20Air--Gapped%20Offline-green.svg)](#telepítésmentes-futtatás)
[![Standard](https://img.shields.io/badge/IO--Link-IEC%2061131--9%20V1.1.3-orange.svg)](#főbb-képességek--funkciók)
[![Revolut Donate](https://img.shields.io/badge/Revolut-Donate%20%40grezoo-0075eb.svg?style=for-the-badge&logo=revolut&logoColor=white)](https://revolut.me/grezoo)
[![Support @grezoo](https://img.shields.io/badge/Support%20Author-%40grezoo-ff69b4.svg?style=for-the-badge&logo=githubsponsors&logoColor=white)](https://github.com/sponsors/grezoo)

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

## 🚀 Ajánlott: SMI v3.0 – Következő Generációs Kommunikációs Réteg

> **Az IO-Link Master REST API alapú lekérdezést a `smi-v3.0` ág egy gyorsabb, stabilabb és bounce-mentes megoldással váltja fel.**
>
> 👉 **[Tekintsd meg az SMI v3.0 ágat és a teljes benchmark eredményeket](https://github.com/grezoo/NASS-MASTER-NI-LIB/tree/smi-v3.0)**

### Mit javít az SMI v3.0 a jelenlegi NASSMASTER-hez képest?

Valós mérés: NASS Magnet 4P ETH Master (`192.168.23.100`), N=30 iteráció/teszt.

| Terület | NASSMASTER (main) | SMI v3.0 | Eredmény |
|---------|:-----------------:|:--------:|:--------:|
| Startup poll max spike | 128–182 ms | <25 ms | ✅ 5–7× stabilabb |
| **COMM_LOST felismerés** | **1200 ms** (hardcoded) | **<22 ms** | ✅ **54× gyorsabb** |
| **DO kapcsoló pattogás** | **200–800 ms** billegés | **0 ms** (lock) | ✅ **Eliminált** |
| Socket kimerülés | Igen (N párhuzamos) | Nem (1 sor) | ✅ Eliminált |
| PD cache | Nincs | 60 ms ablak | ✅ Új funkció |
| Startup fal-idő (avg) | 8,0 ms | 19,8 ms | ⚠️ +12 ms overhead |
| DO write latencia | 3,7 ms | 3,8 ms | ≈ azonos |

> ⚠️ Az SMI szekvenciális pipeline fallideje valamivel hosszabb, de **spike-mentes és determinisztikus** – ami ipari rendszerekben (flicker-mentes UI, azonnali disconnect detekció) az elsődleges követelmény.

### 🥊 Gyári TEConcept IO-Link Control Tool vs. NassMaster SMI

| Szempont | Gyári TEConcept Control Tool | NassMaster SMI (A mi szoftverünk) |
| :--- | :--- | :--- |
| **Felület és élmény (UX)** | 🪟 **Klasszikus 2010-es évekbeli Windows WPF ablak** (szürke fülek, rejtett almenük, nehézkes áttekinthetőség, apró betűk). | 🚀 **Modern Ipari Dark-Theme SCADA & Web UI** (egy képernyőn mind a 4 port élőben, trendgörbék, közvetlen potméter, azonnali láthatóság). |
| **Elérhetőség & Hálózat** | 💻 **Csak a helyi PC-n futó .exe**, kizárólag arról a Windows gépről kezelhető, amire telepítve van. | 🌐 **Webes kliens-szerver architektúra**: tabletről, telefonról, csarnoki panel PC-ről, böngészőből bárhonnan elérhető a helyi hálózaton. |
| **Automatizálás & PLC logika** | ❌ **NINCS**. Csak kézi tesztelő eszköz. Nem tud automatikus logikát futtatni (pl. ha a lézer < 100 mm, akkor kapcsold a szelepet). | ⚡ **Beépített Mini PLC szabályzó motor** (500 ms valós idejű ciklus, automatikus szabályok, P-arányos PWM skálázás). |
| **Folyamatábra (SCADA Mimic)** | ❌ **NINCS**. Csak szöveges/táblázatos mérnöki diagnosztikai nézet. | 🏭 **Visual Process Mimic Canvas** (drag-and-drop ipari géprajzok, tartályok, szalagok, egyedi P&ID fotók). |
| **Port Táp és Lekapcsolás** | ⚠️ **Kétlépcsős, kézi procedúra**: Inactive mód kiválasztása, majd külön "Power Off" kapcsoló, majd Apply nyugtázó gomb. | 🛡️ **100% Automatikus Fail-Safe**: a Mode menüben `Deactivated`-re váltasz -> automatikusan kiküldi a Stop keretet a motornak, és lekapcsolja a tápot! |
| **Adatnaplózás (Logging)** | ⚠️ Csak belső STCS naplók, külön külső plugin kell a plotoláshoz. | 📊 **Zéró RAM terhelésű közvetlen CSV naplózás** + 60 pontos élő HTML5 Canvas trendgörbe automatikus skálázással. |
| **Hordozhatóság (Portability)** | ❌ Telepítést igényel (MSI / Program Files, helyi STCS bridge, Windows regisztrációs függőségek). | 💼 **100% Zero-Install Hordozható**: pendrive-ról egy kattintással indul a `NassmasterSMI.exe`-vel, admin jogok nélkül. |
| **Protokoll & Architektúra** | 🔌 **STCS_P_WIN.exe bridge + TCP 50000**: lokális segédfolyamatot indít a háttérben, azon keresztül forgalmaz. | ⚡ **Közvetlen Pure Node.js SMI / REST Engine**: nincs szükség külső STCS bridge-re, natívan és determinisztikusan kommunikál a Masterrel. |
| **Nyelvkezelés** | 🇬🇧 Csak angol / német. | 🌍 **6-Nyelvű Vállalati Szótár** (HU, EN, DE, FR, ZH, HI) a gépkezelők és operátorok anyanyelvén. |

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

## ⚡ Teljesítmény-Benchmark (NASSMASTER régi vs SMI v3.0)

Valós mérés: **NASS Magnet 4P ETH Master** (`192.168.23.100`), Windows 11, Node.js `http` modul, `process.hrtime()` nano-sec felbontás, N=30 iteráció/teszt.

### [1] Főoldali startup lekérdezések (5 endpoint)

| Endpoint | NASSMASTER avg | NASSMASTER max | SMI v3.0 avg |
|----------|---------------|---------------|--------------|
| GW Identification | 17,5 ms | 128,3 ms | 3,9 ms |
| GW Configuration | 3,8 ms | 5,2 ms | 3,8 ms |
| Master Identification | ~4 ms | ~6 ms | ~4 ms |
| Ports Configuration | 3,5 ms | 6,0 ms | 3,5 ms |
| GW LED State | 3,5 ms | 4,8 ms | 3,6 ms |
| **Teljes (5× párhuzamos → szekvenciális fal-idő)** | **8,0 ms** | 9,5 ms | **19,8 ms** |

> ℹ️ A párhuzamos hívás fallideje rövidebb (8 ms) – de a szerver oldalon socket-verseny és burst-terhelés keletkezik, ami a **max értékek** robbanásában látszik (128 ms). Az SMI szekvenciális módszer stabilan, spike nélkül dolgozik.

### [2] Dynamic poll lekérdezések (1,5 s-onként)

| Endpoint | NASSMASTER avg | NASSMASTER max | SMI v3.0 avg |
|----------|---------------|---------------|--------------|
| GW Ethernet State | 23,1 ms | 182,3 ms | 14,3 ms |
| Ports Status | 8,9 ms | 129,3 ms | 4,4 ms |
| LED State | 3,6 ms | 5,6 ms | 3,6 ms |
| **Teljes (3× párhuzamos → szekvenciális)** | **6,3 ms** | 8,1 ms | **11,3 ms** |

### [3] Process Data – mind a 4 port

| Port | NASSMASTER avg | NASSMASTER max | SMI v3.0 avg |
|------|---------------|---------------|--------------|
| Port 1 – Smart Connector | 4,2 ms | 5,7 ms | 4,3 ms |
| Port 2 – DO/MASI | 3,6 ms | 5,1 ms | 3,6 ms |
| Port 3 – Lézer | 4,2 ms | 5,8 ms | 4,3 ms |
| Port 4 – Lézer | 14,0 ms | 90,9 ms | 11,7 ms |
| **Teljes ciklus (párhuzamos Promise.all)** | **13,7 ms** | 134,2 ms | – |
| **Teljes ciklus (SMI szekvenciális)** | – | – | **17,8 ms** |

### [4] Digitális kimenet (DO) írás

| Módszer | avg | min | max |
|---------|-----|-----|-----|
| NASSMASTER `{cqValue: bool}` | 3,7 ms | 2,9 ms | 5,6 ms |
| SMI v3.0 `{setData:{cqValue: bool}}` | 3,8 ms | 2,9 ms | 5,5 ms |

### Összefoglaló – Mit nyertünk valójában?

| Terület | NASSMASTER (régi) | SMI v3.0 (új) | Eredmény |
|---------|------------------|----------------|---------|
| Startup fal-idő | 8,0 ms (párhuzamos) | 19,8 ms (szekvenciális) | ⚠️ Régi gyorsabb fal-időn |
| **Max spike (crash-kockázat)** | **128–182 ms** spikes | **<25 ms** stabil | ✅ **SMI 5–7× stabilabb** |
| **COMM_LOST felismerés** | **1200 ms** (hardcoded) | **<22 ms** (1 ciklus) | ✅ **54× gyorsabb** |
| **DO pattogás (jitter)** | **200–800 ms** billegés | **0 ms** (800 ms lock) | ✅ **Eliminált** |
| **Socket kimerülés** | Igen (N párhuzamos burst) | Nem (1 sor) | ✅ **Eliminált** |
| **PD cache** | Nincs | 60 ms ablak | ✅ **Új funkció** |
| DO write latencia | 3,7 ms | 3,8 ms | ≈ azonos |
| PD ciklus fal-idő | 13,7 ms | 17,8 ms | ⚠️ +4 ms overhead |

> **Következtetés:** A párhuzamos módszer átlagban gyorsabb, de **nem determinisztikus** – a max értékek 10–20× nagyobbak. Az SMI v3.0 **stabil, spike-mentes** működést biztosít azonos terhelésen, ami ipari rendszerekben (zéró flicker UI, azonnali disconnect detekció, bounce-mentes DO) kritikus követelmény.

---

## 🥊 Gyári TEConcept IO-Link Control Tool vs. NassMaster SMI

| Szempont | Gyári TEConcept Control Tool | NassMaster SMI (A mi szoftverünk) |
| :--- | :--- | :--- |
| **Felület és élmény (UX)** | 🪟 **Klasszikus 2010-es évekbeli Windows WPF ablak** (szürke fülek, rejtett almenük, nehézkes áttekinthetőség, apró betűk). | 🚀 **Modern Ipari Dark-Theme SCADA & Web UI** (egy képernyőn mind a 4 port élőben, trendgörbék, közvetlen potméter, azonnali láthatóság). |
| **Elérhetőség & Hálózat** | 💻 **Csak a helyi PC-n futó .exe**, kizárólag arról a Windows gépről kezelhető, amire telepítve van. | 🌐 **Webes kliens-szerver architektúra**: tabletről, telefonról, csarnoki panel PC-ről, böngészőből bárhonnan elérhető a helyi hálózaton. |
| **Automatizálás & PLC logika** | ❌ **NINCS**. Csak kézi tesztelő eszköz. Nem tud automatikus logikát futtatni (pl. ha a lézer < 100 mm, akkor kapcsold a szelepet). | ⚡ **Beépített Mini PLC szabályzó motor** (500 ms valós idejű ciklus, automatikus szabályok, P-arányos PWM skálázás). |
| **Folyamatábra (SCADA Mimic)** | ❌ **NINCS**. Csak szöveges/táblázatos mérnöki diagnosztikai nézet. | 🏭 **Visual Process Mimic Canvas** (drag-and-drop ipari géprajzok, tartályok, szalagok, egyedi P&ID fotók). |
| **Port Táp és Lekapcsolás** | ⚠️ **Kétlépcsős, kézi procedúra**: Inactive mód kiválasztása, majd külön "Power Off" kapcsoló, majd Apply nyugtázó gomb. | 🛡️ **100% Automatikus Fail-Safe**: a Mode menüben `Deactivated`-re váltasz -> automatikusan kiküldi a Stop keretet a motornak, és lekapcsolja a tápot! |
| **Adatnaplózás (Logging)** | ⚠️ Csak belső STCS naplók, külön külső plugin kell a plotoláshoz. | 📊 **Zéró RAM terhelésű közvetlen CSV naplózás** + 60 pontos élő HTML5 Canvas trendgörbe automatikus skálázással. |
| **Hordozhatóság (Portability)** | ❌ Telepítést igényel (MSI / Program Files, helyi STCS bridge, Windows regisztrációs függőségek). | 💼 **100% Zero-Install Hordozható**: pendrive-ról egy kattintással indul a `NassmasterSMI.exe`-vel, admin jogok nélkül. |
| **Protokoll & Architektúra** | 🔌 **STCS_P_WIN.exe bridge + TCP 50000**: lokális segédfolyamatot indít a háttérben, azon keresztül forgalmaz. | ⚡ **Közvetlen Pure Node.js SMI / REST Engine**: nincs szükség külső STCS bridge-re, natívan és determinisztikusan kommunikál a Masterrel. |
| **Nyelvkezelés** | 🇬🇧 Csak angol / német. | 🌍 **6-Nyelvű Vállalati Szótár** (HU, EN, DE, FR, ZH, HI) a gépkezelők és operátorok anyanyelvén. |

---

## ☕ Támogatás / Support the Author (@grezoo)

Ha a projekt, a SCADA felület, az SMI modul vagy a LabVIEW könyvtárak munkát és időt spóroltak neked, vagy csak értékeled az önálló ipari fejlesztést, támogasd a szerzőt közvetlenül:

* 💳 **Revolut (Revtag):** [@grezoo](https://revolut.me/grezoo) — Közvetlen küldés: [revolut.me/grezoo](https://revolut.me/grezoo)
* 💖 **GitHub Sponsors:** [@grezoo](https://github.com/sponsors/grezoo)

---

**Copyright © 2026 G.Z (@grezoo). Minden jog fenntartva. / All rights reserved.**

