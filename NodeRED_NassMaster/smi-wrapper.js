// smi-wrapper.js  v3.2
// Dynamic Multi-Master SMI Client Ă˘â‚¬â€ś Nass Magnet 4p Eth Master
// v3.2 changes:
//   [1] Dynamic port type from statusInfo (no hardcoded PORT_TYPE map)
//   [2] Hot-plug detection Ă˘â‚¬â€ś PD cache invalidated on device change
//   [3] Multi-master Ă˘â‚¬â€ś full cache reset on setTarget(ip)
//   [4] Disconnect / reconnect event handling

const http = require('http');
const EventEmitter = require('events');
const { PORT_MODES, BAUD_RATES, SMI_SERVICES, PORT_STATUS, STANDARD_ISDU } = require('./lib/smi/smi-protocol');

process.on('uncaughtException', (err) => {
  if (err && (err.code === 'ECONNRESET' || err.code === 'EPIPE' || String(err.message).includes('ECONNRESET'))) return;
  console.error('[UNCAUGHT EXCEPTION]', err);
});

// Determine PD URL format from master's statusInfo field
// IO-Link device online -> byteArray format; DI/DO/offline -> plain JSON
function pdUrlForPort(portInfo, host) {
  const si = (portInfo && portInfo.statusInfo) ? portInfo.statusInfo : '';
  const alias = portInfo ? portInfo.deviceAlias || ('master1port' + portInfo.portNumber) : '';
  const base = '/iolink/v1/devices/' + alias + '/processdata/value';
  // IO-Link device present: use byteArray format
  if (si === 'DEVICE_ONLINE' || si === 'DEVICE_PREOPERATE') {
    return base + '?format=byteArray';
  }
  // DI / DO / no device: plain JSON
  return base;
}

// Is this port an IO-Link device (vs DI/DO)?
function isIoLinkPort(portInfo) {
  const si = (portInfo && portInfo.statusInfo) ? portInfo.statusInfo : '';
  return si === 'DEVICE_ONLINE' || si === 'DEVICE_PREOPERATE';
}

class SmiEngine extends EventEmitter {
  constructor() {
    super();
    this.host = process.env.SMI_HOST || '192.168.23.100';
    this.queue = Promise.resolve();
    this.isOnline = true;
    this.lastSuccessTime = Date.now();
    this.failedAttempts = 0;
    this._lastCycleMs   = 20;
    this._consecutiveOk = 0;
    this._pollMin    = 300;
    this._pollMax    = 3000;
    this._pollNormal = 1000;
    this.client = { isConnected: true, options: { host: this.host, port: 80 } };
    this._initCache();
  }

  _initCache() {
    this.cache = {
      gwIdent:      { productName: '4p Eth Master', vendorName: 'nass magnet Hungaria Kft.', hardwareRevision: 'HW-V020', firmwareRevision: 'FW-V1_0_1', serialNumber: 'nmEM001000000322', macAddress: '94:D8:6B:3C:12:3D' },
      gwIdentLoaded: false,
      gwConfig:     { ethIpv4: [{ ipAddress: this.host, subnetMask: '255.255.255.0', standardGateway: '192.168.23.1', ipConfiguration: 'MANUAL' }] },
      gwConfigLoaded: false,
      _gwConfigTime: 0,
      portsStatus:  null,   // array of port objects from /masters/1/ports
      _portsTime:   0,
      masterIdent:  null,
      pd:           {},     // { [portNum]: lastData }
      pdPrev:       {},     // { [portNum]: lastData } for delta detection
      lastPdTime:   {},     // { [portNum]: timestamp or lockUntil }
    };
  }

  // [3] Multi-master: change target IP and flush all caches
  setTarget(host) {
    if (!host || host === this.host) return;
    console.log('[SMI] Target changed: ' + this.host + ' -> ' + host);
    this.host = host;
    this.client.options.host = host;
    this._initCache();            // full cache reset for new master
    this.queue = Promise.resolve(); // reset serialized queue
    this.failedAttempts = 0;
    this.isOnline = true;
    this.client.isConnected = true;
    this.emit('target_changed', host);
  }

  // [3] Adaptive poll interval
  suggestPollMs() {
    if (!this.isOnline) return this._pollMax;
    if (this._consecutiveOk < 3) return this._pollNormal;
    if (this._lastCycleMs < 15) return this._pollMin;
    if (this._lastCycleMs < 30) return this._pollNormal;
    return Math.min(this._pollNormal * 1.5, this._pollMax);
  }

