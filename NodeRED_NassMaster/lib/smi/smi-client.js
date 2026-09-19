const net = require('net');
const EventEmitter = require('events');
const {
  SMI_SERVICES,
  PORT_MODES,
  BAUD_RATES,
  encodeSmiFrame,
  encodeIsduReadArgBlock,
  encodeIsduWriteArgBlock,
  decodeIsduResponse,
  decodeMasterIdentification,
  decodePortStatus
} = require('./smi-protocol');

/**
 * Production-grade SMI-over-TCP Client
 * Zero external dependencies, pure Node.js net.Socket
 */
class SmiClient extends EventEmitter {
  constructor(options = {}) {
    super();
    this.options = Object.assign({
      host: '192.168.1.100',
      port: 49000, // Default Nass Magnet port (alternative: 50000 or 4000)
      timeout: 3000,
      autoReconnect: false,
      reconnectInterval: 2000
    }, options);

    this.socket = null;
    this.isConnected = false;
    this._rxBuffer = Buffer.alloc(0);
    this._nextClientId = 1;
    this._pendingRequests = new Map(); // clientId -> { resolve, reject, timer }
  }

  /**
   * Connects to the IO-Link Master SMI-TCP server
   */
  connect(host, port) {
    if (host) this.options.host = host;
    if (port) this.options.port = port;

    return new Promise((resolve, reject) => {
      if (this.isConnected) {
        return resolve();
      }

      this.socket = new net.Socket();
      this.socket.setNoDelay(true); // Disable Nagle's algorithm for low-latency
      this.socket.setKeepAlive(true, 300); // Fast 300ms TCP keepalive for instant disconnect detection

      let connectTimeout = setTimeout(() => {
        if (!this.isConnected) {
          this.socket.destroy();
          reject(new Error(`Connection timeout to ${this.options.host}:${this.options.port}`));
        }
      }, this.options.timeout);

      this.socket.on('connect', () => {
        clearTimeout(connectTimeout);
        this.isConnected = true;
        this._rxBuffer = Buffer.alloc(0);
        this.emit('connected', { host: this.options.host, port: this.options.port });
        resolve();
      });

      this.socket.on('data', (chunk) => this._handleData(chunk));

      this.socket.on('error', (err) => {
        clearTimeout(connectTimeout);
        this.emit('error', err);
        this._rejectAllPending(err);
      });

      this.socket.on('close', (hadError) => {
        this.isConnected = false;
        this.emit('disconnected', { hadError });
        this._rejectAllPending(new Error('Connection closed by remote host'));
      });

      this.socket.connect(this.options.port, this.options.host);
    });
  }

  /**
   * Disconnects from the master
   */
  disconnect() {
    return new Promise((resolve) => {
      if (!this.socket || !this.isConnected) {
        return resolve();
      }
      this.socket.once('close', () => resolve());
      this.socket.end();
    });
  }

  /**
   * Internal framing buffer for handling TCP stream chunking
   */
  _handleData(chunk) {
    this._rxBuffer = Buffer.concat([this._rxBuffer, chunk]);

    while (this._rxBuffer.length >= 6) {
      // Header: Length(2B), ServiceID(2B), ClientID(1B), PortNum(1B)
      const lengthField = this._rxBuffer.readUInt16BE(0);
      
      // Check if lengthField represents length of remaining frame (Length = 4 + N)
      // or total packet size (6 + N). We handle standard SMI where total frame size is lengthField + 2:
      let totalFrameSize = lengthField + 2;
      if (lengthField >= 6 && lengthField === this._rxBuffer.length) {
        totalFrameSize = lengthField; // Vendor variation where length includes the 2 bytes of Length itself
      }

      if (totalFrameSize < 6) {
        totalFrameSize = 6;
      }

      if (this._rxBuffer.length < totalFrameSize) {
        // Need more TCP chunks to assemble complete frame
        break;
      }

      const frame = this._rxBuffer.slice(0, totalFrameSize);
      this._rxBuffer = this._rxBuffer.slice(totalFrameSize);

      this._dispatchFrame(frame);
    }
  }

  /**
   * Route incoming decoded frame
   */
  _dispatchFrame(frame) {
    if (!frame || frame.length < 6) return;
    const serviceId = frame.readUInt16BE(2);
    const clientId = frame.readUInt8(4);
    const portNum = frame.readUInt8(5);
    const payload = frame.slice(6);

    this.emit('rawFrame', { serviceId, clientId, portNum, payload });

    // 1. Pending Request Match
    if (this._pendingRequests.has(clientId)) {
      const { resolve, timer } = this._pendingRequests.get(clientId);
      clearTimeout(timer);
      this._pendingRequests.delete(clientId);
      resolve({ serviceId, portNum, payload });
      return;
    }

    // 2. Asynchronous notifications / Cyclic Process Data
    if (serviceId === SMI_SERVICES.PDE_PD_CYCLIC_IND) {
      this.emit('processData', { port: portNum, data: payload });
    } else if (serviceId === SMI_SERVICES.SM_PORT_EVENT_CNF) {
      this.emit('portEvent', { port: portNum, data: payload });
    }
  }

