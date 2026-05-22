#!/usr/bin/env bash
set -euo pipefail

APP_DIR="${1:-gtplweb-app}"
PKG_SOURCE="${GTPLWEB_PKG_SOURCE:-@mpeliz/gtplweb}"

echo "Creating project in: ${APP_DIR}"
mkdir -p "${APP_DIR}"

if [ -n "$(ls -A "${APP_DIR}" 2>/dev/null || true)" ]; then
  echo "Error: target directory not empty: ${APP_DIR}" >&2
  exit 1
fi

npx --yes --package "${PKG_SOURCE}" gtpl-init "${APP_DIR}"

cat <<TXT

Done.
Next:
  cd ${APP_DIR}
  npm install
  npm run build:structured
  npm run server
TXT
