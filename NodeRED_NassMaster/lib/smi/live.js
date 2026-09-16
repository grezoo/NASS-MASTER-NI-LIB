const http = require('http');

function getJson(path) {
  return new Promise((resolve) => {
    http.get({ hostname: '192.168.23.100', port: 80, path }, (res) => {
      let b = '';
      res.on('data', c => b += c);
      res.on('end', () => {
        try { resolve(JSON.parse(b)); } catch(e) { resolve(null); }
      });
    }).on('error', () => resolve(null));
  });
}

async function liveMonitor() {
  console.log('=== ÉLŐ MÉRÉSI STREAM (12 másodperc) ===');
  console.log('Tedd a kezed a lézer elé (Port 3) / kapcsold a digitális bemenetet (Port 4)!\n');

  const start = Date.now();
  let count = 0;

  while (Date.now() - start < 12000) {
    count++;
    const [p3, p4] = await Promise.all([
      getJson('/iolink/v1/devices/master1port3/processdata/value?format=byteArray'),
      getJson('/iolink/v1/devices/master1port4/processdata/value')
    ]);

    let laserVal = 'N/A';
    let rawHex = 'N/A';
    let out1 = 'N/A';
    if (p3 && p3.getData && p3.getData.ioLink && p3.getData.ioLink.value) {
      const bytes = p3.getData.ioLink.value;
      const raw = (bytes[0] << 8) | bytes[1];
      rawHex = '0x' + Buffer.from(bytes).toString('hex');
      // In O5D150:
      // bit 0 = OUT1
      // bit 1 = OUT2
      // bits 2..15 = distance (raw >> 2 or raw >> 1)
      out1 = (raw & 0x01) === 1 ? 'AKTÍV' : 'inaktív';
      laserVal = raw >> 2; // Scaled distance value
    }

    const diVal = (p4 && p4.getData && typeof p4.getData.cqValue !== 'undefined') ? (p4.getData.cqValue ? 'HIGH (24V)' : 'LOW (0V)') : 'N/A';

    const now = new Date().toLocaleTimeString();
    console.log(`[${now}] #${String(count).padStart(2, '0')} | Lézer: ${laserVal} (nyers: ${rawHex}, OUT1: ${out1}) | DI Port 4: ${diVal}`);

    await new Promise(r => setTimeout(r, 400));
  }
  console.log('\n=== ÉLŐ MONITOROZÁS VÉGE ===');
}

liveMonitor();