  // [4] Delta change detection per port
  hasChanged(portNum, newData) {
    const newStr = JSON.stringify(newData);
    const oldStr = JSON.stringify(this.cache.pdPrev[portNum]);
    if (newStr !== oldStr) { this.cache.pdPrev[portNum] = newData; return true; }
    return false;
  }

  // Ă˘â€ťâ‚¬Ă˘â€ťâ‚¬ Core serialized HTTP request Ă˘â€ťâ‚¬Ă˘â€ťâ‚¬Ă˘â€ťâ‚¬Ă˘â€ťâ‚¬Ă˘â€ťâ‚¬Ă˘â€ťâ‚¬Ă˘â€ťâ‚¬Ă˘â€ťâ‚¬Ă˘â€ťâ‚¬Ă˘â€ťâ‚¬Ă˘â€ťâ‚¬Ă˘â€ťâ‚¬Ă˘â€ťâ‚¬Ă˘â€ťâ‚¬Ă˘â€ťâ‚¬Ă˘â€ťâ‚¬Ă˘â€ťâ‚¬Ă˘â€ťâ‚¬Ă˘â€ťâ‚¬Ă˘â€ťâ‚¬Ă˘â€ťâ‚¬Ă˘â€ťâ‚¬Ă˘â€ťâ‚¬Ă˘â€ťâ‚¬Ă˘â€ťâ‚¬Ă˘â€ťâ‚¬Ă˘â€ťâ‚¬Ă˘â€ťâ‚¬Ă˘â€ťâ‚¬Ă˘â€ťâ‚¬Ă˘â€ťâ‚¬Ă˘â€ťâ‚¬Ă˘â€ťâ‚¬Ă˘â€ťâ‚¬Ă˘â€ťâ‚¬Ă˘â€ťâ‚¬Ă˘â€ťâ‚¬Ă˘â€ťâ‚¬Ă˘â€ťâ‚¬Ă˘â€ťâ‚¬Ă˘â€ťâ‚¬
  request(method, urlPath, payloadData, timeoutMs) {
    if (timeoutMs === undefined) timeoutMs = 300;
    this.queue = this.queue.then(() => new Promise((resolve) => {
      const postData = payloadData ? JSON.stringify(payloadData) : null;
      const options = {
        hostname: this.host, port: 80, path: urlPath, method: method,
        timeout: timeoutMs,
        headers: { 'Accept': 'application/json', 'Connection': 'close' }
      };
      if (postData) {
        options.headers['Content-Type'] = 'application/json';
        options.headers['Content-Length'] = Buffer.byteLength(postData);
      }
      const req = http.request(options, function(res) {
        var raw = '';
        res.on('data', function(c) { raw += c; });
        res.on('end', function() {
          this.isOnline = true; this.client.isConnected = true;
          this.lastSuccessTime = Date.now(); this.failedAttempts = 0; this._consecutiveOk++;
          try { resolve({ statusCode: res.statusCode, data: JSON.parse(raw || '{}') }); }
          catch(e) { resolve({ statusCode: res.statusCode, raw: raw }); }
        }.bind(this));
      }.bind(this));
      req.on('error', function(err) {
        this.failedAttempts++; this._consecutiveOk = 0;
        if (this.failedAttempts >= 2) {
          this.isOnline = false; this.client.isConnected = false;
          this.emit('disconnected', err);
        }
        resolve({ statusCode: 500, error: err.message });
      }.bind(this));
      req.on('timeout', function() {
        req.destroy(); this.failedAttempts++; this._consecutiveOk = 0;
        if (this.failedAttempts >= 2) {
          this.isOnline = false; this.client.isConnected = false;
          this.emit('disconnected', new Error('TIMEOUT'));
        }
        resolve({ statusCode: 504, error: 'TIMEOUT' });
      }.bind(this));
      if (postData) req.write(postData);
      req.end();
    })).catch(function() { return { statusCode: 500, error: 'Queue error' }; });
    return this.queue;
  }

  // Parallel-safe GET (bypasses queue Ă˘â‚¬â€ś for syncAll group1)
  _httpGet(urlPath, timeoutMs) {
    if (!timeoutMs) timeoutMs = 500;
    var self = this;
    return new Promise(function(resolve) {
      var req = http.request(
        { hostname: self.host, port: 80, path: urlPath, method: 'GET',
          timeout: timeoutMs, headers: { 'Accept': 'application/json', 'Connection': 'close' } },
        function(res) {
          var raw = '';
          res.on('data', function(c) { raw += c; });
          res.on('end', function() {
            try { resolve({ ok: true, data: JSON.parse(raw || '{}') }); }
            catch(e) { resolve({ ok: false, data: {} }); }
          });
        }
      );
      req.on('error', function() { resolve({ ok: false, data: {} }); });
      req.on('timeout', function() { req.destroy(); resolve({ ok: false, data: {} }); });
      req.end();
    });
  }

