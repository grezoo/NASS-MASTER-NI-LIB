// smi-wrapper.js
// Ultra-Responsive Industrial SMI Client & Protocol Bridge for Nass Magnet 4p Eth Master
// Safe Serialized Execution, tecHTTPd Connection:close Protection, 30ms Sub-Cycle Latency

const http = require('http');
const EventEmitter = require('events');
const { PORT_MODES, BAUD_RATES, SMI_SERVICES, PORT_STATUS, STANDARD_ISDU } = require('./lib/smi/smi-protocol');

// Global process safeguard against unhandled socket errors
process.on('uncaughtException', (err) => {
  if (err && (err.code === 'ECONNRESET' || err.code === 'EPIPE' || String(err.message).includes('ECONNRESET'))) {
    return;
  }
  console.error('[UNCAUGHT EXCEPTION]', err);
});

class SmiEngine extends EventEmitter {
  constructor() {
    super();
    this.host = process.env.SMI_HOST || '192.168.23.100';
    this.port = 80;
    this.queue = Promise.resolve();
    this.isOnline = true;
    this.lastSuccessTime = Date.now();
    this.failedAttempts = 0;

    // Compatibility object for legacy nodes
    this.client = {
      isConnected: true,
      options: { host: this.host, port: 80 }
    };

    // Internal Cache
    this.cache = {
      gwIdent: {
        productName: '4p Eth Master',
        vendorName: 'nass magnet Hungaria Kft.',
        hardwareRevision: 'HW-V020',
        firmwareRevision: 'FW-V1_0_1',
        serialNumber: 'nmEM001000000322',
        macAddress: '94:D8:6B:3C:12:3D'
      },
      gwConfig: {
        ethIpv4: [{ ipAddress: '192.168.23.100', subnetMask: '255.255.255.0', standardGateway: '192.168.23.1', ipConfiguration: 'MANUAL' }]
      },
      portsStatus: null,
      masterIdent: null,
      pd: {},
      lastPdTime: {},
      lastStatusTime: 0
    };
  }

  setTarget(host, port) {
    if (host) this.host = host;
    this.client.options.host = this.host;
  }

  request(method, urlPath, payloadData = null, timeoutMs = 250) {
    this.queue = this.queue.then(() => new Promise((resolve) => {
      const postData = payloadData ? JSON.stringify(payloadData) : null;
      const options = {
        hostname: this.host,
        port: 80,
        path: urlPath,
        method: method,
        timeout: timeoutMs,
        headers: {
          'Accept': 'application/json',
          'Connection': 'close'
        }
      };
      if (postData) {
        options.headers['Content-Type'] = 'application/json';
        options.headers['Content-Length'] = Buffer.byteLength(postData);
      }

      const req = http.request(options, (res) => {
        let raw = '';
        res.on('data', chunk => raw += chunk);
        res.on('end', () => {
          this.isOnline = true;
          this.client.isConnected = true;
          this.lastSuccessTime = Date.now();
          this.failedAttempts = 0;
          try {
            const json = raw ? JSON.parse(raw) : {};
            resolve({ statusCode: res.statusCode, data: json });
          } catch(e) {
            resolve({ statusCode: res.statusCode, raw: raw });
          }
        });
      });

      req.on('error', (err) => {
        this.failedAttempts++;
        if (this.failedAttempts >= 2) {
          this.isOnline = false;
          this.client.isConnected = false;
          this.emit('disconnected', err);
        }
        resolve({ statusCode: 500, error: err.message });
      });

      req.on('timeout', () => {
        req.destroy();
        this.failedAttempts++;
        if (this.failedAttempts >= 2) {
          this.isOnline = false;
          this.client.isConnected = false;
          this.emit('disconnected', new Error('TIMEOUT'));
        }
        resolve({ statusCode: 504, error: 'TIMEOUT' });
      });

      if (postData) req.write(postData);
      req.end();
    })).catch(() => ({ statusCode: 500, error: 'Queue error' }));

    return this.queue;
  }

  async syncAll() {
    const t0 = Date.now();
    try {
      const ident = await this.readGatewayIdentification();
      const config = await this.readGatewayConfiguration();
      const ports = await this.readAllPorts();
      const p1 = await this.readPD(1);
      const p2 = await this.readPD(2);
      const p3 = await this.readPD(3);
      const p4 = await this.readPD(4);
      return {
        durationMs: Date.now() - t0,
        ident,
        config,
        ports,
        pd: { 1: p1, 2: p2, 3: p3, 4: p4 }
      };
    } catch(e) {
      return null;
    }
  }

  async readGatewayIdentification() {
    if (this.cache.gwIdent && Date.now() - this.cache.lastStatusTime < 30000) {
      return this.cache.gwIdent;
    }
    let res = await this.request('GET', '/iolink/v1/gateway/identification');
    if (res && res.data && res.data.productName) {
      this.cache.gwIdent = res.data;
      return res.data;
    }
    return this.cache.gwIdent;
  }

