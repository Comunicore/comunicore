// SPDX-License-Identifier: MIT
// Copyright 2026 Alex Syrnikov <alex19srv@gmail.com>

package e2e

import (
	"net/http"
	"testing"
	"time"

	"github.com/gavv/httpexpect/v2"
	"github.com/stretchr/testify/require"
)

const (
	sessionCookieName = "sid"
)

func TestAuthLoginOk(t *testing.T) {
	user := testUserCreateOk(t, globalConfig.URL)
	sessionCookie1 := testAuthLoginOk(t, globalConfig.URL, user)
	sessionCookie2 := testAuthLoginOk(t, globalConfig.URL, user)
	require.NotEqual(t, sessionCookie1.Value, sessionCookie2.Value)
}
func TestAuthLoginFailure(t *testing.T) {
	baseURL := globalConfig.URL
	user := testUserCreateOk(t, baseURL)

	tests := []struct {
		name     string
		login    string
		password string
	}{
		{
			name:     "Invalid password",
			login:    user.Email,
			password: user.Password + "bad",
		},
		{
			name:     "Invalid login",
			login:    user.Email + "bad",
			password: user.Password,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			exp := expectCreate(t, baseURL)

			res := exp.POST(authLoginPath).
				WithJSON(map[string]any{
					"login":    tt.login,
					"password": tt.password,
				}).
				Expect().
				Status(http.StatusUnauthorized)

			jwtObj := res.JSON().Object()
			jwtObj.Keys().ContainsOnly("code", "message")

			res.Cookies().IsEmpty()
		})
	}
}
func testAuthLoginOk(t *testing.T, baseURL string, user ForumUser) *http.Cookie {
	var httpCookie *http.Cookie
	t.Run("Test AuthLogin OK", func(t *testing.T) {
		exp := expectCreate(t, baseURL)

		res := exp.POST(authLoginPath).
			WithJSON(map[string]any{
				"login":    user.Email,
				"password": user.Password,
			}).
			Expect().
			Status(http.StatusOK)

		cookie := res.Cookie(sessionCookieName)
		cookie.Path().IsEqual("/")

		httpCookie = res.Cookie(sessionCookieName).Raw()
		require.True(t, httpCookie.HttpOnly)
		require.NotEqual(t, time.Time{}, httpCookie.Expires) // Expires should be set

		res.JSON().Object().Keys().ContainsAny("id", "name", "displayName", "email", "avatarUrl")
	})

	return httpCookie
}
func testAuthLogoutOk(t *testing.T, baseURL string, sessionCookie *http.Cookie) {
	t.Run("Test Auth Logout OK", func(t *testing.T) {
		exp := expectCreate(t, baseURL)
		auth := exp.Builder(func(req *httpexpect.Request) {
			req.WithCookie(sessionCookieName, sessionCookie.Value)
		})

		auth.POST(authLogoutPath).
			Expect().
			Status(http.StatusNoContent)
	})
}
