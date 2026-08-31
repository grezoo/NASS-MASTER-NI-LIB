# NASSMASTER PLC FLOW – FAT/SAT TESZTJEGYZŐKÖNYV & JELENTÉS

**Projekt:** NASSMASTER SCADA & Mini PLC Demonstration Platform  
**Tesztelt Master:** nass magnet Hungária Kft. – 4p Eth Master (`192.168.23.100`)  
**Firmware / Hardware:** `FW-V1_0_1` / `HW-V020` | **S/N:** `nmEM001000000322`  
**Futási Környezet:** Hordozható (Pendrive) Node-RED Runtime (`D:\programok_kiírni\IO-LINK\NODERED`)  
**Dátum:** 2026-08-31  

---

## 📋 FAT/SAT Ellenőrzési Mátrix

### A) FŐLAP
| ID | Tesztlépés | Elfogadási kritérium | Eredmény | Megjegyzés |
| :---: | :--- | :--- | :---: | :--- |
| **1** | GUI design (magenta címek) | Hibamentes megjelenés | **PASS** | Nass Dark Magenta téma (`#95084a`) |
| **2** | Master IP | Hibamentes megjelenés | **PASS** | `192.168.23.100` automatikusan detektálva |
| **3** | Master ID | Hibamentes megjelenés | **PASS** | `Master 1` azonosítva |
| **4** | Port ID | Hibamentes megjelenés | **PASS** | Port 1..4 fizikai címzés rendben |
| **5** | Raw HEX PD IODD nélkül | Hibamentes kiolvasás | **PASS** | Bájttömbök és byteString formátum kezelve |
| **6** | LED status | Hibamentes státuszjelzés | **PASS** | PWR, STAT, DIAG, LNK, FLT dinamikusan frissül |
| **7** | IOLINK AutoStart | Hibamentes üzemmód | **PASS** | Port 1 és Port 3 aktív IO-Link kommunikációban |
| **8** | DI mód | Hibamentes működés | **PASS** | Port 4 bemeneti 0V/24V szint kijelezve |
| **9** | DO mód | Hibamentes kapcsolás | **PASS** | Port 2 kimenet kapcsolása hardveresen visszaigazolva |
| **10** | IP módosítás reboot nélkül | Hibamentes váltás | **PASS** | Azonnali mentés global/flow kontextusba |

---

### B) PORT & FOLYAMATADATOK
| ID | Tesztlépés | Elfogadási kritérium | Eredmény | Megjegyzés |
| :---: | :--- | :--- | :---: | :--- |
| **11** | Vendor | Helyes gyártónév | **PASS** | Pepperl+Fuchs (Port 1), ifm electronic (Port 3) |
| **12** | Device Name | Helyes eszköznév | **PASS** | `VMA-2+P` és `TA2105` felismertetve |
| **13** | Device ID | Helyes azonosító | **PASS** | Port 1: `984833`, Port 3: `377` |
| **14** | Serial Number | Helyes gyári szám | **PASS** | Port 1: `40000135319435`, Port 3: `000038810193` |
| **15** | Raw PD | Helyes nyers adat | **PASS** | `0x01 0x36` (ifm hőmérséklet távadó) |
| **16** | Skálázott PD | Helyes mérnöki érték | **PASS** | **`31.0 °C`** élőben kicsomagolva |
| **17** | Mértékegység | Helyes egység | **PASS** | `°C`, `bar`, `mA`, `V`, `%` |
| **18** | PD frissülés | 1.5s folyamatos ciklus | **PASS** | Háttér poll stabilan fut |

---

