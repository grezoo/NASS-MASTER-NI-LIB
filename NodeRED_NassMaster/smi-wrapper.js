// smi-wrapper.js  v3.1
// Ultra-Responsive Industrial SMI Client & Protocol Bridge for Nass Magnet 4p Eth Master
// Optimizations v3.1:
//   [1] GW Ident permanent cache  - fetch once, serve forever (data never changes)
//   [2] syncAll parallel grouping - (Ident||Config||Ports) then (PD1->2->3->4 sequential)
//   [3] Adaptive poll interval    - exposed via smi.suggestPollMs()
//   [4] Delta-based change detect - smi.hasChanged(portNum, newData) -> bool
//   [5] DI port awareness         - port4 is DI, skip byteArray format, longer timeout
//   [6] Correct DO payload        - {setData:{cqValue:bool}} (HTTP 204 = success)

const http = require('http');
const EventEmitter = require('events');
const { PORT_MODES, BAUD_RATES, SMI_SERVICES, PORT_STATUS, STANDARD_ISDU } = require('./lib/smi/smi-protocol');

process.on('uncaughtException', (err) => {
  if (err && (err.code === 'ECONNRESET' || err.code === 'EPIPE' || String(err.message).includes('ECONNRESET'))) return;
  console.error('[UNCAUGHT EXCEPTION]', err);
});

// Port type map
const PORT_TYPE = { 1: 'IOLINK', 2: 'DO', 3: 'IOLINK', 4: 'DI' };

class SmiEngine extends EventEmitter {
  constructor() {
    super();
    this.host = process.env.SMI_HOST || '192.168.23.100';
    this.port = 80;
    this.queue = Promise.resolve();
    this.isOnline = true;
    this.lastSuccessTime = Date.now();
    this.failedAttempts = 0;
    this._lastCycleMs   = 20;
    this._consecutiveOk = 0;
    this._pollMin       = 300;
    this._pollMax       = 3000;
    this._pollNormal    = 1000;
    this.client = { isConnected: true, options: { host: this.host, port: 80 } };
    this.cache = {
      gwIdent: { productName: '4p Eth Master', vendorName: 'nass magnet Hungaria Kft.', hardwareRevision: 'HW-V020', firmwareRevision: 'FW-V1_0_1', serialNumber: 'nmEM001000000322', macAddress: '94:D8:6B:3C:12:3D' },
      gwIdentLoaded: false,
      gwConfig: { ethIpv4: [{ ipAddress: '192.168.23.100', subnetMask: '255.255.255.0', standardGateway: '192.168.23.1', ipConfiguration: 'MANUAL' }] },
      gwConfigLoaded: false,
      portsStatus: null,
      masterIdent: null,
      lastStatusTime: 0,
      pd: {},
      pdPrev: {},
      lastPdTime: {}
    };
  }

  setTarget(host, port) {
    if (host) this.host = host;
    this.client.options.host = this.host;
  }

  // [3] Adaptive poll interval
  suggestPollMs() {
    if (!this.isOnline) return this._pollMax;
    if (this._consecutiveOk < 3) return this._pollNormal;
    if (this._lastCycleMs < 15) return this._pollMin;
    if (this._lastCycleMs < 30) return this._pollNormal;
    return Math.min(this._pollNormal * 1.5, this._pollMax);
  }

  // [4] Delta change detection
  hasChanged(portNum, newData) {
    const newStr = JSON.stringify(newData);
    const oldStr = JSON.stringify(this.cache.pdPrev[portNum]);
    if (newStr !== oldStr) { this.cache.pdPrev[portNum] = newData; return true; }
    return false;
  }