  /**
   * Low-level send request with Promise resolution based on ClientID
   */
  sendRequest(serviceId, portNum, payloadBuffer = Buffer.alloc(0), timeoutMs = null) {
    return new Promise((resolve, reject) => {
      if (!this.isConnected) {
        return reject(new Error('SMI client is not connected'));
      }

      const clientId = this._nextClientId;
      this._nextClientId = (this._nextClientId % 254) + 1;

      const frame = encodeSmiFrame(serviceId, clientId, portNum, payloadBuffer);
      const timeout = timeoutMs || this.options.timeout;

      const timer = setTimeout(() => {
        if (this._pendingRequests.has(clientId)) {
          this._pendingRequests.delete(clientId);
          this.isConnected = false;
          if (this.socket) this.socket.destroy();
          this.emit('disconnected', { reason: 'request_timeout' });
          reject(new Error(`SMI Request timeout (ServiceID: 0x${serviceId.toString(16)}, ClientID: ${clientId}, Port: ${portNum})`));
        }
      }, timeout);

      this._pendingRequests.set(clientId, { resolve, reject, timer });

      this.socket.write(frame, (err) => {
        if (err) {
          clearTimeout(timer);
          this._pendingRequests.delete(clientId);
          reject(err);
        }
      });
    });
  }

  _rejectAllPending(err) {
    for (const [clientId, req] of this._pendingRequests.entries()) {
      clearTimeout(req.timer);
      req.reject(err);
    }
    this._pendingRequests.clear();
  }

  // ==========================================
  // HIGH LEVEL APPLICATION INTERFACES
  // ==========================================

  /**
   * Read Master Identification (Vendor, Product, Port Count)
   */
  async readMasterIdentification() {
    const res = await this.sendRequest(SMI_SERVICES.SM_MASTER_IDENTIFICATION_REQ, 0);
    return decodeMasterIdentification(res.payload);
  }

  /**
   * Read Port Status & Link Mode (Port 1..N)
   */
  async readPortStatus(portNum) {
    const res = await this.sendRequest(SMI_SERVICES.SM_PORT_STATUS_REQ, portNum);
    return decodePortStatus(res.payload);
  }

  /**
   * Read Acyclic Parameter (ISDU)
   * @param {number} portNum - 1..N
   * @param {number} index - 0x0002 .. 0xFFFF
   * @param {number} subindex - 0..255
   */
  async readISDU(portNum, index, subindex = 0) {
    const argBlock = encodeIsduReadArgBlock(index, subindex);
    const res = await this.sendRequest(SMI_SERVICES.DL_READ_PARAM_REQ, portNum, argBlock);
    return decodeIsduResponse(res.payload);
  }

  /**
   * Write Acyclic Parameter (ISDU)
   * @param {number} portNum - 1..N
   * @param {number} index - 0x0002 .. 0xFFFF
   * @param {number} subindex - 0..255
   * @param {Buffer} dataBuffer - Raw binary payload
   */
  async writeISDU(portNum, index, subindex, dataBuffer) {
    const argBlock = encodeIsduWriteArgBlock(index, subindex, dataBuffer);
    const res = await this.sendRequest(SMI_SERVICES.DL_WRITE_PARAM_REQ, portNum, argBlock);
    return decodeIsduResponse(res.payload);
  }

  /**
   * Read Process Data Inputs (PDI)
   */
  async readProcessData(portNum) {
    const res = await this.sendRequest(SMI_SERVICES.PDE_READ_PD_IN_REQ, portNum);
    return res.payload;
  }

  /**
   * Write Process Data Outputs (PDO)
   */
  async writeProcessData(portNum, dataBuffer) {
    const res = await this.sendRequest(SMI_SERVICES.PDE_WRITE_PD_OUT_REQ, portNum, dataBuffer);
    return res.payload;
  }

  /**
   * Configure Port Mode and Baud Rate
   */
  async setPortConfig(portNum, mode = PORT_MODES.IOLINK_AUTOSTART, baudRate = BAUD_RATES.COM3) {
    const argBlock = Buffer.alloc(2);
    argBlock.writeUInt8(mode, 0);
    argBlock.writeUInt8(baudRate, 1);
    const res = await this.sendRequest(SMI_SERVICES.SM_PORT_CONFIGURATION_REQ, portNum, argBlock);
    return res.payload;
  }
}

module.exports = SmiClient;
