# NassMaster SCADA - Issue & Bug Tracker (10-Batch Rule)

Ez a nyilvántartó az apróbb hibák, szépséghibák és finomhangolások gyűjtőhelye.
A fejlesztési alapszabály értelmében **nem végzünk egyenkénti mikro-commitokat**. 
Amikor a nyitott tételek száma eléri a **10-et** (vagy kritikus blokkoló hiba lép fel), egy menetben ülünk le javítani, és egyetlen tiszta `fix: maintenance pack` mérföldkővel zárjuk le a köteget.

---

## 📋 Nyitott Tételek (Gyűjtő - Következő Fix Pack cél)

| # | Modul | Leírás / Megfigyelés | Prioritás | Státusz |
|---|-------|----------------------|-----------|---------|
| - | - | *Jelenleg nincs nyitott tétel. Minden korábbi tétel lezárva a Fix Pack v2.3.1-ben.* | - | 🟢 TISZTA |

---

## ✅ Lezárt Csomagok (Fix Packs)

### Fix Pack v2.3.1 (2026-09-13)
* **Kiadás oka:** 10-es köteg elérve (10/10 tétel sikeresen tesztelve és élesítve).
* **Főbb területek:**
  1. **SCADA Mimika:** Egyedi Kép (`CUSTOM_IMG`) feltöltés: natív `FileReader` motor + kliensoldali tömörítő a WS hurok ellen.
  2. **HMI Fejléc:** Fejléc verziójelvény szinkronizálva a hivatalos release-zel: `GLOBAL v2.2.0` -> `GLOBAL v2.3.0`.
  3. **i18n Motor:** Dinamikus `/api/languages` közvetlen lemezről olvasó végpont, azonnali érvényesülés lemezszerkesztéskor.
  4. **Teljes HMI Téma ("Total Blue Purge"):** Minden kék színkód (#38bdf8, #0284c7, navy, slate) kiirtva a UI template-ekből és globális stílusból; tiszta Nass grafit (#121211, #181817) és Nass Magenta (#95084a) / Pink (#f472b6).
  5. **Node-RED Dashboard Keret:** Kék natív csoportfejlécek (#00A4DE, #4FBAE4) felülírva a globális LESS-ben és CSS-ben Nass Pinkre.
  6. **HMI Háttér & Téma:** Semleges sötét grafit és mély keretek (#2d2d2c) minden csoportban és az oldalsávban.
  7. **Tipográfia & Ikonok:** Fehér menüfeliratok (#ffffff), robusztus FontAwesome ikonok (`fa-line-chart`, `fa-sliders`, `fa-sitemap`), aktív fül rózsaszín sávval.
  8. **SCADA Mimika Tartály:** Dinamikus folyadékszint kitöltés (HEX, mérnöki `"6 cm"`, %, float), SVG clip-path kontúrvédelem és szintjelző osztások.
  9. **HMI Oldalsáv & Menü:** Menü Flexbox elrendezés helyreállítva (nincs levágott szöveg), ékezetes fülek javítva (`ESZKÖZ VEZÉRLÉS`).
  10. **Gyári Portok, Menüsebesség & Görgetősáv:** 
      - Chromium native dark select + 250ms observer debounce (nulla fehér villanás, nulla CPU-fagyás).
      - Duplikált ISDU egységek (`[V] [V]`) javítva.
      - Port üzemmódok és kártyák IEC 61131-9 gyári angol szabványra egységesítve (`IO-Link Autostart`, `Digital Input`, `Digital Output`, `Deactivated`, `Status`, `Vendor`, `Device`, `S/N`).
      - Portkártyák kivéve a DOM fordítóból.
      - Mini PLC relációs operátorok letisztítva (`>`, `>=`, `<`, `<=`, `==`, `!=`) és univerzális `ON (24V)` / `OFF (0V)` értékek.
      - Diagnosztika fül kettős görgetősávja megszüntetve (`height: 0` és `overflow: visible`).

### Fix Pack v2.3.0 (2026-09-13)
* **Kiadás oka:** 10-es köteg elérve (10/10 tétel javítva és validálva).
* **Lezárt tételek:** Lásd korábbi git log (cec79f5).
