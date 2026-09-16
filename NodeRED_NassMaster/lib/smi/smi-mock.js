const net = require('net');
const {
  SMI_SERVICES,
  PORT_MODES,
  BAUD_RATES,
  PORT_STATUS,
  STANDARD_ISDU,
  encodeSmiFrame
} = require('./smi-protocol');

/**
 * Local SMI-TCP Mock Server
 * Simulates a Nass Magnet / TEConcept IO-Link Master for standalone verification
 */
class SmiMockServer {
  constructor(port = 49000) {
    this.port = port;
    this.server = null;
    this.devices = {
      1: {
        vendorId: 0x0123,
        deviceId: 0x0456,
        vendorName: 'Nass Magnet GmbH',
        productName: 'Smart IO-Link Valve Terminal',
        serialNumber: 'NM-2026-X99',
        firmwareRev: 'v1.1.3'
      }
    };
  }

  start() {
    return new Promise((resolve, reject) => {
      this.server = net.createServer((socket) => {
        let rxBuffer = Buffer.alloc(0);

        socket.on('data', (chunk) => {
          rxBuffer = Buffer.concat([rxBuffer, chunk]);

          while (rxBuffer.length >= 6) {
            const lengthField = rxBuffer.readUInt16BE(0);
            const totalFrameSize = lengthField + 2;

            if (rxBuffer.length < totalFrameSize) break;

            const frame = rxBuffer.slice(0, totalFrameSize);
            rxBuffer = rxBuffer.slice(totalFrameSize);

            this._handleFrame(socket, frame);
          }
        });
      });

      this.server.listen(this.port, '127.0.0.1', () => {
        resolve();
      });

      this.server.on('error', reject);
    });
  }

  stop() {
    return new Promise((resolve) => {
      if (this.server) {
        this.server.close(resolve);
      } else {
        resolve();
      }
    });
  }

  _handleFrame(socket, frame) {
    const serviceId = frame.readUInt16BE(2);
    const clientId = frame.readUInt8(4);
    const portNum = frame.readUInt8(5);
    const payload = frame.slice(6);

    let responseServiceId = serviceId | 0x8000;
    let responsePayload = Buffer.alloc(0);

    switch (serviceId) {
      case SMI_SERVICES.SM_MASTER_IDENTIFICATION_REQ: {
        // Port count = 4, followed by Vendor string
        const vendorText = Buffer.from('Nass Magnet IO-Link Master 4-Port');
        responsePayload = Buffer.alloc(1 + vendorText.length);
        responsePayload.writeUInt8(4, 0); // 4 physical ports
        vendorText.copy(responsePayload, 1);
        break;
      }

      case SMI_SERVICES.SM_PORT_STATUS_REQ: {
        // PortMode(1B), PortStatus(1B), BaudRate(1B)
        responsePayload = Buffer.alloc(3);
        responsePayload.writeUInt8(PORT_MODES.IOLINK_AUTOSTART, 0);
        // If port 1, simulate OPERATE, otherwise NO_COMMUNICATION
        responsePayload.writeUInt8(portNum === 1 ? PORT_STATUS.PORT_OPERATE : PORT_STATUS.NO_COMMUNICATION, 1);
        responsePayload.writeUInt8(BAUD_RATES.COM3, 2);
        break;
      }

      case SMI_SERVICES.DL_READ_PARAM_REQ: {
        // payload: index (2B), subindex (1B)
        const index = payload.readUInt16BE(0);
        const subindex = payload.readUInt8(2);

        let status = 0; // Success
        let errCode = 0;
        let data = Buffer.alloc(0);

        const dev = this.devices[portNum];
        if (!dev) {
          status = 1; // Error
          errCode = 0x8011; // Device not present / port empty
        } else if (index === STANDARD_ISDU.VENDOR_NAME) {
          data = Buffer.from(dev.vendorName);
        } else if (index === STANDARD_ISDU.PRODUCT_NAME) {
          data = Buffer.from(dev.productName);
        } else if (index === STANDARD_ISDU.SERIAL_NUMBER) {
          data = Buffer.from(dev.serialNumber);
        } else if (index === STANDARD_ISDU.FIRMWARE_REVISION) {
          data = Buffer.from(dev.firmwareRev);
        } else {
          // generic 4-byte dummy response
          data = Buffer.from([0xAA, 0xBB, 0xCC, 0xDD]);
        }

        // ISDU Response Header: status (1B), errorCode (2B), dataLength (1B), data (NB)
        responsePayload = Buffer.alloc(4 + data.length);
        responsePayload.writeUInt8(status, 0);
        responsePayload.writeUInt16BE(errCode, 1);
        responsePayload.writeUInt8(data.length, 3);
        if (data.length > 0) data.copy(responsePayload, 4);
        break;
      }

      case SMI_SERVICES.PDE_READ_PD_IN_REQ: {
        // 2 bytes of simulated process data (e.g. pressure/valve sensor reading)
        responsePayload = Buffer.from([0x01, 0x90]); // e.g. 400 decimal
        break;
      }

      case SMI_SERVICES.PDE_WRITE_PD_OUT_REQ: {
        // Acknowledge output process data written
        responsePayload = Buffer.from([0x00]); // Success
        break;
      }

      default:
        responsePayload = Buffer.from([0x00]);
        break;
    }

    const responseFrame = encodeSmiFrame(responseServiceId, clientId, portNum, responsePayload);
    socket.write(responseFrame);
  }
}

module.exports = SmiMockServer;
