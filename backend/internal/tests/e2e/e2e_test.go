// SPDX-License-Identifier: MIT
// Copyright 2026 Alex Syrnikov <alex19srv@gmail.com>

package e2e

import (
	"context"
	"testing"

	"github.com/stretchr/testify/require"
)

type globalAppConfig struct {
	ConfigPath string

	URL string

	DbHost     string
	DbPort     int
	DbName     string
	DbUser     string
	DbPassword string
}

var (
	globalConfig = globalAppConfig{
		URL: "",
		// server params to override config file values
		ConfigPath: "../../../config/server-config.toml",

		DbHost:     "",
		DbPort:     0,
		DbName:     "test",
		DbUser:     "test",
		DbPassword: "password",
		// server params end
	}
)

const (
	userCreatePath   = "/api/user"
	userMePath       = "/api/user/me"
	userGetPath      = "/api/user/{id}"
	userUpdatePath   = "/api/user/{id}"
	authLoginPath    = "/api/auth/login"
	authLogoutPath   = "/api/auth/logout"
	postCreatePath   = "/api/posts"
	postCommentsPath = "/api/posts/{postId}/comments"
)

func TestMain(m *testing.M) { // for global setup and teardown
	stop := postgresStart(context.Background())
	defer stop()

	server := testServerStart()
	defer server.Close()
	globalConfig.URL = server.URL

	m.Run()
}

func TestUserAndAuth(t *testing.T) {
	// TODO: test negative cases
	// userCreate
	// testUserCreateBad(t, globalConfig.URL)
	user := testUserCreateOk(t, globalConfig.URL)
	t.Logf("Created user: %+v", user)
	testUserCreateAgainFailure(t, globalConfig.URL, user)
	// userLogin
	sessionCookie1 := testAuthLoginOk(t, globalConfig.URL, user)
	// testAuthLoginFailure(t, globalConfig.URL, user)
	// userMe
	userMe := testUserMeOk(t, globalConfig.URL, sessionCookie1)
	require.Equal(t, user.ID, userMe.ID)
	require.Equal(t, user.Name, userMe.Name)
	require.Equal(t, user.Email, userMe.Email)
	// userGet
	getByIdUser := testUserGetOk(t, globalConfig.URL, sessionCookie1, user.ID)
	require.Equal(t, user.ID, getByIdUser.ID)
	require.Equal(t, user.Name, getByIdUser.Name)
	require.Equal(t, user.Email, getByIdUser.Email)
	// userUpdate
	updayedUser := testUserUpdateOk(t, globalConfig.URL, sessionCookie1, user.ID)
	require.Equal(t, user.ID, updayedUser.ID)
	require.NotEqual(t, user.Name, updayedUser.Name)
	require.NotEqual(t, user.Email, updayedUser.Email)
	// userLogout
	testAuthLogoutOk(t, globalConfig.URL, sessionCookie1)
	// TODO: check user logged out
}
