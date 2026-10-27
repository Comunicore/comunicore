#!/bin/bash

function test_instance_name_check() {
  local INSTANCE_NAME="$1"
  if [[ -z "$INSTANCE_NAME" ]];
  then
      echo "!!! error: test_instance_name_check got empty instance name" >&2
      exit 1
  fi

  case "${INSTANCE_NAME:-}" in
    test)
        echo "will deploy \"test\" instance"
        ;;
    narzan)
        echo "will deploy \"narzan\" instance"
        ;;
    barbaris)
        echo "will deploy \"barbaris\" instance"
        ;;
    *)
        echo "usage: $0 test|narzan|barbaris"
        exit 1
        ;;
  esac
}
function service_comunicore_production_start() {
  systemctl start "comunicore.service"
  echo "=== started comunicore production service ==="
}
function service_comunicore_production_stop() {
  systemctl stop "comunicore.service"

  echo "== comunicore production service stopped ... OK"
}

# start comunicore_test@${INSTANCE_NAME}.service
function service_comunicore_testing_start() {
  local INSTANCE_NAME="$1"
  if [[ -z "$INSTANCE_NAME" ]];
  then
      echo "!!! error: service_comunicore_testing_start got empty instance name" >&2
      exit 1
  fi
  systemctl start "comunicore_test@${INSTANCE_NAME}.service"
  echo "=== starting test instance ${INSTANCE_NAME} ==="
}
# stop comunicore_test@${INSTANCE_NAME}.service
function service_comunicore_testing_stop() {
  local INSTANCE_NAME="$1"
  if [[ -z "$INSTANCE_NAME" ]];
  then
      echo "!!! error: service_comunicore_testing_stop got empty instance name" >&2
      exit 1
  fi
  systemctl stop "comunicore_test@${INSTANCE_NAME}.service"

  echo "== previous service version stopped ... OK"
}
function app_dir_clear() {
  local APP_WORK_DIR="$1"
  if [[ -z "$APP_WORK_DIR" ]];
  then
      echo "!!! error: app_dir_clear got empty app work dir" >&2
      exit 1
  fi

  rm -rf "${APP_WORK_DIR:?APP_WORK_DIR is empty}"

  echo "=== Work dir ${APP_WORK_DIR} cleared ==="
}
function archive_read() {
  local APP_WORK_DIR="$1"
  if [[ -z "$APP_WORK_DIR" ]];
  then
      echo "!!! error: archive_read got empty app work dir" >&2
      exit 1
  fi
  cat > "${APP_WORK_DIR}/comunicore.tar.xz"

  echo "=== got archive ==="
  ls -la "${APP_WORK_DIR}/comunicore.tar.xz"
}
function archive_extract() {
  local ARCHIVE_DIR="$1"
  if [[ -z "$ARCHIVE_DIR" ]];
  then
      echo "!!! error: archive_extract got empty app work dir" >&2
      exit 1
  fi

  pushd . || exit 1
  cd "$ARCHIVE_DIR" || exit 1
  tar xf "./comunicore.tar.xz"
  rm "./comunicore.tar.xz"
  popd || exit 1

  echo "=== extracted ==="
  ls -la "${ARCHIVE_DIR}"
}
function service_file_check() {
  local ARCHIVE_DIR="$1"
  if [[ -z "$ARCHIVE_DIR" ]];
  then
      echo "!!! error: service_file_check got empty archive dir" >&2
      exit 1
  fi

  if ! diff -q "${ARCHIVE_DIR}/comunicore/comunicore.service" /etc/systemd/system/comunicore.service;
  then
      echo "error new and installed comunicore.service differs"
      echo "manual fix required"
      echo "deploy stopped"
      exit 1
  fi
  echo "=== comunicore.service file not changed - OK ==="
}
function distributive_files_copy_to_dst_dir() {
  local APP_WORK_DIR="$1"
  if [[ -z "$APP_WORK_DIR" ]];
  then
      echo "!!! error: distributive_files_copy_to_dst_dir got empty app work dir" >&2
      exit 1
  fi

  mv ./comunicore/{backend,frontend} .
  chmod 750 ./backend/bin/{comunicore,migrate}
  rm -rf ./comunicore

  echo "=== distributive files copied to app dir ==="
  ls -la "${APP_WORK_DIR}"
}
function upload_dir_hardlink() {
  local APP_WORK_DIR="$1"
  if [[ -z "$APP_WORK_DIR" ]];
  then
      echo "!!! error: upload_dir_hardlink got empty app work dir" >&2
      exit 1
  fi

  (
    mkdir upload
    cd upload
    cp -al /home/comunicore/upload/./ .
  )
  echo "=== upload directory hardlinked to instance ==="
  echo "directory list head (note link count 2 or more)"
  ls -la "${APP_WORK_DIR}/upload" | head
}
function upload_dir_symlink() {
  local APP_WORK_DIR="$1"
  if [[ -z "$APP_WORK_DIR" ]];
  then
      echo "!!! error: upload_dir_symlink got empty app work dir" >&2
      exit 1
  fi

  ln -s /home/comunicore/upload "$APP_WORK_DIR/upload"
  echo "=== upload directory symlinked ==="
  echo "directory list head (note dir not empty)"
  ls -la "${APP_WORK_DIR}/upload" | head
}

