#!/usr/bin/env bash
set -euo pipefail

APP_DIR="${1:-}"
GTPLWEB_REPO="${GTPLWEB_REPO:-https://github.com/garag-lib/GTPLWeb.git}"
GTPLWEB_REF="${GTPLWEB_REF:-main}"
GTPLWEB_DEP="${GTPLWEB_DEP:-github:garag-lib/GTPLWeb}"
GTPL_DEP="${GTPL_DEP:-github:garag-lib/GTPL}"
TMP_DIR="$(mktemp -d)"

cleanup() {
  rm -rf "${TMP_DIR}"
}
trap cleanup EXIT

if [ -z "${APP_DIR}" ]; then
  echo "GTPLWeb project bootstrap (git-only)"
  read -r -p "App name [gtplweb-app]: " APP_NAME
  APP_NAME="${APP_NAME:-gtplweb-app}"

  read -r -p "Target directory [./${APP_NAME}]: " TARGET_INPUT
  TARGET_INPUT="${TARGET_INPUT:-./${APP_NAME}}"

  APP_DIR="${TARGET_INPUT}"
fi

echo "Creating project in: ${APP_DIR}"
mkdir -p "${APP_DIR}"

if [ -n "$(ls -A "${APP_DIR}" 2>/dev/null || true)" ]; then
  echo "Error: target directory not empty: ${APP_DIR}" >&2
  exit 1
fi

git clone --depth 1 --branch "${GTPLWEB_REF}" "${GTPLWEB_REPO}" "${TMP_DIR}/GTPLWeb"
node "${TMP_DIR}/GTPLWeb/tools/init-app.js" "${APP_DIR}"

node <<EOF
const fs = require('fs');
const p = '${APP_DIR}/package.json';
const j = JSON.parse(fs.readFileSync(p, 'utf8'));
j.dependencies = j.dependencies || {};
j.dependencies['@mpeliz/gtplweb'] = '${GTPLWEB_DEP}';
j.dependencies['@mpeliz/gtpl'] = '${GTPL_DEP}';
j.devDependencies = j.devDependencies || {};
j.devDependencies['typescript'] = '^5.9.3';
fs.writeFileSync(p, JSON.stringify(j, null, 2) + '\\n');
EOF

cat <<TXT

Done.
Next:
  cd ${APP_DIR}
  npm install
  npm run build:structured
  npm run server
TXT
