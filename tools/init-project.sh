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

prompt() {
  local message="$1"
  local default_value="${2:-}"
  local answer=""
  local tty="/dev/tty"
  if [ ! -r "${tty}" ]; then
    echo "${default_value}"
    return
  fi
  if read -r -p "${message} [${default_value}]: " answer < "${tty}" 2>/dev/null; then
    if [ -n "${answer}" ]; then
      echo "${answer}"
    else
      echo "${default_value}"
    fi
  else
    echo "${default_value}"
  fi
}

if [ -z "${APP_DIR}" ]; then
  echo "GTPLWeb project bootstrap (git-only)"
  APP_NAME="$(prompt "App name" "gtplweb-app")"
  TARGET_INPUT="$(prompt "Target directory" "./${APP_NAME}")"

  APP_DIR="${TARGET_INPUT}"
fi

APP_BASENAME="$(basename "${APP_DIR:-gtplweb-app}")"
DEFAULT_YEAR="$(date +%Y)"
APP_DESCRIPTION="$(prompt "Description" "GTPLWeb app: ${APP_BASENAME}")"
APP_AUTHOR="$(prompt "Author" "")"
APP_LICENSE="$(prompt "License" "MIT")"
APP_COPYRIGHT_HOLDER="$(prompt "Copyright holder" "${APP_AUTHOR}")"
APP_COPYRIGHT_YEAR="$(prompt "Copyright year" "${DEFAULT_YEAR}")"

echo "Creating project in: ${APP_DIR}"
mkdir -p "${APP_DIR}"

if [ -n "$(ls -A "${APP_DIR}" 2>/dev/null || true)" ]; then
  echo "Error: target directory not empty: ${APP_DIR}" >&2
  exit 1
fi

git clone --depth 1 --branch "${GTPLWEB_REF}" "${GTPLWEB_REPO}" "${TMP_DIR}/GTPLWeb"
node "${TMP_DIR}/GTPLWeb/tools/init-app.js" "${APP_DIR}" \
  --yes \
  --description "${APP_DESCRIPTION}" \
  --author "${APP_AUTHOR}" \
  --license "${APP_LICENSE}" \
  --copyright-holder "${APP_COPYRIGHT_HOLDER}" \
  --copyright-year "${APP_COPYRIGHT_YEAR}"

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
  npm run build:bundle-split
  npm run server
TXT
