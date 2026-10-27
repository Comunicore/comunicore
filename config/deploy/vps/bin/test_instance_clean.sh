#!/bin/bash
# ~comunicore/bin/test_instance_clean.sh
# vps clean directory and db after test instance stopped
# $1 - instance name

set -euo pipefail
SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
# PROJECT_ROOT="$(cd -- "$SCRIPT_DIR/../../../.." && pwd)"

. "$SCRIPT_DIR/deploy_functions.sh"
. "$SCRIPT_DIR/functions.sh"

INSTANCE_NAME="$1"
HOME_DIR="/home/comunicore"
APP_INSTANCE_DIR="${HOME_DIR}/app_test/${INSTANCE_NAME}"

lock_operation "comunicore_deploy_test_${INSTANCE_NAME}"

test_instance_name_check "${INSTANCE_NAME}"
app_dir_clear "${APP_INSTANCE_DIR}"
db_drop_tables "db_${INSTANCE_NAME}" "comunicore_test"
db_drop_functions "db_${INSTANCE_NAME}" "comunicore_test"
