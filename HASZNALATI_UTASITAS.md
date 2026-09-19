# NASSMASTER SMI v3.0 – FELHASZNÁLÓI KÉZIKÖNYV ÉS HASZNÁLATI UTASÍTÁS
**Ipari 4-Portos IO-Link SCADA, EOL Tesztállomás és Automatizálási Rendszer**  
*Szerző: G.Z (@grezoo) | 2026*

---

## 📑 TARTALOMJEGYZÉK
1. [Rendszer Áttekintés & Előnyök](#1-rendszer-áttekintés)
2. [Gyorsindítás (Zero-Install)](#2-gyorsindítás-zero-install)
3. [Hardver Csatlakoztatás & Hálózat](#3-hardver-csatlakoztatás--hálózat)
4. [Kezelőfelület & Menürendszer](#4-kezelőfelület--menürendszer)
5. [Eszközvezérlés & Port Módok](#5-eszközvezérlés--port-módok)
6. [Automatikus Tápvezérlés & Vészleállítás](#6-automatikus-tápvezérlés--vészleállítás)
7. [Folyamatadatok (Process Data In / Out)](#7-folyamatadatok-process-data-in--out)
8. [ISDU Paraméterezés (Olvasás & Írás)](#8-isdu-paraméterezés-olvasás--írás)
9. [Mini PLC Szabályzó Motor](#9-mini-plc-szabályzó-motor)
10. [Diagnosztika & CSV Adatgyűjtés](#10-diagnosztika--csv-adatgyűjtés)
11. [Hibaelhárítás & GYIK](#11-hibaelhárítás--gyik)

---

## 1. Rendszer Áttekintés
A **NASSMASTER SMI** egy korszerű, közvetlen SMI-motorral felszerelt ipari SCADA szoftver, amely a 4-portos IO-Link Ethernet Masterek (Nass Magnet / TEConcept / Pepperl+Fuchs kompatibilis) kezelésére, tesztelésére és automatizálására szolgál.

### Főbb képességei:
* **Valós idejű kommunikáció:** Determinisztikus, szekvenciális pipeline architektúra zéró TCP socket kimerüléssel.
* **Azonnali hibaészlelés:** Kábelszakadás / kapcsolatvesztés érzékelése **<16 ms** alatt.
* **Automatikus táp- és motorvédelem:** A port áramtalanítása előtt automatikus leállító keretet küld a csatlakoztatott eszköznek (pl. motor, mágnesszelep).
* **Beépített Mini PLC:** Belső szabályrendszer a portok közötti logikai és analóg (P-arányos) szabályzáshoz.
* **Platformfüggetlen hozzáférés:** Bármilyen böngészőből elérhető (PC, tablet, okostelefon, csarnoki HMI).

---

## 2. Gyorsindítás (Zero-Install)
A szoftver futtatásához **nem szükséges telepítés vagy rendszergazdai (Admin) jogosultság**. Akár közvetlenül USB pendrive-ról is üzemeltethető.

### Indítási lépések:
1. Csatlakoztasd a Mastert a számítógép Ethernet portjához (vagy a helyi hálózatra).
2. Nyisd meg a szoftver mappáját: `D:\programok_kiírni\IO-LINK\NODERED`
3. Indítsd el a **`NassmasterSMI.exe`** fájlt (dupla kattintás).
4. A szoftver automatikusan:
   * Elindítja a Node.js motort rejtett háttérablakban.
   * Megjelenik a Nass logós tálcaikon a Windows értesítési területén (jobb alsó sarok).
   * Automatikusan megnyitja a kezelőfelületet a böngésződben:  
     👉 **`http://localhost:1880/ui`**

### Leállítás:
* Kattints jobb egérgombbal a tálcán lévő Nass ikonra, és válaszd a **„⏹ Leállítás”** opciót. Ez maradéktalanul leállítja az összes háttérfolyamatot.

---

## 3. Hardver Csatlakoztatás & Hálózat
* **Alapértelmezett Master IP cím:** `192.168.23.100`
* **PC javasolt fix IP címe:** `192.168.23.10` (Alhálózati maszk: `255.255.255.0`)
* **Csatlakozók:**
  * **X01 (Port 1):** M12 A-kódolású IO-Link / DI / DO
  * **X02 (Port 2):** M12 A-kódolású IO-Link / DI / DO
  * **X03 (Port 3):** M12 A-kódolású IO-Link / DI / DO
  * **X04 (Port 4):** M12 A-kódolású IO-Link / DI / DO
  * **Power (X21):** 24 V DC tápellátás
  * **Eth (X11 / X12):** 100BASE-TX Ethernet hálózat

---

## 4. Kezelőfelület & Menürendszer
A webes felület tetején vagy bal oldali menüjében a következő funkciófülek érhetők el:
1. **DASHBOARD (Áttekintő):** Mind a 4 port élő állapota, folyamatadatai, LED-ek és azonnali gyorsvezérlők.
2. **ESZKÖZVEZÉRLÉS (Device Control):** Részletes kártyás nézet portonként, üzemmódválasztó, szelepek, potméterek és ISDU szerkesztő.
3. **IODD KEZELŐ (IODD Manager):** Eszközleíró fájlok feltöltése, hozzárendelése portokhoz.
4. **MINI PLC (SCADA Logic):** Szabályok készítése az érzékelők és kimenetek automatikus összekapcsolására.
5. **DIAGNOSZTIKA & TREND:** Élő grafikus görbék (feszültség, áram, távolság) és CSV lemezre naplózás.
6. **MIMIC CANVAS:** Grafikus folyamatábra drag-and-drop elemekkel.

---

## 5. Eszközvezérlés & Port Módok
Minden portkártya tetején található egy üzemmódválasztó lenyíló menü (**Mode**):

* **`IO-Link Autostart (Power ON)`:** Normál IO-Link üzemmód. A Master automatikusan felismeri az érzékelőt/aktuátort és ciklikus adatkapcsolatot létesít vele.
* **`Digital Output (DO)`:** Szabványos 24V-os kapcsoló kimenet (Pin 4 C/Q). Egy nagy gomb jelenik meg a felületen: rákattintva azonnal kiadja a 24V-ot (HIGH), vagy lekapcsolja (LOW 0V).
* **`Digital Input (DI)`:** Szabványos 24V-os bemenet (Pin 4 C/Q vagy Pin 2). Zöld fénnyel jelzi, ha feszültség érkezik az érzékelőtől.
* **`Deactivated (Power OFF)`:** Port áramtalanítása és inaktiválása.

---

## 6. Automatikus Tápvezérlés & Vészleállítás
A rendszerbe beépítettük a gyári tesztállomások biztonsági protokollját (**Fail-Safe Stop**):

### Port kikapcsolása (Power OFF):
1. Ha a **Mode** menüben kiválasztod a **`Deactivated (Power OFF)`** pontot:
2. **Azonnali motor- és szelepvédelem:** A szoftver még a port lekapcsolása ELŐTT azonnal kiküld egy vészleállító parancsot (`[0, 0, 0, 0]`, PWM: 0%, Valve: OFF), így a motor azonnal megáll, a szelep lezár.
3. **Táp elvétele:** A Master hardveresen leveszi a tápot a portról (`PORT_POWER_OFF`), az eszköz teljesen áramtalanítva lesz.

### Port visszakapcsolása (Power ON):
* Válaszd ki a **`IO-Link Autostart (Power ON)`** opciót.
* A rendszer automatikusan visszakapcsolja a 24V tápellátást, levezényli a boot-időt, kiküldi a Wake-Up impulzust, és a kommunikáció újraindul (`DEVICE_ONLINE`).

---

## 7. Folyamatadatok (Process Data In / Out)
Az élő folyamatadatok automatikusan frissülnek a képernyőn:

* **Analóg / Numerikus értékek:** A mérnöki mértékegységekkel jelennek meg (pl. `mm`, `°C`, `bar`, `V`, `mA`, `%`).
* **Smart Connector / Motorvezérlés (Port 1):**
  * **Valve set value:** Szelepmágnes ki/be kapcsolása (kattintásra azonnal kapcsol).
  * **PWM set value (%):** 0-tól 100%-ig állítható csúszka (potméter) a motor fordulatszámának vagy a szelep áramának fokozatmentes szabályzásához.
* **Smart Hub kimenetek:** Többkimenetes modulok esetén egyenként kapcsolható kimenetek státusz-visszajelzéssel.

---

## 8. ISDU Paraméterezés (Olvasás & Írás)
Az ISDU (Indexed Service Data Unit) segítségével a csatlakoztatott eszközök belső paraméterei közvetlenül elérhetők és módosíthatók:

### Paraméter olvasása:
1. Válaszd ki a kívánt paramétert a **Selected Parameter** lenyílóból (pl. *Gyártó neve, Terméknév, Hőmérséklet, Feszültség, RGB LED szín*).
2. Kattints a zöld **`READ`** gombra.
3. A kiolvasott érték megjelenik a mezőben és a státuszsorban.

### Paraméter írása (pl. RGB LED szín módosítása):
1. Válaszd ki a módosítani kívánt paramétert (pl. *RGB LED Color switched on (Idx: 115)*).
2. A **VALUE** mezőben válaszd ki az új értéket (pl. *KÉK, PIROS, ZÖLD, SÁRGA*) vagy írd be a számot.
3. Kattints a bordó **`WRITE`** gombra.
4. Megjelenik a zöld visszajelzés: `✓ Sikeresen kiírva az eszközbe!`, és az eszköz fizikai viselkedése (pl. LED színe) azonnal megváltozik.

---

## 9. Mini PLC Szabályzó Motor
A szoftver tartalmaz egy független, valós idejű logikai vezérlőt a **MINI PLC** fül alatt:

* **Szabály létrehozása:**
  * **HA (Trigger):** Pl. Port 3 Lézer Távolság < 150 mm, VAGY Port 4 Digitális bemenet = HIGH.
  * **AKKOR (Akció):** Pl. Port 1 Szelep BE, VAGY Port 2 DO = 24V HIGH, VAGY Port 1 Motor PWM = 80%.
* **P-arányos szabályzás:** A mért távolsággal arányosan szabályozhatod a motor fordulatszámát (közeledésre lassít/gyorsít).

---

## 10. Diagnosztika & CSV Adatgyűjtés
* **Trend görbék:** A **Diagnosztika** fülön valós időben rajzolódnak ki az érzékelők görbéi 60 pontos görgetéssel.
* **Közvetlen lemezre író CSV naplózás:**
  * Kattints a **`START CSV LOG`** gombra.
  * A mérési adatok (időbélyeg, port, feszültség, távolság, ISDU értékek) közvetlenül a merevlemezre íródnak (`Logs/nassmaster_diagnostics_log.csv`).
  * Zéró RAM-terhelés: akár napokig tartó tartóstesztek esetén sem fogy el a memória.

---

## 11. Hibaelhárítás & GYIK

| Jelenség | Lehetséges ok | Megoldás |
| :--- | :--- | :--- |
| **„A port inaktív / Powered Off”** | A port `DEACTIVATED` módban van. | A fenti Mode menüben válaszd az `IO-Link Autostart (Power ON)` opciót. |
| **Nem kapcsolódik a Masterhez** | Nem megfelelő a számítógép hálózati IP címe. | Állítsd a Windows hálózati kártyádat statikus IP-re: `192.168.23.10`, maszk: `255.255.255.0`. |
| **A motor nem áll le lekapcsoláskor** | Nem lett kiadva a Stop keret. | Használd a Mode menü `Deactivated (Power OFF)` pontját, amely automatikus vészleállítást végez. |
| **„Hiba: HTTP 404 / 500” ISDU íráskor** | Olyan paramétert próbálsz írni, ami csak olvasható (Read-Only). | Ellenőrizd az IODD leírásban, hogy a paraméter írható-e (pl. a Vendor Name vagy Serial Number sosem írható). |
| **Port 4 lassabban válaszol** | A Port 4 digitális bemenet (DI) hardver módban van. | Ez természetes fizikai adottság: a master DI poll ciklusa hardveresen lassabb, mint a közvetlen IO-Link portoké. |

---

*Copyright © 2026 G.Z (@grezoo). Minden jog fenntartva.*
