// SPDX-License-Identifier: MIT
// Copyright 2026 Alex Syrnikov <alex19srv@gmail.com>

package user

import (
	"context"

	"github.com/comunicore/comunicore/backend/internal/service/model"
)

type UserRepo interface {
	Get(ctx context.Context, userId int) (model.UserRepo, error)
	Create(ctx context.Context, name, email string) (model.UserRepo, error)
	Update(ctx context.Context, userId int, name, email string) (model.UserRepo, error)
}

type AuthRepo interface {
	AuthCreate(ctx context.Context, user_id int64, login, password string) error
	AuthUpdatePassword(ctx context.Context, user_id int64, password string) error
}

type UserService struct {
	userRepo UserRepo
	authRepo AuthRepo
}

func NewUserService(userRepo UserRepo, authRepo AuthRepo) *UserService {
	return &UserService{userRepo: userRepo, authRepo: authRepo}
}

func (r *UserService) Get(ctx context.Context, userId int) (model.UserRepo, error) {
	user, err := r.userRepo.Get(ctx, userId)
	if err != nil {
		return model.UserRepo{}, err
	}

	return user, nil
}
func (r *UserService) Create(ctx context.Context, name, email, password string) (model.UserRepo, error) {
	user, err := r.userRepo.Create(ctx, name, email)
	if err != nil {
		return model.UserRepo{}, err
	}
	err = r.authRepo.AuthCreate(ctx, int64(user.ID), email, password)
	if err != nil {
		return model.UserRepo{}, err
	}

	return user, nil
}
func (r *UserService) Update(ctx context.Context, userId int, name, email string) (model.UserRepo, error) {
	user, err := r.userRepo.Update(ctx, userId, name, email)
	if err != nil {
		return model.UserRepo{}, err
	}

	return user, nil
}