  // Ă˘â€ťâ‚¬Ă˘â€ťâ‚¬ GW Ident: permanent cache (hardware data never changes) Ă˘â€ťâ‚¬Ă˘â€ťâ‚¬Ă˘â€ťâ‚¬Ă˘â€ťâ‚¬Ă˘â€ťâ‚¬Ă˘â€ťâ‚¬Ă˘â€ťâ‚¬Ă˘â€ťâ‚¬Ă˘â€ťâ‚¬Ă˘â€ťâ‚¬Ă˘â€ťâ‚¬Ă˘â€ťâ‚¬Ă˘â€ťâ‚¬Ă˘â€ťâ‚¬Ă˘â€ťâ‚¬
  _fetchGwIdent() {
    if (this.cache.gwIdentLoaded) return Promise.resolve(this.cache.gwIdent);
    var self = this;
    return this._httpGet('/iolink/v1/gateway/identification').then(function(r) {
      if (r.ok && r.data.productName) { self.cache.gwIdent = r.data; self.cache.gwIdentLoaded = true; }
      return self.cache.gwIdent;
    });
  }

  // GW Config: 60s cache
  _fetchGwConfig() {
    var age = Date.now() - (this.cache._gwConfigTime || 0);
    if (this.cache.gwConfigLoaded && age < 60000) return Promise.resolve(this.cache.gwConfig);
    var self = this;
    return this._httpGet('/iolink/v1/gateway/configuration').then(function(r) {
      if (r.ok && r.data.ethIpv4) {
        self.cache.gwConfig = r.data;
        self.cache.gwConfigLoaded = true;
        self.cache._gwConfigTime = Date.now();
      }
      return self.cache.gwConfig;
    });
  }

  // [1][2] Ports: 150ms cache + hot-plug detection
  _fetchPorts() {
    var age = Date.now() - (this.cache._portsTime || 0);
    if (this.cache.portsStatus && age < 150) return Promise.resolve(this.cache.portsStatus);
    var self = this;
    return this._httpGet('/iolink/v1/masters/1/ports').then(function(r) {
      if (r.ok && Array.isArray(r.data)) {
        var prev = self.cache.portsStatus;
        self.cache.portsStatus = r.data;
        self.cache._portsTime = Date.now();
        // [2] Hot-plug: detect status changes per port, invalidate PD cache
        if (prev) {
          r.data.forEach(function(port) {
            var pn = port.portNumber;
            var oldPort = prev.find(function(p) { return p.portNumber === pn; });
            if (oldPort && oldPort.statusInfo !== port.statusInfo) {
              console.log('[SMI] Port ' + pn + ' changed: ' + oldPort.statusInfo + ' -> ' + port.statusInfo);
              delete self.cache.pd[pn];
              delete self.cache.pdPrev[pn];
              delete self.cache.lastPdTime[pn];
              self.emit('port_changed', { portNumber: pn, from: oldPort.statusInfo, to: port.statusInfo });
            }
          });
        }
      }
      return self.cache.portsStatus || [];
    });
  }

  // Ă˘â€ťâ‚¬Ă˘â€ťâ‚¬ syncAll: Group1 parallel, Group2 sequential Ă˘â€ťâ‚¬Ă˘â€ťâ‚¬Ă˘â€ťâ‚¬Ă˘â€ťâ‚¬Ă˘â€ťâ‚¬Ă˘â€ťâ‚¬Ă˘â€ťâ‚¬Ă˘â€ťâ‚¬Ă˘â€ťâ‚¬Ă˘â€ťâ‚¬Ă˘â€ťâ‚¬Ă˘â€ťâ‚¬Ă˘â€ťâ‚¬Ă˘â€ťâ‚¬Ă˘â€ťâ‚¬Ă˘â€ťâ‚¬Ă˘â€ťâ‚¬Ă˘â€ťâ‚¬Ă˘â€ťâ‚¬Ă˘â€ťâ‚¬Ă˘â€ťâ‚¬Ă˘â€ťâ‚¬Ă˘â€ťâ‚¬Ă˘â€ťâ‚¬Ă˘â€ťâ‚¬Ă˘â€ťâ‚¬Ă˘â€ťâ‚¬
  syncAll() {
    var self = this;
    var t0 = Date.now();
    return Promise.all([
      self._fetchGwIdent(),
      self._fetchGwConfig(),
      self._fetchPorts()
    ]).then(function(group1) {
      var ident = group1[0], config = group1[1], ports = group1[2];
      // Sequential PD reads (master can't handle parallel PD)
      return self.readPD(1).then(function(p1) {
        return self.readPD(2).then(function(p2) {
          return self.readPD(3).then(function(p3) {
            return self.readPD(4).then(function(p4) {
              var durationMs = Date.now() - t0;
              self._lastCycleMs = durationMs;
              return { durationMs: durationMs, ident: ident, config: config, ports: ports, pd: { 1: p1, 2: p2, 3: p3, 4: p4 } };
            });
          });
        });
      });
    }).catch(function(e) {
      self._lastCycleMs = Date.now() - t0;
      return null;
    });
  }

