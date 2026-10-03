// SPDX-License-Identifier: MIT
// Copyright 2026 Alex Syrnikov <alex19srv@gmail.com>

package handler

import (
	"context"
	"net/http"
	"time"

	api "github.com/comunicore/comunicore/backend/internal/handler/generated"
	urlencode "github.com/comunicore/comunicore/backend/internal/lib/urlEncode"
	authService "github.com/comunicore/comunicore/backend/internal/service/auth"
	"github.com/google/uuid"
)

type AuthHandler struct {
	authService    *authService.AuthService
	cookieSecure   bool
	cookieSameSite http.SameSite
}

func NewAuthHandler(
	authService *authService.AuthService,
	cookieSecure bool,
	cookieSameSite http.SameSite,
) *AuthHandler {
	return &AuthHandler{
		authService:    authService,
		cookieSecure:   cookieSecure,
		cookieSameSite: cookieSameSite,
	}
}

func (u *AuthHandler) AuthLogin(ctx context.Context, req *api.AuthLoginRequest) (api.AuthLoginRes, error) {
	user, sessionUUID, err := u.authService.Login(ctx, req.Login, req.Password)
	if err != nil {
		return nil, err
	}

	globalCtx := GlobalContextFromContext(ctx)
	sessionID := urlencode.Encode(sessionUUID[:])
	u.setSessionCookie(globalCtx.ResponseWriter, sessionID, time.Now().Add(65*24*time.Hour-time.Minute))

	return &api.UserCreateResponse{
		ID:    user.ID,
		Name:  user.Name,
		Email: user.Email,
	}, nil
}
func (u *AuthHandler) AuthLogout(ctx context.Context) error {
	globalCtx := GlobalContextFromContext(ctx)
	sessionUUID := globalCtx.SessionID
	if sessionUUID == uuid.Nil {
		return nil
	}

	if err := u.authService.Logout(ctx, sessionUUID); err != nil {
		return err
	}

	u.clearSessionCookie(globalCtx.ResponseWriter)
	globalCtx.ResponseWriter.Header().Set("Clear-Site-Data", "cookies")

	return nil
}
func (u *AuthHandler) setSessionCookie(w http.ResponseWriter, sessionID string, expires time.Time) {
	cookie := &http.Cookie{
		Name:     "sid",
		Value:    sessionID,
		Path:     "/",
		Expires:  expires,
		HttpOnly: true,
		Secure:   u.cookieSecure,
		SameSite: u.cookieSameSite,
	}
	http.SetCookie(w, cookie)
}

func (u *AuthHandler) clearSessionCookie(w http.ResponseWriter) {
	cookie := &http.Cookie{
		Name:     "sid",
		Value:    "",
		MaxAge:   -1,
		HttpOnly: true,
		Secure:   u.cookieSecure,
		SameSite: u.cookieSameSite,
	}
	http.SetCookie(w, cookie)
}
