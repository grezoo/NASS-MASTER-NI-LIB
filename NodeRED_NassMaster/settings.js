/**
 * NASSMASTER Industrial IO-Link SCADA - Portable Node-RED Settings
 * Optimized for USB Flash Drive / Pendrive Execution
 */
const path = require('path');

module.exports = {
    // Flow configuration
    flowFile: 'flows.json',
    flowFilePretty: true,

    // Web UI and API Port
    uiPort: process.env.PORT || 1880,
    uiHost: '0.0.0.0',

    // Runtime directory (local to pendrive root)
    userDir: __dirname,

    // Diagnostic Dashboard Configuration
    httpAdminRoot: '/',
    httpNodeRoot: '/',
    httpStatic: path.join(__dirname, 'public'),

    // Field Diagnostics: No password required on portable USB
    adminAuth: null,

    // Offline / Air-Gapped Industrial Environment Settings
    telemetry: false,
    externalModules: {
        autoInstall: false,
        palette: {
            allowInstall: true,
            allowUpload: true
        }
    },

    // In-memory (RAM) default for high-speed IO-Link telemetry (IEC 61131-3)
    // Retentive storage ('store') for persistent configurations & PLC rules
    contextStorage: {
        default: {
            module: 'memory'
        },
        memory: {
            module: 'memory'
        },
        store: {
            module: 'localfilesystem',
            config: {
                dir: path.join(__dirname, 'context')
            }
        }
    },

    // Logging
    logging: {
        console: {
            level: "info",
            metrics: false,
            audit: false
        }
    },

    // Export variables
    functionGlobalContext: {
        master_ip: "192.168.23.100",
        plc_running: true
    }
};
