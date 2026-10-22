#!/bin/bash
# copy deployment files to target directory
set -e

pushd . > /dev/null
cd "$( dirname "${BASH_SOURCE[0]}" )/../.."
PROJECT_ROOT="$(pwd)"
popd > /dev/null

function deploy_copy_files() {
    local DST_DIR="$1" # can be relative path
    if [ ! -d "$DST_DIR" ]; then
      echo "error: destination directory not exists: \"$DST_DIR\""
      exit 1
    fi

    pushd . > /dev/null
    cd "$DST_DIR"
    DST_DIR="$(pwd)"
    cd "$PROJECT_ROOT"
    mkdir -p "${DST_DIR}/backend/"{bin,conf} "${DST_DIR}/frontend"
    cp -a ./backend/internal/repository/migrations \
        ./backend/target/comunicore \
        ./backend/target/migrate "${DST_DIR}/backend/bin/"
    cp -a ./backend/config/server-config.toml "${DST_DIR}/backend/conf/"

    cp ./backend/config/comunicore.service "${DST_DIR}/"

    cp -a ./frontend/out/./ "${DST_DIR}/frontend"

    popd > /dev/null
}

function comunicore_source_tar_create() {
    git archive --format=tar.gz -o ../comunicore.tar.gz --prefix=comunicore/ HEAD
}
