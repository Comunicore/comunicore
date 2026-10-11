// SPDX-License-Identifier: MIT
// Copyright 2026 Alex Syrnikov <alex19srv@gmail.com>

package config

import (
	"errors"
	"flag"
	"fmt"
	"log"
	"os"
	"path"
	"strconv"

	toml "github.com/pelletier/go-toml/v2"
)

type CmdConfig struct {
	Config *string
	// database
	DatabaseHost     *string
	DatabasePort     *int
	DatabaseUser     *string
	DatabasePassword *string
	DatabaseName     *string
	// http server
	ServerHost            *string
	ServerPort            *int
	ServerBaseURL         *string // "http://foo.com", "http://foo.com:8080"
	ServerPermittedOrigin *string // CORS origin: "http://test.com" or "http://site.me:8080"
	ServerWorkDir         *string
	ServerUploadDir       *string
}

// CmdParse parses command-line arguments and returns a CmdConfig struct.
func CmdParse() *CmdConfig {
	configPath := flag.String("config", "", "path to config file")
	dbHost := flag.String("database-host", "", "database host")
	dbPort := flag.Int("database-port", 0, "database port")
	dbUser := flag.String("database-user", "", "database user")
	dbPassword := flag.String("database-password", "", "database password")
	dbName := flag.String("database-name", "", "database name")

	serverHost := flag.String("server-host", "", "http server host")
	serverPort := flag.Int("server-port", 0, "http server port")
	serverBaseURL := flag.String("server-baseurl", "",
		"http server base URL (e.g. \"https://site.com\", \"http://site.com:8080\")")
	serverPermittedOrigin := flag.String(
		"server-permitted-origin",
		"",
		"http server permitted extra single origin (e.g. \"http://localhost:3000\" or \"http://site.com\")",
	)
	serverWorkDir := flag.String(
		"server-work-dir",
		"",
		"http server work directory (default current dir)",
	)
	serverUploadDir := flag.String("server-upload-dir", "",
		"http server upload directory (default work dir + /upload)")

	flag.Parse()

	return &CmdConfig{
		Config: configPath,
		// database
		DatabaseHost:     dbHost,
		DatabasePort:     dbPort,
		DatabaseUser:     dbUser,
		DatabasePassword: dbPassword,
		DatabaseName:     dbName,
		// http server
		ServerHost:            serverHost,
		ServerPort:            serverPort,
		ServerBaseURL:         serverBaseURL,
		ServerPermittedOrigin: serverPermittedOrigin,
		ServerWorkDir:         serverWorkDir,
		ServerUploadDir:       serverUploadDir,
	}
}

type DatabaseConfig struct {
	Host     string
	Port     int
	User     string
	Password string
	Name     string
}

func (db *DatabaseConfig) check(cmd *CmdConfig) error {
	db.Host = mergeCmdEnvCurrentDefaultString(
		cmd.DatabaseHost,
		"FORUM_DATABASE_HOST",
		db.Host,
		"localhost",
	)
	db.Port = mergeCmdEnvCurrentDefaultInt(cmd.DatabasePort, "FORUM_DATABASE_PORT", db.Port, 5432)
	db.User = mergeCmdEnvCurrentDefaultString(cmd.DatabaseUser, "FORUM_DATABASE_USER", db.User, "")
	db.Password = mergeCmdEnvCurrentDefaultString(
		cmd.DatabasePassword,
		"FORUM_DATABASE_PASSWORD",
		db.Password,
		"",
	)
	db.Name = mergeCmdEnvCurrentDefaultString(cmd.DatabaseName, "FORUM_DATABASE_NAME", db.Name, "")

	if db.Host == "" {
		return errors.New("database host is empty")
	}
	if db.Port <= 0 {
		return errors.New("database port is zero or negative")
	}
	if db.User == "" {
		return errors.New("database user is empty")
	}
	if db.Password == "" {
		return errors.New("database password is empty")
	}
	if db.Name == "" {
		return errors.New("database name is empty")
	}
	return nil
}

func (db *DatabaseConfig) DSN() string {
	// dsn := "postgres://username:password@localhost:5432/database_name"
	return fmt.Sprintf("postgres://%s:%s@%s:%d/%s", db.User, db.Password, db.Host, db.Port, db.Name)
}

type ServerConfig struct {
	Host            string
	Port            int
	BaseURL         string
	PermittedOrigin string `toml:"permitted_origin"`
	WorkDir         string `toml:"work_dir"`
	UploadDir       string `toml:"upload_dir"`
}

