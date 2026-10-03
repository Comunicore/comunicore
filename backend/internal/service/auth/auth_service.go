// SPDX-License-Identifier: MIT
// Copyright 2026 Alex Syrnikov <alex19srv@gmail.com>

package auth

import (
	"context"

	"github.com/comunicore/comunicore/backend/internal/service/model"
	"github.com/google/uuid"
)

type AuthRepo interface {
	// AuthCreate(ctx context.Context, user_id int64, login, password string) error
	// AuthUpdatePassword(ctx context.Context, user_id int64, password string) error
	Login(ctx context.Context, login, password string) (userID int, sessionID uuid.UUID, err error)
	Logout(ctx context.Context, sessionUUID uuid.UUID) error
}
type UserRepo interface {
	Get(ctx context.Context, userId int) (model.User, error)
}

type AuthService struct {
	authRepo AuthRepo
	userRepo UserRepo
}

func NewAuthService(authRepo AuthRepo, userRepo UserRepo) *AuthService {
	return &AuthService{authRepo: authRepo, userRepo: userRepo}
}

func (r *AuthService) Login(ctx context.Context, login, password string) (model.User, uuid.UUID, error) {
	userID, sessionUUID, err := r.authRepo.Login(ctx, login, password)
	if err != nil {
		return model.User{}, uuid.UUID{}, err
	}

	user, err := r.userRepo.Get(ctx, userID)
	if err != nil {
		return model.User{}, uuid.UUID{}, err
	}

	return user, sessionUUID, nil
}
func (r *AuthService) Logout(ctx context.Context, sessionUUID uuid.UUID) error {
	return r.authRepo.Logout(ctx, sessionUUID)
}
