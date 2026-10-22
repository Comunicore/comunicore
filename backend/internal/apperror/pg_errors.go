// SPDX-License-Identifier: MIT
// Copyright 2026 Alex Syrnikov <alex19srv@gmail.com>

package apperror

import (
	"database/sql"
	"errors"
	"fmt"
	"runtime"
	"strings"

	"github.com/jackc/pgx/v5/pgconn"
)

// convert postgres error to app error or teturn original error
func PgErrorToAppError(err error) error {
	if pgErr, ok := err.(*pgconn.PgError); ok {
		if pgErr.Code == "23505" { // unique_violation
			return fmt.Errorf("error: %w\n caused by: %w", NotUniqueError, err)
		}
		fmt.Printf("PostgreSQL unknown error code: %s, message: %s\n error struct %+v\n",
			pgErr.Code, pgErr.Message, *pgErr)
	} else {
		fmt.Printf("PgErrorToAppError got error %T %+v\n", err, err)
	}
	return err
}
func AppErrorFromPgError(err error) error {
	if errors.Is(err, sql.ErrNoRows) {
		return fmt.Errorf("error: %w\n caused by: %w", NotFoundError, err)
	}
	if pgErr, ok := err.(*pgconn.PgError); ok {
		if pgErr.Code == "23505" { // unique_violation
			return fmt.Errorf("error: %w\n caused by: %w", NotUniqueError, err)
		}
		fmt.Printf("PostgreSQL unknown error code: %s, message: %s\n error struct %+v\n",
			pgErr.Code, pgErr.Message, *pgErr)
	} else {
		return fmt.Errorf("AppErrorFromPgError called from %s got error %T %+v\n", callerName(), err, err)
	}
	return err
}

// get caller function name, useful for logging and error messages
// uses reflection to get the name of the function that called this function
func callerName() string {
	pc, _, _, ok := runtime.Caller(2)
	if !ok {
		return "unknown"
	}

	fn := runtime.FuncForPC(pc)
	if fn == nil {
		return "unknown"
	}

	name := fn.Name()

	// Remove module/import path, keep package.function
	if i := strings.LastIndex(name, "/"); i >= 0 {
		name = name[i+1:]
	}

	return name
}