  readGatewayIdentification() { return this._fetchGwIdent(); }
  readGatewayConfiguration()  { return this._fetchGwConfig(); }
  readAllPorts()              { return this._fetchPorts(); }

  readMasterIdentification() {
    if (this.cache.masterIdent) return Promise.resolve(this.cache.masterIdent);
    var self = this;
    return this.request('GET', '/iolink/v1/masters/1/identification').then(function(res) {
      if (res && res.data) { self.cache.masterIdent = res.data; return res.data; }
      return self.cache.masterIdent || {};
    });
  }

  readPortStatus(portNum) {
    return this.readAllPorts().then(function(ports) {
      return ports.find(function(p) { return p.portNumber === portNum; }) || null;
    });
  }

  setPortMode(portNum, mode) {
    var alias = 'master1port' + portNum;
    var self = this;

    // Ha DEACTIVATED (Power Off) kérés jön:
    if (mode === 'DEACTIVATED') {
      console.log('[SMI] Port ' + portNum + ' -> DEACTIVATED (Stopping outputs & Power Off)...');
      // 1. lépés: Fail-Safe stop kimenet (motor/szelep azonnali leállítása)
      return self.request('POST', '/iolink/v1/devices/' + alias + '/processdata/value', { ioLink: { valid: true, value: [0, 0, 0, 0] }, cqValue: false }, 300).catch(function(){})
        .then(function() {
          // 2. lépés: Port mód DEACTIVATED (Master áramtalanítja a portot)
          var payload = { deviceAlias: alias, mode: 'DEACTIVATED', iqConfiguration: 'NOT_SUPPORTED' };
          return self.request('POST', '/iolink/v1/masters/1/ports/' + portNum + '/configuration', payload, 500);
        }).then(function(res) {
          self.cache.portsStatus = null;
          delete self.cache.pd[portNum];
          delete self.cache.lastPdTime[portNum];
          return res.data || {};
        });
    }

    // Ha más módra váltunk (Power ON + boot + új mód aktiválása):
    console.log('[SMI] Port ' + portNum + ' -> ' + mode + ' (Power ON sequence)...');
    var payload = { deviceAlias: alias, mode: mode };
    if (mode === 'DIGITAL_INPUT')  payload.iqConfiguration = 'DIGITAL_INPUT';
    if (mode === 'DIGITAL_OUTPUT') payload.iqConfiguration = 'NOT_SUPPORTED';
    if (mode === 'IOLINK_AUTOSTART') payload.iqConfiguration = 'NOT_SUPPORTED';

    return self.request('POST', '/iolink/v1/masters/1/ports/' + portNum + '/configuration', payload, 1000).then(function(res) {
      self.cache.portsStatus = null;
      delete self.cache.pd[portNum];
      delete self.cache.lastPdTime[portNum];
      return res.data || {};
    });
  }

  // Port power control via DEACTIVATED mode
  // The master has no dedicated power endpoint Ă˘â‚¬â€ś DEACTIVATED cuts L+ supply on the port pin
  // on=false  Ă˘â€ â€™ mode DEACTIVATED   (power off, saves previous mode)
  // on=true   Ă˘â€ â€™ restore saved mode (power on)
  setPortPower(portNum, on) {
    var self = this;

    if (!on) {
      // Save current mode before cutting power
      return self.readPortStatus(portNum).then(function(port) {
        var currentMode = 'IOLINK_AUTOSTART'; // safe default
        if (port) {
          var si = port.statusInfo || '';
          if (si.indexOf('DIGITAL_INPUT')  !== -1) currentMode = 'DIGITAL_INPUT';
          else if (si.indexOf('DIGITAL_OUTPUT') !== -1) currentMode = 'DIGITAL_OUTPUT';
          else if (si === 'DEVICE_ONLINE' || si === 'DEVICE_PREOPERATE') currentMode = 'IOLINK_AUTOSTART';
        }
        // Store previous mode for restore
        if (!self.cache.portPrevMode) self.cache.portPrevMode = {};
        self.cache.portPrevMode[portNum] = currentMode;
        console.log('[SMI] Port ' + portNum + ' POWER OFF (saving mode: ' + currentMode + ')');
        return self.setPortMode(portNum, 'DEACTIVATED');
      });
    } else {
      // Restore saved mode, fall back to IOLINK_AUTOSTART if unknown
      var restoreMode = (self.cache.portPrevMode && self.cache.portPrevMode[portNum])
        ? self.cache.portPrevMode[portNum]
        : 'IOLINK_AUTOSTART';
      console.log('[SMI] Port ' + portNum + ' POWER ON (restoring mode: ' + restoreMode + ')');
      return self.setPortMode(portNum, restoreMode);
    }
  }

