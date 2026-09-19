/**
 * SMI Protocol Definitions, Frame Serializer and ArgBlock Encoders/Decoders
 * Standardized Master Interface (SMI / SMI-TCP) for IO-Link v1.1.3 (IEC 61131-9)
 * Compatible with TEConcept / TMG stack and Nass Magnet masters.
 */

// Service Classes & IDs
const SMI_SERVICES = {
  // System Management (SM)
  SM_MASTER_IDENTIFICATION_REQ: 0x0100,
  SM_MASTER_IDENTIFICATION_CNF: 0x8100,
  SM_MASTER_CONFIGURATION_REQ:  0x0101,
  SM_MASTER_CONFIGURATION_CNF:  0x8101,
  SM_PORT_CONFIGURATION_REQ:    0x0102,
  SM_PORT_CONFIGURATION_CNF:    0x8102,
  SM_PORT_STATUS_REQ:           0x0103,
  SM_PORT_STATUS_CNF:           0x8103,
  SM_PORT_EVENT_REQ:            0x0104,
  SM_PORT_EVENT_CNF:            0x8104,

  // Data Link / ISDU (On-request Data)
  DL_READ_PARAM_REQ:            0x0200, // ISDU Read
  DL_READ_PARAM_CNF:            0x8200,
  DL_WRITE_PARAM_REQ:           0x0201, // ISDU Write
  DL_WRITE_PARAM_CNF:           0x8201,

  // Process Data Engine (PDE)
  PDE_READ_PD_IN_REQ:           0x0300,
  PDE_READ_PD_IN_CNF:           0x8300,
  PDE_WRITE_PD_OUT_REQ:         0x0301,
  PDE_WRITE_PD_OUT_CNF:         0x8301,
  PDE_PD_CYCLIC_IND:            0x0302  // Asynchronous Cyclic Process Data stream
};

// Port Modes per IEC 61131-9
const PORT_MODES = {
  DEACTIVATED:      0x00,
  IOLINK_AUTOSTART: 0x01,
  IOLINK_MANUAL:    0x02,
  DIGITAL_INPUT:    0x03,
  DIGITAL_OUTPUT:   0x04
};

// Baud Rates
const BAUD_RATES = {
  COM1: 0x01, // 4.8 kBaud
  COM2: 0x02, // 38.4 kBaud
  COM3: 0x03  // 230.4 kBaud
};

// Port Link States (PortStatus / PortMode)
const PORT_STATUS = {
  NO_COMMUNICATION: 0x00,
  PORT_OPERATE:     0x01,
  COMM_LOST:        0x02,
  REVISION_FAULT:   0x03,
  COMP_FAULT:       0x04
};

// Standard ISDU Indices (Direct Parameter Page & Identification)
const STANDARD_ISDU = {
  // Direct Parameter Page 1
  MASTER_CYCLE_TIME: 0x0000,
  MIN_CYCLE_TIME:    0x0002,
  M_SEQ_CAPABILITY:  0x0003,
  REVISION_ID:       0x0004,
  PROCESS_DATA_IN:   0x0005,
  PROCESS_DATA_OUT:  0x0006,
  VENDOR_ID_HIGH:    0x0007,
  VENDOR_ID_LOW:     0x0008,
  DEVICE_ID_1:       0x0009,
  DEVICE_ID_2:       0x000A,
  DEVICE_ID_3:       0x000B,

  // Standard Device Identification (ISDU 16 - 24)
  VENDOR_NAME:       0x0010,
  VENDOR_TEXT:       0x0011,
  PRODUCT_NAME:      0x0012,
  PRODUCT_ID:        0x0013,
  PRODUCT_TEXT:      0x0014,
  SERIAL_NUMBER:     0x0015,
  HARDWARE_REVISION: 0x0016,
  FIRMWARE_REVISION: 0x0017,
  APPLICATION_TAG:   0x0018,
  ERROR_COUNT:       0x0020
};

/**
 * Encodes a complete SMI Binary Packet
 * Frame: Length(2B) + ServiceID(2B) + ClientID(1B) + PortNum(1B) + Payload(NB)
 */