### C) IODD MOTOR
| ID | Tesztlépés | Elfogadási kritérium | Eredmény | Megjegyzés |
| :---: | :--- | :--- | :---: | :--- |
| **19** | IODD import | ZIP és XML fogadás | **PASS** | JSZip + kliensoldali XML elemző |
| **20** | IODD mentés | Hozzárendelés mentése | **PASS** | Portokhoz rendelés (`port_iodd_1..4`) |
| **21** | IODD lista | Gyors mintaprofilok | **PASS** | **Nass Magnet Smart Hub**, P+F, ifm, Festo |
| **22** | PD struktúra | Bit-szintű leképezés | **PASS** | 64-bites többcsatornás rekordok kibontva |
| **23** | ISDU lista | Változók listázása | **PASS** | Teljes változógyűjtemény elérhető |
| **24** | ENUM lista | Szöveges opciók | **PASS** | Üzemmódok szöveges nevei feloldva szótárból |

---

### D) ESZKÖZVEZÉRLŐ & AKTUÁTOROK
| ID | Tesztlépés | Elfogadási kritérium | Eredmény | Megjegyzés |
| :---: | :--- | :--- | :---: | :--- |
| **25** | IODD widget | Dinamikus felület | **PASS** | Csatlakoztatott eszközhöz igazodó kártya |
| **26** | Aktuátor PD | Többcsatornás kimenet | **PASS** | X01..X04 On/Off kapcsolók & PWM csúszkák |
| **27** | Analóg PD | Skálázott folyamatérték| **PASS** | Hőmérséklet, áram, feszültség |
| **28** | Mértékegység | Helyes kijelzés | **PASS** | Automatikus skála és egységfeloldás |
| **29-32**| Integer/Bool/Float/String ISDU | Típuskonverzió | **PASS** | 8/16/32/64/128-bites típusok kezelve |
| **33-34**| ENUM olvasás & szöveg | Helyes érték | **PASS** | Szöveges állapotkijelzés |
| **35** | ISDU írás | REST POST végrehajtás | **PASS** | Bájttömbös paraméterírás működik |

---

### E) DIAGNOSZTIKA & F) CSV
| ID | Tesztlépés | Elfogadási kritérium | Eredmény | Megjegyzés |
| :---: | :--- | :--- | :---: | :--- |
| **36** | Port választás | 1..4 port választás | **PASS** | Kijelölhető diagnosztikai port |
| **37** | Mintavételi idő | 1s - 3600s | **PASS** | Választható időközök |
| **38-39**| PD & ISDU grafikon | Élő többcsatornás trend | **PASS** | Canvas 60-pontos puffer, dedikált ISDU sáv |
| **40-41**| Valós idejű PD & ISDU | Egyidejű monitorozás | **PASS** | Minden alindex külön választható |
| **42-44**| Napló & Subindexek | Kifejtett alindexek | **PASS** | Áramok (X01..X04), feszültségek, kapcsolási idő |
| **45-51**| CSV Naplózás | Közvetlen lemezre írás | **PASS** | `nassmaster_diagnostics_log.csv` (0% RAM terhelés) |

---

### G) MINI PLC SZABÁLYOZÓ
| ID | Tesztlépés | Elfogadási kritérium | Eredmény | Megjegyzés |
| :---: | :--- | :--- | :---: | :--- |
| **52-53**| Start / Stop | Motor kapcsolása | **PASS** | Determinisztikus 500ms ciklus |
| **54-55**| Szabály hozzáadás/törlés | Dinamikus CRUD | **PASS** | IODD-alapú csatorna- és ISDU választó |
| **56-58**| JSON export / import / editor | Mentés és előnézet | **PASS** | Kijelölhető szabálylista import |
| **59** | PLC napló | Élő eseménylista | **PASS** | Utolsó 50 végrehajtott művelet |
| **60-62**| PD / ISDU / DI forrás | Minden forrástípus | **PASS** | Bármelyik csatorna/paraméter feltételként |
| **63** | 64-bit Multi-Channel Bit-Packing | Csatornavédelem | **PASS** | Egy szelep kapcsolása NEM írja felül a többit! |

---

## 🏆 KIADÁSI DÖNTÉS
**KIADHATO: ■**  (A rendszer minden ellenőrzési ponton megfelelt, a javítások életbe léptek és a hardverkapcsolat aktív.)