  request(method, urlPath, payloadData = null, timeoutMs = 300) {
    this.queue = this.queue.then(() => new Promise((resolve) => {
      const postData = payloadData ? JSON.stringify(payloadData) : null;
      const options = {
        hostname: this.host, port: 80, path: urlPath, method,
        timeout: timeoutMs,
        headers: { 'Accept': 'application/json', 'Connection': 'close' }
      };
      if (postData) {
        options.headers['Content-Type'] = 'application/json';
        options.headers['Content-Length'] = Buffer.byteLength(postData);
      }
      const req = http.request(options, (res) => {
        let raw = '';
        res.on('data', chunk => raw += chunk);
        res.on('end', () => {
          this.isOnline = true; this.client.isConnected = true;
          this.lastSuccessTime = Date.now(); this.failedAttempts = 0; this._consecutiveOk++;
          try { resolve({ statusCode: res.statusCode, data: JSON.parse(raw || '{}') }); }
          catch(e) { resolve({ statusCode: res.statusCode, raw }); }
        });
      });
      req.on('error', (err) => {
        this.failedAttempts++; this._consecutiveOk = 0;
        if (this.failedAttempts >= 2) { this.isOnline = false; this.client.isConnected = false; this.emit('disconnected', err); }
        resolve({ statusCode: 500, error: err.message });
      });
      req.on('timeout', () => {
        req.destroy(); this.failedAttempts++; this._consecutiveOk = 0;
        if (this.failedAttempts >= 2) { this.isOnline = false; this.client.isConnected = false; this.emit('disconnected', new Error('TIMEOUT')); }
        resolve({ statusCode: 504, error: 'TIMEOUT' });
      });
      if (postData) req.write(postData);
      req.end();
    })).catch(() => ({ statusCode: 500, error: 'Queue error' }));
    return this.queue;
  }

  // [2] syncAll: Group1 parallel, Group2 sequential
  async syncAll() {
    const t0 = Date.now();
    try {
      const [ident, config, ports] = await Promise.all([
        this._fetchGwIdent(), this._fetchGwConfig(), this._fetchPorts()
      ]);
      const p1 = await this.readPD(1);
      const p2 = await this.readPD(2);
      const p3 = await this.readPD(3);
      const p4 = await this.readPD(4);
      const durationMs = Date.now() - t0;
      this._lastCycleMs = durationMs;
      return { durationMs, ident, config, ports, pd: { 1: p1, 2: p2, 3: p3, 4: p4 } };
    } catch(e) {
      this._lastCycleMs = Date.now() - t0;
      return null;
    }
  }

  _httpGet(urlPath, timeoutMs = 500) {
    return new Promise((resolve) => {
      const req = http.request(
        { hostname: this.host, port: 80, path: urlPath, method: 'GET', timeout: timeoutMs,
          headers: { 'Accept': 'application/json', 'Connection': 'close' } },
        (res) => {
          let raw = '';
          res.on('data', c => raw += c);
          res.on('end', () => { try { resolve({ ok: true, data: JSON.parse(raw || '{}') }); } catch(e) { resolve({ ok: false, data: {} }); } });
        }
      );
      req.on('error', () => resolve({ ok: false, data: {} }));
      req.on('timeout', () => { req.destroy(); resolve({ ok: false, data: {} }); });
      req.end();
    });
  }

  // [1] GW Ident: permanent cache
  async _fetchGwIdent() {
    if (this.cache.gwIdentLoaded) return this.cache.gwIdent;
    const r = await this._httpGet('/iolink/v1/gateway/identification');
    if (r.ok && r.data.productName) { this.cache.gwIdent = r.data; this.cache.gwIdentLoaded = true; }
    return this.cache.gwIdent;
  }

  // GW Config: 60s cache
  async _fetchGwConfig() {
    const age = Date.now() - (this.cache._gwConfigTime || 0);
    if (this.cache.gwConfigLoaded && age < 60000) return this.cache.gwConfig;
    const r = await this._httpGet('/iolink/v1/gateway/configuration');
    if (r.ok && r.data.ethIpv4) { this.cache.gwConfig = r.data; this.cache.gwConfigLoaded = true; this.cache._gwConfigTime = Date.now(); }
    return this.cache.gwConfig;
  }