function db_drop_tables() {
  echo "=== dropping tables ==="
  local DB_NAME="$1"
  if [[ -z "$DB_NAME" ]];
  then
      echo "!!! error: db_drop_tables got empty db name" >&2
      exit 1
  fi

  local DB_USER_NAME="$2"
  if [[ -z "$DB_USER_NAME" ]];
  then
      echo "!!! error: db_drop_tables got empty user name" >&2
      exit 1
  fi

  psql -h localhost -p 5432 "${DB_NAME}" "${DB_USER_NAME}" << "DROP_TABLES_SQL"
  do
  $$
  declare
    l_stmt text;
  begin
    select 'drop table ' || string_agg(format('%I.%I', schemaname, tablename), ',')
      into l_stmt
    from pg_tables
    where schemaname in ('public');

    execute l_stmt;
  end;
  $$;
DROP_TABLES_SQL
  echo "=== tables dropped ==="
}
function db_drop_functions() {
  echo "=== dropping functions ==="
  local DB_NAME="$1"
  if [[ -z "$DB_NAME" ]];
  then
      echo "!!! error: db_drop_functions got empty db name" >&2
      exit 1
  fi

  local DB_USER_NAME="$2"
  if [[ -z "$DB_USER_NAME" ]];
  then
      echo "!!! error: db_drop_functions got empty user name" >&2
      exit 1
  fi

  psql -h localhost -p 5432 "${DB_NAME}" "${DB_USER_NAME}" << "DROP_FUNCTIONS_SQL"
    DO $$
    DECLARE
        r RECORD;
    BEGIN
        FOR r IN
            SELECT
                n.nspname AS schema_name,
                p.proname AS function_name,
                pg_get_function_identity_arguments(p.oid) AS args
            FROM pg_proc p
            JOIN pg_namespace n ON n.oid = p.pronamespace
            WHERE n.nspname NOT IN ('pg_catalog', 'information_schema')
              AND n.nspname NOT LIKE 'pg_toast%'
              AND p.prokind = 'f'
        LOOP
            EXECUTE format(
                'DROP FUNCTION IF EXISTS %I.%I(%s) CASCADE',
                r.schema_name,
                r.function_name,
                r.args
            );
        END LOOP;
    END $$;
DROP_FUNCTIONS_SQL
  echo "=== functions dropped ==="
}

function db_load_from_production() {
  local DB_NAME="$1"
  if [[ -z "$DB_NAME" ]];
  then
      echo "!!! error: db_load_from_production got empty db name" >&2
      exit 1
  fi

  local DB_USER_NAME="$2"
  if [[ -z "$DB_USER_NAME" ]];
  then
      echo "!!! error: db_load_from_production got empty user name" >&2
      exit 1
  fi

  pg_dump --no-owner -U comunicore comunicore | psql -h localhost -p 5432 "${DB_NAME}" "${DB_USER_NAME}"
  echo "=== db copied from production ==="
}
