#!/bin/bash
# ~comunicore/bin/deploy_test.sh
# vps deploy test instance
# $1 - instance name
set -euo pipefail
SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
# PROJECT_ROOT="$(cd -- "$SCRIPT_DIR/../../../.." && pwd)"

cd "$SCRIPT_DIR"
. ./deploy_functions.sh
. ./functions.sh

INSTANCE_NAME="$1"
HOME_DIR="/home/comunicore"
APP_INSTANCE_DIR="${HOME_DIR}/app_test/${INSTANCE_NAME}"

echo "=== instance name is \"${INSTANCE_NAME}\""
echo "=== app work dir is \"${APP_INSTANCE_DIR}\""

lock_operation "comunicore_deploy_test_${INSTANCE_NAME}"

test_instance_name_check "${INSTANCE_NAME}"
service_comunicore_testing_stop "${INSTANCE_NAME}"
app_dir_clear "${APP_INSTANCE_DIR}"
mkdir -p "${APP_INSTANCE_DIR}"
archive_read "${APP_INSTANCE_DIR}"
cd "$APP_INSTANCE_DIR";
archive_extract "${APP_INSTANCE_DIR}"
distributive_files_copy_to_dst_dir "${APP_INSTANCE_DIR}"
upload_dir_hardlink "${APP_INSTANCE_DIR}"
db_drop_tables "db_${INSTANCE_NAME}" "comunicore_test"
db_drop_functions "db_${INSTANCE_NAME}" "comunicore_test"
db_load_from_production "db_${INSTANCE_NAME}" comunicore_test
service_comunicore_testing_start "${INSTANCE_NAME}"

echo "=== deploy finished ==="
