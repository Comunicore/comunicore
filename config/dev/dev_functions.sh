#!/bin/bash

set -e

pushd . > /dev/null
cd "$( dirname "${BASH_SOURCE[0]}" )/../.."
PROJECT_ROOT="$(pwd)"
popd > /dev/null

# Copy frontend out files to the destination directory for deployment
# Parameters:
#   $1: destination directory (can be relative path)
#   $2: project root directory (can be relative path)
# example: frontend_copy_files "./deploy/comunicore" "./"
function frontend_copy_files() {
    local DST_DIR="$1" # can be relative path
    local PROJECT_ROOT_DIR="$2" # can be relative path
    if [ ! -d "$DST_DIR" ]; then
      echo "error: destination directory not exists: \"$DST_DIR\""
      exit 1
    fi
    if [ ! -d "$PROJECT_ROOT_DIR" ]; then
      echo "error: project root directory not exists: \"$PROJECT_ROOT_DIR\""
      exit 1
    fi

    pushd . > /dev/null
    cd "$DST_DIR"
    DST_DIR="$(pwd)"
    popd > /dev/null
    pushd . > /dev/null
    cd "$PROJECT_ROOT_DIR"
    PROJECT_ROOT_DIR="$(pwd)"
    popd > /dev/null

    pushd . > /dev/null
    cd "$PROJECT_ROOT_DIR"
    mkdir -p "${DST_DIR}/frontend"
    cp -a ./frontend/out/./ "${DST_DIR}/frontend"
    popd > /dev/null
}

# Copy backend build files to the destination directory for deployment
# Parameters:
#   $1: destination directory (can be relative path)
#   $2: project root directory (can be relative path)
# example: backend_copy_files "./deploy/comunicore" "./"
function backend_copy_files() {
    local DST_DIR="$1" # can be relative path
    local PROJECT_ROOT_DIR="$2" # can be relative path
    if [ ! -d "$DST_DIR" ]; then
      echo "error: destination directory not exists: \"$DST_DIR\""
      exit 1
    fi
    if [ ! -d "$PROJECT_ROOT_DIR" ]; then
      echo "error: project root directory not exists: \"$PROJECT_ROOT_DIR\""
      exit 1
    fi

    pushd . > /dev/null
    cd "$DST_DIR"
    DST_DIR="$(pwd)"
    popd > /dev/null
    pushd . > /dev/null
    cd "$PROJECT_ROOT_DIR"
    PROJECT_ROOT_DIR="$(pwd)"
    popd > /dev/null

    pushd . > /dev/null
    cd "$PROJECT_ROOT_DIR"
    # cp -a ./backend/target/comunicore "${DST_DIR}/backend/"
    mkdir -p "${DST_DIR}/backend/"{bin,conf}
    cp -a ./backend/internal/repository/migrations \
        ./backend/target/comunicore \
        ./backend/target/migrate "${DST_DIR}/backend/bin/"
    cp -a ./backend/config/server-config.toml "${DST_DIR}/backend/conf/"
    cp ./backend/config/comunicore.service "${DST_DIR}/"
    popd > /dev/null
}

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
    git archive --format=tar.gz -o ../comunicore_src.tar.gz --prefix=comunicore/ HEAD
}
