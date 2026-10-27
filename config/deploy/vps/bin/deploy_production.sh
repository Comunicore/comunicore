#!/bin/bash
# ~comunicore/bin/deploy_test.sh
# vps deploy production
set -euo pipefail
SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
# PROJECT_ROOT="$(cd -- "$SCRIPT_DIR/../../../.." && pwd)"

. "$SCRIPT_DIR/functions.sh"
. "$SCRIPT_DIR/deploy_functions.sh"

# cd "$PROJECT_ROOT"

HOME_DIR="/home/comunicore"
APP_WORK_DIR="${HOME_DIR}/app"

cd "$HOME_DIR"
lock_operation "comunicore_deploy_production"

TMP_DIR="$(mktemp -d ${HOME_DIR}/tmp.XXXXXXXX)"
function cleanup() {
  rm -rf -- "$TMP_DIR"
}
trap cleanup EXIT

archive_read "${TMP_DIR}"
archive_extract "${TMP_DIR}"
service_file_check "${TMP_DIR}"
service_comunicore_production_stop
app_dir_clear "${APP_WORK_DIR}"

mv "${TMP_DIR}" "${APP_WORK_DIR}"
chmod 755 "${APP_WORK_DIR}"
cd "$APP_WORK_DIR"
distributive_files_copy_to_dst_dir "${APP_WORK_DIR}"
upload_dir_symlink "${APP_WORK_DIR}"
service_comunicore_production_start

echo '=== comunicore production started ==='
