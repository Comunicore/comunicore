// SPDX-License-Identifier: MIT
// Copyright 2025 Alex Syrnikov <alex19srv@gmail.com>

package main

import (
	"fmt"
	"log"
	"os"
	"path/filepath"

	"github.com/comunicore/comunicore/backend/internal/lib/config"
	"github.com/golang-migrate/migrate/v4"

	_ "github.com/golang-migrate/migrate/v4/database/pgx/v5"
	_ "github.com/golang-migrate/migrate/v4/source/file"
)

func main() {
	cmdConfig := config.CmdParse()
	appConfig := config.MustReadAppConfig(cmdConfig)

	exe, err := os.Executable()
	if err != nil {
		log.Fatalf("failed to get executable path: %v", err)
	}
	exeDir := filepath.Dir(exe)
	if err := os.Chdir(exeDir); err != nil {
		log.Fatalf("failed to change directory to executable dir: %v", err)
	}

	dsn := fmt.Sprintf(
		"pgx5://%s:%s@%s:%d/%s?sslmode=disable",
		appConfig.Database.User,
		appConfig.Database.Password,
		appConfig.Database.Host,
		appConfig.Database.Port,
		appConfig.Database.Name)

	m, err := migrate.New(
		"file://migrations",
		dsn,
	)
	if err != nil {
		log.Fatalf("failed to create migrate instance: %v", err)
		return
	}

	if err := m.Up(); err != nil && err != migrate.ErrNoChange {
		log.Fatalf("failed to apply migrations: %v", err)
		return
	}
	log.Println("migrations applied successfully")
}
