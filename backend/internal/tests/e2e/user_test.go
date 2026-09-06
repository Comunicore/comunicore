// SPDX-License-Identifier: MIT
// Copyright 2026 Alex Syrnikov <alex19srv@gmail.com>

package e2e

import (
	"fmt"
	"net/http"
	"testing"

	"github.com/gavv/httpexpect/v2"
	"github.com/hetagdarchiev/comunicore/backend/internal/tests"
)

type ForumUser struct {
	ID        int
	Name      string
	Email     string
	Password  string
	CreatedAt string
}

func testUserCreateOk(t *testing.T, baseURL string) ForumUser {
	user := ForumUser{
		Name:     "test" + tests.RandomString(8),
		Email:    tests.RandomString(10) + "@example.com",
		Password: tests.RandomString(12),
	}
	t.Run("Test UserCreate OK", func(t *testing.T) {
		exp := expectCreate(t, baseURL)

		obj := exp.POST(userCreatePath).
			WithJSON(map[string]any{
				"name":     user.Name,
				"email":    user.Email,
				"password": user.Password,
			}).
			Expect().
			Status(http.StatusCreated).JSON().Object()
		obj.Keys().ContainsOnly("id", "name", "email", "avatarUrl", "createdAt")
		obj.Value("id").Number().Gt(0)
		obj.Value("name").IsEqual(user.Name)
		obj.Value("email").IsEqual(user.Email)
		obj.Value("createdAt").String().NotEmpty()

		user.ID = int(obj.Value("id").Number().Raw())
	})
	return user
}
func testUserCreateAgainFailure(t *testing.T, baseURL string, user ForumUser) {
	testsCases := []struct {
		name         string
		payload      map[string]any
		expectedData []any
	}{
		{
			name: "both name and email conflict",
			payload: map[string]any{
				"name":     user.Name,
				"email":    user.Email,
				"password": user.Password,
			},
			expectedData: []any{"name", "email"},
		},
		{
			name: "name conflict only",
			payload: map[string]any{
				"name":     user.Name,
				"email":    tests.RandomString(10) + "@example.com",
				"password": user.Password,
			},
			expectedData: []any{"name"},
		},
		{
			name: "email conflict only",
			payload: map[string]any{
				"name":     tests.RandomString(8),
				"email":    user.Email,
				"password": user.Password,
			},
			expectedData: []any{"email"},
		},
	}

	for _, tt := range testsCases {
		t.Run("Test UserCreate Again Failure ("+tt.name+")", func(t *testing.T) {
			exp := expectCreate(t, baseURL)

			obj := exp.POST(userCreatePath).
				WithJSON(tt.payload).
				Expect().
				Status(http.StatusBadRequest).JSON().Object()
			// {"code":"ErrorNotUnique","data":["name","email"]}
			obj.Keys().ContainsOnly("code", "data")
			obj.Value("code").IsEqual("ErrorNotUnique")
			obj.Value("data").Array().ContainsOnly(tt.expectedData...)
		})
	}
}

func TestUserCreateBad(t *testing.T) {
	tests := []struct {
		name           string
		payload        map[string]any
		expectedStatus int
		expectedError  string
	}{
		{
			name: "no name",
			payload: map[string]any{
				"email":    "test@example.com",
				"password": "testpassword",
			},
			expectedError: "name (field required)",
		},
		{
			name: "no email",
			payload: map[string]any{
				"name":     "testUser",
				"password": "testpassword",
			},
			expectedError: "email (field required)",
		},
		{
			name: "empty password",
			payload: map[string]any{
				"name":     "testUser",
				"email":    "test@example.com",
				"password": "",
			},
			expectedError: "password (string: len 0 less than minimum",
		},
	}

	baseURL := globalConfig.URL

	for _, tt := range tests {
		t.Run("Test UserCreate bad ("+tt.name+")", func(t *testing.T) {
			exp := expectCreate(t, baseURL)

			obj := exp.POST(userCreatePath).
				WithJSON(tt.payload).
				Expect().
				Status(http.StatusBadRequest).JSON().Object()
			obj.Keys().ContainsOnly("code", "message")
			obj.Value("message").String().Contains(tt.expectedError)
		})
	}
}

func testUserUpdateOk(t *testing.T, baseURL string, cookie *http.Cookie, userID int) ForumUser {
	user := ForumUser{}
	t.Run("Test UserUpdate OK", func(t *testing.T) {
		userIdStr := fmt.Sprintf("%d", userID)
		exp := expectCreate(t, baseURL)
		auth := exp.Builder(func(req *httpexpect.Request) {
			req.WithCookie(sessionCookieName, cookie.Value)
		})

		res := auth.POST(userUpdatePath, userIdStr).
			WithJSON(map[string]any{
				"name":     "tester",
				"email":    "new@mail.ru",
				"password": "super_password_forever",
			}).
			Expect().
			Status(http.StatusOK).JSON().Object()

		res.Keys().ContainsOnly("id", "name", "email", "avatarUrl")

		user.ID = int(res.Value("id").Number().Raw())
		user.Name = res.Value("name").String().Raw()
		user.Email = res.Value("email").String().Raw()
	})

	return user
}
func testUserMeOk(t *testing.T, baseURL string, cookie *http.Cookie) ForumUser {
	var user ForumUser
	t.Run("Test UserMe OK", func(t *testing.T) {
		exp := expectCreate(t, baseURL)
		auth := exp.Builder(func(req *httpexpect.Request) {
			req.WithCookie(sessionCookieName, cookie.Value)
		})

		res := auth.GET(userMePath).
			Expect().
			Status(http.StatusOK).JSON().Object()

		res.Keys().ContainsOnly("id", "name", "email", "avatarUrl", "createdAt")

		user.ID = int(res.Value("id").Number().Raw())
		user.Name = res.Value("name").String().Raw()
		user.Email = res.Value("email").String().Raw()
		user.CreatedAt = res.Value("createdAt").String().Raw()
	})

	return user
}

func testUserGetOk(t *testing.T, baseURL string, cookie *http.Cookie, userID int) ForumUser {
	var user ForumUser
	t.Run("Test UserGet OK", func(t *testing.T) {
		userIdStr := fmt.Sprintf("%d", userID)
		exp := expectCreate(t, baseURL)
		auth := exp.Builder(func(req *httpexpect.Request) {
			req.WithCookie(sessionCookieName, cookie.Value)
		})

		res := auth.GET(userGetPath, userIdStr).
			Expect().
			Status(http.StatusOK).JSON().Object()

		res.Keys().ContainsOnly("id", "name", "email", "avatarUrl", "createdAt")

		user.ID = int(res.Value("id").Number().Raw())
		user.Name = res.Value("name").String().Raw()
		user.Email = res.Value("email").String().Raw()
		user.CreatedAt = res.Value("createdAt").String().Raw()
	})

	return user
}