func (srv *ServerConfig) check(cmd *CmdConfig) error {
	srv.Host = mergeCmdEnvCurrentDefaultString(cmd.ServerHost, "FORUM_SERVER_HOST", srv.Host, "::1")
	srv.Port = mergeCmdEnvCurrentDefaultInt(cmd.ServerPort, "FORUM_SERVER_PORT", srv.Port, 8080)
	srv.BaseURL = mergeCmdEnvCurrentDefaultString(
		cmd.ServerBaseURL, "FORUM_SERVER_BASEURL", srv.BaseURL, "http://localhost:8080",
	)
	srv.PermittedOrigin = mergeCmdEnvCurrentDefaultString(
		cmd.ServerPermittedOrigin, "FORUM_SERVER_PERMITTED_ORIGIN", srv.PermittedOrigin, "",
	)

	defaultWorkDir, err := os.Getwd()
	if err != nil {
		return fmt.Errorf("failed get current working directory: %v", err)
	}
	srv.WorkDir = mergeCmdEnvCurrentDefaultString(
		cmd.ServerWorkDir, "FORUM_SERVER_WORK_DIR", srv.WorkDir, defaultWorkDir,
	)
	fmt.Printf("%s - cwd\n%s - future work dir \n", defaultWorkDir, srv.WorkDir)
	if !path.IsAbs(srv.WorkDir) {
		absoluteWorkDir := path.Join(defaultWorkDir, srv.WorkDir)
		fmt.Printf("server work dir not absolute (%s)\nmaking it absolute %s\n",
			srv.WorkDir, absoluteWorkDir)
		srv.WorkDir = absoluteWorkDir
	}

	srv.UploadDir = mergeCmdEnvCurrentDefaultString(
		cmd.ServerUploadDir, "FORUM_SERVER_UPLOAD_DIR", srv.UploadDir, "upload",
	)
	fmt.Printf("upload dir %s\n", srv.UploadDir)

	if srv.Port <= 0 {
		return errors.New("server port is zero or negative")
	}
	if srv.Port > 65535 {
		return errors.New("server port is greater than 65535")
	}
	if len(srv.BaseURL) == 0 { // TODO: check valid URL format
		return errors.New("server base URL is empty")
	}
	return nil
}

type AppConfig struct {
	Database DatabaseConfig `toml:"database"`
	Server   ServerConfig   `toml:"server"`
}

// MustReadAppConfig reads the application configuration.
// If there is an error during reading or parsing the configuration, it panics.
func MustReadAppConfig(cmdConfig *CmdConfig) *AppConfig {
	cfgPath := configPath(cmdConfig)

	cfgBin, err := os.ReadFile(cfgPath)
	if err != nil {
		log.Fatalf("failed read config from \"%s\": %v", cfgPath, err)
	}

	var appConfig AppConfig
	err = toml.Unmarshal(cfgBin, &appConfig)
	if err != nil {
		log.Fatalf("failed parse config from \"%s\": %v", cfgPath, err)
	}

	err = appConfig.Database.check(cmdConfig)
	if err != nil {
		log.Fatalf(
			"invalid db config from file \"%s\", environment or command-line: %v",
			cfgPath,
			err,
		)
	}

	err = appConfig.Server.check(cmdConfig)
	if err != nil {
		log.Fatalf(
			"invalid server config from file \"%s\", environment or command-line: %v",
			cfgPath,
			err,
		)
	}

	return &appConfig
}

// get config path from command-line argument, environment variable or default value
func configPath(cmdConfig *CmdConfig) string {
	return mergeCmdEnvDefault(cmdConfig.Config, "FORUM_CONFIG", "./config.toml")
}

// mergeCmdEnvDefault merges command-line argument (most prioritive), environment and default
func mergeCmdEnvDefault(cmd *string, envName, def string) string {
	var res string

	if cmd != nil && len(*cmd) > 0 {
		res = *cmd
	} else {
		res = os.Getenv(envName)
	}
	if res == "" {
		res = def
	}

	return res
}

// return first non empty value from command-line argument, environment variable, current or default value
func mergeCmdEnvCurrentDefaultString(cmd *string, envName, current, def string) string {
	if cmd != nil && len(*cmd) > 0 {
		return *cmd
	}
	env := os.Getenv(envName)
	if len(env) > 0 {
		return env
	}
	if len(current) > 0 {
		return current
	}
	return def
}

// return first non zero value from command-line argument, environment variable, current or default value
func mergeCmdEnvCurrentDefaultInt(cmd *int, envName string, current, def int) int {
	if cmd != nil && *cmd != 0 {
		return *cmd
	}
	env := os.Getenv(envName)
	if len(env) > 0 {
		envInt, err := strconv.Atoi(env)
		if err == nil {
			return envInt
		}
	}
	if current != 0 {
		return current
	}
	return def
}
