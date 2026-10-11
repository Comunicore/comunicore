// SPDX-License-Identifier: MIT
// Copyright 2026 Alex Syrnikov <alex19srv@gmail.com>

package user

import (
	"context"

	"github.com/comunicore/comunicore/backend/internal/service/model"
)

type UserRepo interface {
	Get(ctx context.Context, userID int) (model.User, error)
	Create(ctx context.Context, name, email string) (model.User, error)
	Update(ctx context.Context, userID int, name, email string) (model.User, error)
}

type AuthRepo interface {
	AuthCreate(ctx context.Context, userID int64, login, password string) error
	AuthUpdatePassword(ctx context.Context, userID int64, password string) error
}

type Service struct {
	userRepo UserRepo
	authRepo AuthRepo
}

func NewUserService(userRepo UserRepo, authRepo AuthRepo) *Service {
	return &Service{userRepo: userRepo, authRepo: authRepo}
}

func (r *Service) Get(ctx context.Context, userID int) (model.User, error) {
	user, err := r.userRepo.Get(ctx, userID)
	if err != nil {
		return model.User{}, err
	}

	return user, nil
}

func (r *Service) Create(
	ctx context.Context,
	name, email, password string,
) (model.User, error) {
	user, err := r.userRepo.Create(ctx, name, email)
	if err != nil {
		return model.User{}, err
	}
	err = r.authRepo.AuthCreate(ctx, int64(user.ID), email, password)
	if err != nil {
		return model.User{}, err
	}

	return user, nil
}

func (r *Service) Update(
	ctx context.Context,
	userID int,
	name, email string,
) (model.User, error) {
	user, err := r.userRepo.Update(ctx, userID, name, email)
	if err != nil {
		return model.User{}, err
	}

	return user, nil
}
