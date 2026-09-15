const http = require('http');

function postPdo(byteVal) {
  return new Promise((resolve) => {
    const payload = JSON.stringify({ ioLink: { valid: true, value: [byteVal] } });
    const req = http.request({
      hostname: '192.168.23.100',
      port: 80,
      path: '/iolink/v1/devices/master1port1/processdata/value',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    }, (res) => {
      let b = ''; res.on('data', c => b += c); res.on('end', () => resolve(res.statusCode));
    });
    req.write(payload);
    req.end();
  });
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function runMotorPwmCycle() {
  console.log('===================================================');
  console.log('  MOTOR ÉS PIROS LED VEZÉRLÉSI CIKLUS INDULÁSA     ');
  console.log('===================================================\n');

  const pwmSteps = [10, 30, 50, 70, 90];

  console.log('[*] 1. FÁZIS: Motor BEKAPCSOLÁS és PWM LÉPTETÉS (10% -> 90%)...');
  for (const pwm of pwmSteps) {
    // bit 0 = 1 (ON), bits 1..7 = pwm
    const byteVal = (pwm << 1) | 1;
    await postPdo(byteVal);
    console.log(`    -> [PIROS LED ÉG] Motor BE, PWM: ${pwm}% (Bájt: 0x${byteVal.toString(16).toUpperCase()} / ${byteVal})`);
    await sleep(1500);
  }

  console.log('\n[*] 2. FÁZIS: Motor KIKAPCSOLÁS (OFF)...');
  await postPdo(0);
  console.log('    -> [PIROS LED KIALUDT] Motor KI (Bájt: 0x00)');
  await sleep(2500);

  console.log('\n[*] 3. FÁZIS: Motor ÚJRA BEKAPCSOLÁS (90% PWM)...');
  const maxByte = (90 << 1) | 1;
  await postPdo(maxByte);
  console.log(`    -> [PIROS LED ÉG] Motor ÚJRA BE, PWM: 90% (Bájt: 0x${maxByte.toString(16).toUpperCase()})`);
  await sleep(3000);

  console.log('\n[*] 4. FÁZIS: Biztonsági leállítás (OFF)...');
  await postPdo(0);
  console.log('    -> [PIROS LED KIALUDT] Motor LEÁLLÍTVA.');
  console.log('\n===================================================');
  console.log('  CIKLUS SIKERESEN BEFEJEZŐDÖTT!                   ');
  console.log('===================================================');
}

runMotorPwmCycle();
