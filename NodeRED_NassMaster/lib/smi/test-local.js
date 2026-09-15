const SmiMockServer = require('./smi-mock');
const SmiClient = require('./smi-client');
const { STANDARD_ISDU } = require('./smi-protocol');

async function runVerification() {
  console.log('====================================================');
  console.log('  NASS MAGNET / SMI-TCP LOCAL PROTOCOL VERIFICATION ');
  console.log('====================================================\n');

  const TEST_PORT = 49123;
  const mockServer = new SmiMockServer(TEST_PORT);

  console.log(`[1] Starting Local SMI Mock Server on port ${TEST_PORT}...`);
  await mockServer.start();
  console.log('    ✓ Mock Server listening.');

  const client = new SmiClient({
    host: '127.0.0.1',
    port: TEST_PORT,
    timeout: 1000
  });

  console.log('\n[2] Connecting SmiClient...');
  await client.connect();
  console.log('    ✓ Connected via TCP socket (NoDelay enabled).');

  console.log('\n[3] Querying Master Identification (SM_MasterIdentification)...');
  const masterId = await client.readMasterIdentification();
  console.log(`    ✓ Master Port Count: ${masterId.portCount}`);
  console.log(`    ✓ Master Identity:   ${masterId.asciiPayload}`);

  console.log('\n[4] Querying Port 1 & Port 2 Status...');
  const port1Status = await client.readPortStatus(1);
  console.log(`    ✓ Port 1 Status: isOperate=${port1Status.isOperate} (status code: ${port1Status.portStatus})`);
  const port2Status = await client.readPortStatus(2);
  console.log(`    ✓ Port 2 Status: isOperate=${port2Status.isOperate} (status code: ${port2Status.portStatus})`);

  console.log('\n[5] Reading ISDU Parameters from Port 1 (IEC 61131-9 On-request Data)...');
  const vendorRes = await client.readISDU(1, STANDARD_ISDU.VENDOR_NAME, 0);
  console.log(`    ✓ Vendor Name (ISDU 0x0010):   "${vendorRes.dataAscii}" (success: ${vendorRes.success})`);

  const prodRes = await client.readISDU(1, STANDARD_ISDU.PRODUCT_NAME, 0);
  console.log(`    ✓ Product Name (ISDU 0x0012):  "${prodRes.dataAscii}"`);

  const serialRes = await client.readISDU(1, STANDARD_ISDU.SERIAL_NUMBER, 0);
  console.log(`    ✓ Serial Number (ISDU 0x0015): "${serialRes.dataAscii}"`);

  console.log('\n[6] Process Data (PDI / PDO) Fast Cycle Test...');
  const pdi = await client.readProcessData(1);
  console.log(`    ✓ Read Process Data In (PDI):  0x${pdi.toString('hex')} (${pdi.readUInt16BE(0)} raw)`);

  const pdoResp = await client.writeProcessData(1, Buffer.from([0x01])); // Turn on valve
  console.log(`    ✓ Write Process Data Out (PDO): Success (ACK 0x${pdoResp.toString('hex')})`);

  console.log('\n[7] Latency Benchmark (100 sequential SMI ISDU requests)...');
  const start = Date.now();
  const iterations = 100;
  for (let i = 0; i < iterations; i++) {
    await client.readISDU(1, STANDARD_ISDU.PRODUCT_NAME, 0);
  }
  const totalMs = Date.now() - start;
  const avgMs = (totalMs / iterations).toFixed(2);
  console.log(`    ✓ 100 round-trips completed in ${totalMs} ms (~${avgMs} ms / request)!`);
  console.log(`    (Compare this with HTTP REST where each request takes 30-100 ms)`);

  console.log('\n[8] Cleanup & Disconnect...');
  await client.disconnect();
  await mockServer.stop();
  console.log('    ✓ All tests passed successfully!\n');
}

runVerification().catch((err) => {
  console.error('Verification failed:', err);
  process.exit(1);
});
