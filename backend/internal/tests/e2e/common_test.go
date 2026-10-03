// SPDX-License-Identifier: MIT
// Copyright 2026 Alex Syrnikov <alex19srv@gmail.com>

package e2e

import (
	"context"
	"log"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gavv/httpexpect/v2"
	"github.com/testcontainers/testcontainers-go"
	"github.com/testcontainers/testcontainers-go/modules/postgres"

	"github.com/comunicore/comunicore/backend/internal/handler"
	"github.com/comunicore/comunicore/backend/internal/lib/config"
)

func postgresStart(ctx context.Context) (stop func()) {
	postgresContainer, err := postgres.Run(ctx,
		"postgres:18",
		postgres.WithInitScripts("../../repository/sqlc/schema.sql"),
		postgres.WithDatabase(globalConfig.DbName),
		postgres.WithUsername(globalConfig.DbUser),
		postgres.WithPassword(globalConfig.DbPassword),
		postgres.BasicWaitStrategies(),
	)
	if err != nil {
		log.Printf("failed to start container: %s", err)
		return
	}

	globalConfig.DbHost, err = postgresContainer.Host(ctx)
	if err != nil {
		log.Printf("failed to get host: %s", err)
		return
	}
	log.Printf("PostgreSQL container is running on host: %s", globalConfig.DbHost)
	port, err := postgresContainer.MappedPort(ctx, "5432")
	if err != nil {
		log.Printf("failed to get mapped port: %s", err)
		return
	}
	globalConfig.DbPort = int(port.Num())
	log.Printf("PostgreSQL container is mapped to port: %d", globalConfig.DbPort)

	return func() {
		if err := testcontainers.TerminateContainer(postgresContainer); err != nil {
			log.Printf("failed to terminate container: %s", err)
		}
	}
}
func testServerStart() *httptest.Server {
	cmdConfig := config.CmdParse()
	cmdConfig.Config = &globalConfig.ConfigPath // fix config path for tests
	cmdConfig.DatabaseHost = &globalConfig.DbHost
	cmdConfig.DatabasePort = &globalConfig.DbPort
	cmdConfig.DatabaseName = &globalConfig.DbName
	cmdConfig.DatabaseUser = &globalConfig.DbUser
	cmdConfig.DatabasePassword = &globalConfig.DbPassword
	// HACK commandline config values will override config file values
	appConfig := config.MustReadAppConfig(cmdConfig)

	mux := http.NewServeMux()
	handler.RegisterOgenRoutes(mux, appConfig)

	return httptest.NewServer(mux)
}
func expectCreate(t *testing.T, serverBaseUrl string) *httpexpect.Expect {
	exp := httpexpect.WithConfig(httpexpect.Config{
		BaseURL:  serverBaseUrl,
		Reporter: httpexpect.NewAssertReporter(t),
		Printers: []httpexpect.Printer{
			httpexpect.NewCurlPrinter(t),
			httpexpect.NewDebugPrinter(t, true),
		},
	})

	return exp
}