  readISDU(portNum, index, subindex) {
    var alias = 'master1port' + portNum;
    var subPart = (subindex !== undefined && subindex !== null && Number(subindex) > 0)
      ? '/subindices/' + Number(subindex)
      : '';
    var url = '/iolink/v1/devices/' + alias + '/parameters/' + Number(index) + subPart + '/value?format=byteArray';
    return this.request('GET', url, null, 1500).then(function(res) {
      return res.data || {};
    });
  }

  writeISDU(portNum, index, subindex, dataBuffer) {
    var alias = 'master1port' + portNum;
    var subPart = (subindex !== undefined && subindex !== null && Number(subindex) > 0)
      ? '/subindices/' + Number(subindex)
      : '';
    var url = '/iolink/v1/devices/' + alias + '/parameters/' + Number(index) + subPart + '/value';
    var arrVal = Buffer.isBuffer(dataBuffer) ? Array.from(dataBuffer) : (Array.isArray(dataBuffer) ? dataBuffer : [dataBuffer]);
    return this.request('POST', url, { value: arrVal }, 1500).then(function(res) {
      return { success: (res.statusCode >= 200 && res.statusCode < 300), statusCode: res.statusCode, data: res.data || {} };
    });
  }

  readPD(portNum)  { return this.readProcessData(portNum); }

  // [1] Dynamic port type from cached portsStatus.statusInfo
  readProcessData(portNum) {
    var self = this;
    var now = Date.now();
    var lockUntil = self.cache.lastPdTime[portNum] || 0;
    if (self.cache.pd[portNum] && now < lockUntil)      return Promise.resolve(self.cache.pd[portNum]);
    if (self.cache.pd[portNum] && now - lockUntil < 60) return Promise.resolve(self.cache.pd[portNum]);

    // Get port info from cached ports status to determine URL
    var portInfo = self.cache.portsStatus
      ? self.cache.portsStatus.find(function(p) { return p.portNumber === portNum; })
      : null;

    var url = pdUrlForPort(portInfo || { portNumber: portNum, statusInfo: 'DEVICE_ONLINE' }, self.host);

    return self.request('GET', url, null, 300).then(function(res) {
      if (res && res.data) {
        self.cache.pd[portNum] = res.data;
        self.cache.lastPdTime[portNum] = Date.now();
        return res.data;
      }
      return self.cache.pd[portNum] || null;
    });
  }

  writePD(portNum, data) { return this.writeProcessData(portNum, data); }

  writeProcessData(portNum, data) {
    var self = this;
    var alias = 'master1port' + portNum;
    var payload;
    if (typeof data === 'boolean') {
      payload = { setData: { cqValue: data } };
      self.cache.pd[portNum] = { setData: { cqValue: data }, getData: { cqValue: data } };
      self.cache.lastPdTime[portNum] = Date.now() + 600;
    } else if (Array.isArray(data)) {
      payload = { ioLink: { valid: true, value: data } };
    } else {
      payload = data;
    }
    return self.request('POST', '/iolink/v1/devices/' + alias + '/processdata/value', payload, 500).then(function(res) {
      if (typeof data === 'boolean') {
        self.cache.pd[portNum] = { setData: { cqValue: data } };
        self.cache.lastPdTime[portNum] = Date.now();
      }
      return res.data || {};
    });
  }
}

const instance = new SmiEngine();
module.exports = instance;
module.exports.PORT_MODES    = PORT_MODES;
module.exports.BAUD_RATES    = BAUD_RATES;
module.exports.SMI_SERVICES  = SMI_SERVICES;
module.exports.PORT_STATUS   = PORT_STATUS;
module.exports.STANDARD_ISDU = STANDARD_ISDU;