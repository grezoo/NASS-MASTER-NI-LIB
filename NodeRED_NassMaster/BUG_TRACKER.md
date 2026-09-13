# NassMaster SCADA - Issue & Bug Tracker (10-Batch Rule)

Ez a nyilvántartó az apróbb hibák, szépséghibák és finomhangolások gyűjtőhelye.
A fejlesztési alapszabály értelmében **nem végzünk egyenkénti mikro-commitokat**. 
Amikor a nyitott tételek száma eléri a **10-et** (vagy kritikus blokkoló hiba lép fel), egy menetben ülünk le javítani, és egyetlen tiszta `fix: maintenance pack` mérföldkővel zárjuk le a köteget.

---

## 📋 Nyitott Tételek (Gyűjtő)

| # | Modul | Leírás / Megfigyelés | Prioritás | Státusz |
|---|-------|----------------------|-----------|---------|
| 1 | - | *(Jelenleg minden ismert hiba javítva és tesztelve)* | - | ÜRES |

---

## ✅ Lezárt Csomagok (Fix Packs)

### Fix Pack v2.3.0 (2026-09-13)
- [x] ANSI/ISA-101.01 display rate limiting (1.0s stream) és háttér-renderelés kikapcsolása
- [x] IEC 61131-3 RAM alapú ciklikus telemetria (disk I/O és OOM crash eliminálva)
- [x] SCADA Mimikán közvetlen aktuátor kapcsolás és 0-100% PWM csúszka
- [x] Mini PLC arányos átskálázás (`PROPORTIONAL` PWM szabály)
- [x] Slider 0-érték tartomány hiba (0..100 és 0..1000‰ intelligens IODD detektálás)
- [x] Hordozható Linux / Raspberry Pi futtatókörnyezet (`start_nassmaster_linux.sh`)
- [x] Tömör, nemzetközi SCADA állapotjelzés (`ONLINE` / `SYNCING...`) másodperces óra nélkül
- [x] Natív böngészős CSV mentés (`Save As...` letöltésablak és UTF-8 BOM Excel támogatás)
- [x] Relatív pendrive naplózás (`Logs/nassmaster_diagnostics_log.csv`)
- [x] Diagnosztikai vezérlősáv hajszálpontos rácsba igazítása (38px egységes magasságok)
