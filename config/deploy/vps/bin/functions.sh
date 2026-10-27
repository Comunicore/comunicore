#!/bin/bash

# get exclusive lock for operation_name
# lock operation_name
function lock_operation() {
    local OPERATION_NAME="$1"
    if [[ -z "$OPERATION_NAME" ]];
    then
        echo "lock: operation name is empty" >&2
        exit 1
    fi

    LOCK_FILE="/tmp/${OPERATION_NAME}.lock"
    exec 9>"$LOCK_FILE"
    flock -n 9 || {
        echo "failed get lock for " >&2
        exit 1
    }
}
