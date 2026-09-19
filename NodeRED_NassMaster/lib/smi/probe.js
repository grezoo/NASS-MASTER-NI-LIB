const net = require('net');
const SmiClient = require('./smi-client');
const { STANDARD_ISDU } = require('./smi-protocol');

// Target IP and ports to scan
const targetIp = process.argv[2] || '192.168.88.253';
const candidatePorts = process.argv[3] ? [parseInt(process.argv[3], 10)] : [5000, 49000, 50000, 4000, 59852];

console.log('====================================================');
console.log('       NASS MAGNET / SMI-TCP HARDWARE PROBE         ');
console.log('====================================================');
console.log(`Target IP: ${targetIp}`);
console.log(`Checking ports: ${candidatePorts.join(', ')}\n`);

function testTcpPort(host, port, timeoutMs = 1500) {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    let isConnected = false;

    socket.setTimeout(timeoutMs);

    socket.on('connect', () => {
      isConnected = true;
      socket.destroy();
      resolve(true);
    });

    socket.on('timeout', () => {
      socket.destroy();
      resolve(false);
    });

    socket.on('error', () => {
      resolve(false);
    });

    socket.connect(port, host);
  });
}

async function probe() {
  let openPort = null;

  for (const port of candidatePorts) {
    process.stdout.write(`[*] Testing TCP connection on ${targetIp}:${port}... `);
    const isOpen = await testTcpPort(targetIp, port);
    if (isOpen) {
      console.log('OPEN! ✓');
      openPort = port;
      break;
    } else {
      console.log('closed / unreachable');
    }
  }

  if (!openPort) {
    console.log(`\n[!] None of the candidate ports could be reached on ${targetIp}.`);
    console.log('    Possible reasons:');
    console.log('    1. The Master has a different IP address (check your network / subnet).');
    console.log('    2. Ethernet cable is not connected or PC network adapter is not in the same subnet (e.g. 192.168.88.x).');
    console.log('    3. Run: probe.js <IP> <PORT> with the actual master IP.');
    return;
  }

  console.log(`\n[+] Successfully reached Master at ${targetIp}:${openPort}`);
  console.log('[*] Initializing SMI binary handshake...');

  const client = new SmiClient({
    host: targetIp,
    port: openPort,
    timeout: 3000
  });

  try {
    await client.connect();
    console.log('    ✓ SMI TCP link established!');

    console.log('\n[*] Requesting Master Identification...');
    const masterId = await client.readMasterIdentification();
    console.log(`    ✓ Port count: ${masterId.portCount}`);
    console.log(`    ✓ Master info: ${masterId.asciiPayload || masterId.rawPayload}`);

    const portsToCheck = masterId.portCount || 4;
    for (let p = 1; p <= portsToCheck; p++) {
      console.log(`\n[*] Inspecting Port ${p}...`);
      try {
        const pStatus = await client.readPortStatus(p);
        console.log(`    - Status: isOperate=${pStatus.isOperate} (code=${pStatus.portStatus}, baud=${pStatus.baudRate})`);

        if (pStatus.isOperate) {
          console.log(`      -> Device found in OPERATE state on Port ${p}! Querying ISDU...`);
          const vName = await client.readISDU(p, STANDARD_ISDU.VENDOR_NAME, 0);
          const pName = await client.readISDU(p, STANDARD_ISDU.PRODUCT_NAME, 0);
          const sNum = await client.readISDU(p, STANDARD_ISDU.SERIAL_NUMBER, 0);
          console.log(`      Vendor:  ${vName.dataAscii || vName.dataHex}`);
          console.log(`      Product: ${pName.dataAscii || pName.dataHex}`);
          console.log(`      Serial:  ${sNum.dataAscii || sNum.dataHex}`);
        }
      } catch (err) {
        console.log(`    - Port ${p} query note: ${err.message}`);
      }
    }

    await client.disconnect();
    console.log('\n[✓] SMI probe completed successfully!');
  } catch (err) {
    console.error('\n[!] SMI communication error:', err.message);
    if (client.isConnected) await client.disconnect();
  }
}

probe();