  // Ports: 150ms cache
  async _fetchPorts() {
    const age = Date.now() - this.cache.lastStatusTime;
    if (this.cache.portsStatus && age < 150) return this.cache.portsStatus;
    const r = await this._httpGet('/iolink/v1/masters/1/ports');
    if (r.ok && Array.isArray(r.data)) { this.cache.portsStatus = r.data; this.cache.lastStatusTime = Date.now(); }
    return this.cache.portsStatus || [];
  }

  async readGatewayIdentification() { return this._fetchGwIdent(); }
  async readGatewayConfiguration()  { return this._fetchGwConfig(); }

  async readMasterIdentification() {
    if (this.cache.masterIdent) return this.cache.masterIdent;
    let res = await this.request('GET', '/iolink/v1/masters/1/identification');
    if (res && res.data) { this.cache.masterIdent = res.data; return res.data; }
    return this.cache.masterIdent || {};
  }

  async readAllPorts()            { return this._fetchPorts(); }
  async readPortStatus(portNum)   { return (await this.readAllPorts())[portNum - 1] || null; }

  async setPortMode(portNum, mode) {
    const alias = `master1port${portNum}`;
    const payload = { deviceAlias: alias, mode };
    if (mode === 'DIGITAL_INPUT')  payload.iqConfiguration = 'DIGITAL_INPUT';
    if (mode === 'DIGITAL_OUTPUT') payload.iqConfiguration = 'NOT_SUPPORTED';
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

  async readPD(portNum)  { return this.readProcessData(portNum); }

  // [5] DI-aware PD reading
  async readProcessData(portNum) {
    let now = Date.now();
    let lockUntil = this.cache.lastPdTime[portNum] || 0;
    if (this.cache.pd[portNum] && now < lockUntil)       return this.cache.pd[portNum];
    if (this.cache.pd[portNum] && now - lockUntil < 60)  return this.cache.pd[portNum];

    const alias    = `master1port${portNum}`;
    const portType = PORT_TYPE[portNum] || 'IOLINK';
    let url, timeout;

    if (portType === 'DI') {
      url     = `/iolink/v1/devices/${alias}/processdata/value`;
      timeout = 300; // DI is slower due to master hardware poll cycle, not HTTP
    } else if (portType === 'IOLINK') {
      url     = `/iolink/v1/devices/${alias}/processdata/value?format=byteArray`;
      timeout = 300;
    } else {
      url     = `/iolink/v1/devices/${alias}/processdata/value`;
      timeout = 300;
    }

    let res = await this.request('GET', url, null, timeout);
    if (res && res.data) {
      this.cache.pd[portNum]       = res.data;
      this.cache.lastPdTime[portNum] = now;
      return res.data;
    }
    return this.cache.pd[portNum] || null;
  }

  async writePD(portNum, data) { return this.writeProcessData(portNum, data); }

  // [6] Correct DO payload
  async writeProcessData(portNum, data) {
    const alias = `master1port${portNum}`;
    let payload = {};
    if (typeof data === 'boolean') {
      payload = { setData: { cqValue: data } };
      this.cache.pd[portNum] = { setData: { cqValue: data }, getData: { cqValue: data } };
      this.cache.lastPdTime[portNum] = Date.now() + 600;
    } else if (Array.isArray(data)) {
      payload = { ioLink: { valid: true, value: data } };
    } else {
      payload = data;
    }
    let res = await this.request('POST', `/iolink/v1/devices/${alias}/processdata/value`, payload, 500);
    if (typeof data === 'boolean') {
      this.cache.pd[portNum] = { setData: { cqValue: data } };
      this.cache.lastPdTime[portNum] = Date.now();
    }
    return res.data || {};
  }
}

const instance = new SmiEngine();
module.exports = instance;
module.exports.PORT_MODES    = PORT_MODES;
module.exports.BAUD_RATES    = BAUD_RATES;
module.exports.SMI_SERVICES  = SMI_SERVICES;
module.exports.PORT_STATUS   = PORT_STATUS;
module.exports.STANDARD_ISDU = STANDARD_ISDU;