  async readGatewayConfiguration() {
    if (this.cache.gwConfig && Date.now() - this.cache.lastStatusTime < 30000) {
      return this.cache.gwConfig;
    }
    let res = await this.request('GET', '/iolink/v1/gateway/configuration');
    if (res && res.data && res.data.ethIpv4) {
      this.cache.gwConfig = res.data;
      return res.data;
    }
    return this.cache.gwConfig;
  }

  async readMasterIdentification() {
    if (this.cache.masterIdent) return this.cache.masterIdent;
    let res = await this.request('GET', '/iolink/v1/masters/1/identification');
    if (res && res.data) {
      this.cache.masterIdent = res.data;
      return res.data;
    }
    return this.cache.masterIdent || {};
  }

  async readAllPorts() {
    let now = Date.now();
    if (this.cache.portsStatus && now - this.cache.lastStatusTime < 150) {
      return this.cache.portsStatus;
    }
    let res = await this.request('GET', '/iolink/v1/masters/1/ports');
    if (res && Array.isArray(res.data)) {
      this.cache.portsStatus = res.data;
      this.cache.lastStatusTime = now;
      return res.data;
    }
    return this.cache.portsStatus || [];
  }

  async readPortStatus(portNum) {
    let ports = await this.readAllPorts();
    return ports[portNum - 1] || null;
  }

  async setPortMode(portNum, mode) {
    const alias = `master1port${portNum}`;
    const payload = { deviceAlias: alias, mode: mode };
    if (mode === 'DIGITAL_INPUT') payload.iqConfiguration = 'DIGITAL_INPUT';
    else if (mode === 'DIGITAL_OUTPUT') payload.iqConfiguration = 'NOT_SUPPORTED';
    let res = await this.request('POST', `/iolink/v1/masters/1/ports/${portNum}/configuration`, payload);
    this.cache.portsStatus = null;
    return res.data || {};
  }

  async readISDU(portNum, index, subindex = 0) {
    const alias = `master1port${portNum}`;
    let res = await this.request('GET', `/iolink/v1/devices/${alias}/parameters/${index}/value?format=byteArray`);
    return res.data || {};
  }

  async writeISDU(portNum, index, subindex, dataBuffer) {
    const alias = `master1port${portNum}`;
    let arrVal = Buffer.isBuffer(dataBuffer) ? Array.from(dataBuffer) : (Array.isArray(dataBuffer) ? dataBuffer : [dataBuffer]);
    let res = await this.request('POST', `/iolink/v1/devices/${alias}/parameters/${index}/value`, { value: arrVal });
    return res.data || {};
  }

  async readPD(portNum) {
    return this.readProcessData(portNum);
  }

  async readProcessData(portNum) {
    let now = Date.now();
    let lockUntil = this.cache.lastPdTime[portNum] || 0;
    if (this.cache.pd[portNum] && now < lockUntil) {
      return this.cache.pd[portNum];
    }
    if (this.cache.pd[portNum] && now - lockUntil < 60) {
      return this.cache.pd[portNum];
    }
    const alias = `master1port${portNum}`;
    let url = (portNum === 1 || portNum === 3)
      ? `/iolink/v1/devices/${alias}/processdata/value?format=byteArray`
      : `/iolink/v1/devices/${alias}/processdata/value`;

    let res = await this.request('GET', url);
    if (res && res.data) {
      this.cache.pd[portNum] = res.data;
      this.cache.lastPdTime[portNum] = now;
      return res.data;
    }
    return this.cache.pd[portNum] || null;
  }

  async writePD(portNum, data) {
    return this.writeProcessData(portNum, data);
  }

  async writeProcessData(portNum, data) {
    const alias = `master1port${portNum}`;
    let payload = {};
    if (typeof data === 'boolean') {
      payload = { cqValue: data };
      this.cache.pd[portNum] = { setData: { cqValue: data }, getData: { cqValue: data } };
      this.cache.lastPdTime[portNum] = Date.now() + 600;
    } else if (Array.isArray(data)) {
      payload = { ioLink: { valid: true, value: data } };
    } else {
      payload = data;
    }
    let res = await this.request('POST', `/iolink/v1/devices/${alias}/processdata/value`, payload);
    if (typeof data === 'boolean') {
      this.cache.pd[portNum] = { setData: { cqValue: data } };
      this.cache.lastPdTime[portNum] = Date.now();
    }
    return res.data || {};
  }
}

const instance = new SmiEngine();

module.exports = instance;
module.exports.PORT_MODES = PORT_MODES;
module.exports.BAUD_RATES = BAUD_RATES;
module.exports.SMI_SERVICES = SMI_SERVICES;
module.exports.PORT_STATUS = PORT_STATUS;
module.exports.STANDARD_ISDU = STANDARD_ISDU;
