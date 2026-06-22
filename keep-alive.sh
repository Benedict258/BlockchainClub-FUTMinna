#!/bin/bash
cd /home/ubuntu/Workspace/BlockchainClub-FUTMinna
while true; do
  echo "[$(date)] Starting vite on port 5177..."
  NODE_OPTIONS="--max-old-space-size=4096" node node_modules/vite/bin/vite.js --host 0.0.0.0 --port 5177 2>&1
  echo "[$(date)] Vite exited. Restarting in 3s..."
  sleep 3
done
