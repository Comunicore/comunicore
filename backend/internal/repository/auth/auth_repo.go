// SPDX-License-Identifier: MIT
// Copyright 2026 Alex Syrnikov <alex19srv@gmail.com>

package auth

import (
	"context"
	"fmt"

	"github.com/comunicore/comunicore/backend/internal/apperror"
	"github.com/comunicore/comunicore/backend/internal/repository"
	authDb "github.com/comunicore/comunicore/backend/internal/repository/sqlc/db"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgtype"
)

type AuthRepo struct {
	queries *authDb.Queries
}

func NewAuthRepo(dsn string) (*AuthRepo, error) {
	pool, err := repository.PgPool(dsn)
	if err != nil {
		return nil, err
	}

	return &AuthRepo{
		queries: authDb.New(pool),
	}, nil
}

func (r *AuthRepo) AuthCreate(ctx context.Context, user_id int64, login, password string) error {
	passwordHash := hashPassword(password)
	fmt.Printf("password hash %s\n", passwordHash)

	err := r.queries.AuthCreate(ctx, authDb.AuthCreateParams{
		UserID:       int32(user_id),
		Login:        login,
		PasswordHash: passwordHash,
	})
	if err != nil {
		err = apperror.PgErrorToAppError(err)
	}
	return err
}
func (r *AuthRepo) AuthUpdatePassword(ctx context.Context, user_id int64, password string) error {
	passwordHash := hashPassword(password)
	fmt.Printf("password hash \"%s\"\n", passwordHash)
	// TODO: make upsert query

	err := r.queries.AuthUpdatePassword(ctx, authDb.AuthUpdatePasswordParams{
		UserID:       int32(user_id),
		PasswordHash: passwordHash,
	})
	if err != nil {
		err = apperror.PgErrorToAppError(err)
	}
	return err
}
func (r *AuthRepo) Login(ctx context.Context, login, password string) (userID int, sessionID uuid.UUID, err error) {
	userID, err = r.checkLoginPassword(ctx, login, password)
	if err != nil {
		err = apperror.PgErrorToAppError(err) // FIXME: move this deeper, here it is not db error
		return 0, uuid.UUID{}, err
	}

	sessionUUID, err := r.createSession()
	if err != nil {
		return 0, uuid.UUID{}, err
	}

	fmt.Printf("session id: %s\n", sessionUUID.String())

	err = r.queries.AuthCreateSession(ctx, authDb.AuthCreateSessionParams{
		SessionID: pgtype.UUID{Bytes: sessionUUID, Valid: true},
		UserID:    int32(userID),
	})
	if err != nil {
		err = apperror.PgErrorToAppError(err)
	}

	return userID, sessionUUID, err
}

func (r *AuthRepo) GetUserIDBySessionID(ctx context.Context, sessionUUID uuid.UUID) (int, error) {
	userID, err := r.queries.AuthGetUserIDBySessionID(ctx, pgtype.UUID{Bytes: sessionUUID, Valid: true})
	if err != nil {
		err = apperror.PgErrorToAppError(err)
		return 0, err
	}
	return int(userID), nil
}
func (r *AuthRepo) createSession() (sessionUUID uuid.UUID, err error) {
	uuidValue, err := uuid.NewV7()
	return uuidValue, nil
}
func (r *AuthRepo) Logout(ctx context.Context, sessionUUID uuid.UUID) error {
	return r.queries.AuthDeleteSession(ctx, pgtype.UUID{Bytes: sessionUUID, Valid: true})
}

func (r *AuthRepo) checkLoginPassword(ctx context.Context, login, password string) (int, error) {
	row, err := r.queries.AuthGetUserAndPasswordHash(ctx, login)
	if err != nil {
		err = apperror.NewAuthenticationError("checkLoginPassword", err, "invalid login or password or login not found")
		return 0, err
	}

	err = authenticateUser(row.PasswordHash, password)
	if err != nil {
		return 0, apperror.NewAuthenticationError("checkLoginPassword", err, "invalid login or password")
	}
	return int(row.UserID), nil
}
