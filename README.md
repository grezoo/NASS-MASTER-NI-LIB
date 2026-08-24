# NASS-MASTER-NI-LIB
Nass Magnet NI library
<img width="700" height="700" alt="image" src="https://github.com/user-attachments/assets/5173b606-dcfa-4bf9-bc9a-88cc8bd8a365" />

# IO-Link IODD Olvasó és Nass Magnet Master LabVIEW Eszköztár

Ez a tárhely egy LabVIEW-alapú fejlesztői szoftvercsomagot tartalmaz, amely lehetővé teszi az IO-Link eszközök IODD (IO Device Description) fájljainak beolvasását, valamint a **Nass Magnet Master** modulok integrációját.

A tárhely nem tartalmaz kész főprogramot (Main VI). Egy olyan **függvénykönyvtárat és alprogram-gyűjteményt (SubVIs)** biztosít, amelyet a saját LabVIEW projektjeidbe integrálhatsz fejlesztés során.

## A tárhely tartalma

*   **LabVIEW VIP Package (.vip):** A Nass Magnet Master eszközök kezeléséhez szükséges LabVIEW VIPM (VI Package Manager) telepítőfájl.
*   **Alapfájlok és Alprogramok (SubVIs):** A hardveres kommunikációhoz és adatfeldolgozáshoz elengedhetetlen, előre megírt LabVIEW alprogramok gyűjteménye.
*   **IODD Olvasó:** IO-Link konfigurációs és leíró fájlok feldolgozására szolgáló modulok.

## Rendszerkövetelmények

*   **LabVIEW 2022** (32-bit vagy 64-bit verzió)
*   **VI Package Manager (VIPM)** (a `.vip` csomag telepítéséhez)

## Telepítés és Integráció

### 1. A VIPM csomag telepítése
1. Nyisd meg a **VI Package Manager** szoftvert.
2. Nyisd meg a tárhelyben található `.vip` kiterjesztésű fájlt.
3. Kattints az **Install** gombra a Nass Magnet Master függvénykönyvtár környezetbe való telepítéséhez.

### 2. A SubVI-ok használata
1. Másold be a letöltött mappát a saját LabVIEW projektkönyvtáradba.
2. Add hozzá a mappát a LabVIEW Project Explorer-hez.
3. Húzd be a szükséges **SubVI**-okat a saját főprogramod (Main VI) blokkdiagramjára a kommunikáció felépítéséhez és az IODD adatok beolvasásához.

## Hozzájárulás
Ha hibát találsz, vagy új funkcióval bővítenéd a meglévő alprogramokat, kérjük, nyiss egy **Issue**-t vagy küldj egy **Pull Request**-et!
