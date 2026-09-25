#!/usr/bin/env bash
set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$PROJECT_DIR"

command -v lb >/dev/null 2>&1 || {
  echo "Install live-build first: sudo apt update && sudo apt install live-build"
  exit 1
}

mkdir -p config/includes.chroot/opt/stormradar
cp "$PROJECT_DIR/../index.html" config/includes.chroot/opt/stormradar/index.html
cp "$PROJECT_DIR/../styles.css" config/includes.chroot/opt/stormradar/styles.css
cp "$PROJECT_DIR/../app.js" config/includes.chroot/opt/stormradar/app.js

lb clean --purge
lb config \
  --distribution bookworm \
  --architectures amd64 \
  --binary-images iso-hybrid \
  --archive-areas "main contrib non-free-firmware" \
  --debian-installer false \
  --bootappend-live "boot=live components quiet splash"

lb build
mv live-image-amd64.hybrid.iso stormradar-live.iso
echo "Created: $PROJECT_DIR/stormradar-live.iso"