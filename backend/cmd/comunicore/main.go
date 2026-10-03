// SPDX-License-Identifier: MIT
// Copyright 2026 Alex Syrnikov <alex19srv@gmail.com>

package main

import (
	"context"
	"log"
	"net"
	"net/http"
	"os"
	"os/signal"
	"strconv"
	"syscall"
	"time"

	"github.com/comunicore/comunicore/backend/internal/handler"
	"github.com/comunicore/comunicore/backend/internal/lib/config"
)

func main() {
	cmdConfig := config.CmdParse()
	appConfig := config.MustReadAppConfig(cmdConfig)
	os.Chdir(appConfig.Server.WorkDir)

	mux := http.NewServeMux()
	handler.RegisterOgenRoutes(mux, appConfig)

	addr := net.JoinHostPort(appConfig.Server.Host, strconv.Itoa(appConfig.Server.Port))
	if addr == "" {
		addr = ":8080"
	}
	srv := &http.Server{
		Addr:    addr,
		Handler: mux,
	}

	go func() {
		log.Printf("starting server on %s", addr)
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("listen: %v", err)
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, os.Interrupt, syscall.SIGHUP, syscall.SIGINT, syscall.SIGQUIT, syscall.SIGTERM)
	sig := <-quit
	log.Printf("got signal \"%s\" shutting down server...", sig)

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	if err := srv.Shutdown(ctx); err != nil {
		log.Fatalf("server forced to shutdown: %v", err)
	}
	log.Println("server stopped")
}
