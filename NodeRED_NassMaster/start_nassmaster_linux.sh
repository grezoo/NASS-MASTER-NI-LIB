#!/usr/bin/env bash
# ============================================================
# PROJECT:     NASSMASTER
# DESCRIPTION: 100% Portable Pendrive IO-Link SCADA Runtime
# ENVIRONMENT: Zero-Footprint (Nothing saved/read outside pendrive)
# ============================================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="${SCRIPT_DIR}/Projects/NASSMASTER"
NODE_MODULES_DIR="${SCRIPT_DIR}/node_modules"

echo "============================================================"
echo "      NASSMASTER ZERO-FOOTPRINT PENDRIVE RUNTIME (LINUX)    "
echo "============================================================"
echo "USB Root:    ${SCRIPT_DIR}"
echo "Project Dir: ${PROJECT_DIR}"
echo ""

# 1. Hermetic Isolation: Lock NODE_PATH strictly to USB drive
export NODE_PATH="${NODE_MODULES_DIR}"
export NPM_CONFIG_CACHE="${PROJECT_DIR}/Data/.npm_cache"
export TMPDIR="/tmp"

# 2. Find Node.js engine (bundled on USB or host binary)
if [ -x "${SCRIPT_DIR}/node" ]; then
    NODE_BIN="${SCRIPT_DIR}/node"
    echo "[INFO] Using USB bundled Node binary: ${NODE_BIN}"
elif command -v node >/dev/null 2>&1; then
    NODE_BIN="$(command -v node)"
    echo "[INFO] Using Host Node binary (in-memory execution): ${NODE_BIN}"
else
    echo "[ERROR] Node.js engine not found! Install nodejs on host or place standalone node binary on USB root."
    exit 1
fi

# 3. Verify Node-RED CLI on USB drive
RED_CLI="${NODE_MODULES_DIR}/node-red/red.js"
if [ ! -f "${RED_CLI}" ]; then
    if command -v node-red >/dev/null 2>&1; then
        RED_CLI="$(command -v node-red)"
    else
        echo "[ERROR] Node-RED runtime not found on USB drive (${RED_CLI})!"
        exit 1
    fi
fi

# 4. Clean up any stale port 1880 process if needed
fuser -k 1880/tcp >/dev/null 2>&1 || true

echo "[INFO] Launching isolated Node-RED engine from USB..."
echo "[INFO] All configs/flows strictly locked to: ${PROJECT_DIR}"

# Launch strictly bound to USB directory (--userDir)
"${NODE_BIN}" "${RED_CLI}" --userDir "${PROJECT_DIR}" --port 1880 --title "NASSMASTER Runtime (USB)" &
NODE_PID=$!

echo "[INFO] Initializing server on port 1880..."
sleep 2

# Open browser if GUI is active
if command -v xdg-open >/dev/null 2>&1; then
    xdg-open "http://localhost:1880/ui" >/dev/null 2>&1 &
fi

echo "============================================================"
echo " NASSMASTER RUNNING (PID: ${NODE_PID}). Press CTRL+C to stop."
echo " UI Dashboard: http://localhost:1880/ui"
echo " Zero-Footprint Active: Host disk untouched."
echo "============================================================"

# Trap SIGINT / SIGTERM to cleanly kill background process on exit
cleanup() {
    echo ""
    echo "[INFO] Stopping NASSMASTER (PID: ${NODE_PID})..."
    kill -TERM "${NODE_PID}" 2>/dev/null || true
    wait "${NODE_PID}" 2>/dev/null || true
    echo "[OK] NASSMASTER stopped. Host clean."
    exit 0
}

trap cleanup INT TERM

wait ${NODE_PID}