function encodeSmiFrame(serviceId, clientId, portNum, payloadBuffer = Buffer.alloc(0)) {
  const payloadLen = payloadBuffer.length;
  // Standard frame length = remaining bytes: ServiceID(2) + ClientID(1) + PortNum(1) + Payload(N) = 4 + N
  const frameLen = 4 + payloadLen;
  const frame = Buffer.alloc(6 + payloadLen);

  frame.writeUInt16BE(frameLen, 0);       // Length
  frame.writeUInt16BE(serviceId, 2);      // ServiceID
  frame.writeUInt8(clientId, 4);          // ClientID / SequenceID
  frame.writeUInt8(portNum, 5);           // Port Number (0 = Master, 1..N = Ports)
  
  if (payloadLen > 0) {
    payloadBuffer.copy(frame, 6);
  }

  return frame;
}

/**
 * Encodes an ISDU Read Request ArgBlock
 */
function encodeIsduReadArgBlock(index, subindex) {
  const buf = Buffer.alloc(3);
  buf.writeUInt16BE(index, 0);
  buf.writeUInt8(subindex, 2);
  return buf;
}

/**
 * Encodes an ISDU Write Request ArgBlock
 */
function encodeIsduWriteArgBlock(index, subindex, dataBuffer) {
  const len = dataBuffer.length;
  const buf = Buffer.alloc(4 + len);
  buf.writeUInt16BE(index, 0);
  buf.writeUInt8(subindex, 2);
  buf.writeUInt8(len, 3);
  dataBuffer.copy(buf, 4);
  return buf;
}

/**
 * Decodes an ISDU Response ArgBlock
 * Header: status (1B), errorCode (2B), dataLength (1B), data (NB)
 */
function decodeIsduResponse(payloadBuffer) {
  if (!payloadBuffer || payloadBuffer.length < 4) {
    throw new Error(`Invalid ISDU response payload length: ${payloadBuffer ? payloadBuffer.length : 0}`);
  }
  const status = payloadBuffer.readUInt8(0);
  const errorCode = payloadBuffer.readUInt16BE(1);
  const dataLength = payloadBuffer.readUInt8(3);
  const data = payloadBuffer.slice(4, 4 + dataLength);

  return {
    success: status === 0,
    status,
    errorCode,
    dataLength,
    data,
    dataHex: data.toString('hex'),
    dataAscii: data.toString('utf8').replace(/[^\x20-\x7E]/g, '')
  };
}

/**
 * Decodes Master Identification Response ArgBlock
 */
function decodeMasterIdentification(payloadBuffer) {
  if (!payloadBuffer || payloadBuffer.length < 2) {
    return { raw: payloadBuffer ? payloadBuffer.toString('hex') : '' };
  }
  const portCount = payloadBuffer.readUInt8(0);
  return {
    portCount,
    rawPayload: payloadBuffer.toString('hex'),
    asciiPayload: payloadBuffer.toString('utf8').replace(/[^\x20-\x7E]/g, ' ').trim()
  };
}

/**
 * Decodes Port Status Response ArgBlock
 */
function decodePortStatus(payloadBuffer) {
  if (!payloadBuffer || payloadBuffer.length < 2) {
    return { status: 'UNKNOWN' };
  }
  const portMode = payloadBuffer.readUInt8(0);
  const portStatus = payloadBuffer.readUInt8(1);
  const baudRate = payloadBuffer.length > 2 ? payloadBuffer.readUInt8(2) : null;

  return {
    portMode,
    portStatus,
    baudRate,
    isOperate: portStatus === PORT_STATUS.PORT_OPERATE
  };
}

module.exports = {
  SMI_SERVICES,
  PORT_MODES,
  BAUD_RATES,
  PORT_STATUS,
  STANDARD_ISDU,
  encodeSmiFrame,
  encodeIsduReadArgBlock,
  encodeIsduWriteArgBlock,
  decodeIsduResponse,
  decodeMasterIdentification,
  decodePortStatus
};
