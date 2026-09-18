// SPDX-License-Identifier: MIT
// Copyright 2026 Alex Syrnikov <alex19srv@gmail.com>

package user

import (
	"context"
	"errors"
	"fmt"

	"github.com/hetagdarchiev/comunicore/backend/internal/apperror"
	"github.com/hetagdarchiev/comunicore/backend/internal/repository"
	userDb "github.com/hetagdarchiev/comunicore/backend/internal/repository/sqlc/db"
	"github.com/hetagdarchiev/comunicore/backend/internal/service/model"
)

type UserRepo struct {
	queries *userDb.Queries
}

func NewUserRepo(dsn string) (*UserRepo, error) {
	pool, err := repository.PgPool(dsn)
	if err != nil {
		return nil, err
	}
	return &UserRepo{queries: userDb.New(pool)}, nil
}

func (r *UserRepo) Get(ctx context.Context, userId int) (model.User, error) {
	row, err := r.queries.UserGet(ctx, int32(userId))
	if err != nil {
		err = apperror.PgErrorToAppError(err)
	}
	return model.User{
		ID:        int(row.ID),
		Name:      row.Name,
		Email:     row.Email,
		AvatarURL: row.AvatarUrl.String,
		CreatedAt: row.CreatedAt.Time,
	}, err
}
func (r *UserRepo) GetNameById(ctx context.Context, userId int) (string, error) {
	// TODO: optimize with cache
	return r.queries.UserGetNameById(ctx, int32(userId))
}

func (r *UserRepo) Create(ctx context.Context, name, email string) (model.User, error) {
	row, err := r.queries.UserCreate(ctx, userDb.UserCreateParams{Name: name, Email: email})
	if err == nil {
		return model.User{
			ID:        int(row.ID),
			Name:      row.Name,
			Email:     row.Email,
			AvatarURL: row.AvatarUrl.String,
			CreatedAt: row.CreatedAt.Time,
		}, err
	}
	// some db error, probubly unique constraint violation on name or email,
	// will check what exactly not unique
	err = apperror.PgErrorToAppError(err)
	notUniqueError, ok := errors.AsType[*apperror.NotUniqueError](err)
	if !ok {
		return model.User{}, fmt.Errorf("UserRepo error creating user: %w", err)
	}
	// figure out what exactly not unique
	var nameNotUniqueError error
	var emailNotUniqueError error

	rows, err := r.queries.UserGetByNameOrEmail(ctx, userDb.UserGetByNameOrEmailParams{Name: name, Email: email})
	if err == nil {
		if len(rows) == 0 {
			// this should not happen, because we got unique constraint violation, but just in case
			return model.User{},
				fmt.Errorf("UserRepo error: unique constraint violation but no user found with given name %s or email %s",
					name, email)
		}
		for _, row := range rows {
			if row.Name == name {
				nameNotUniqueError = apperror.NewLoginNotUniqueError(name)
			}
			if row.Email == email {
				emailNotUniqueError = apperror.NewEmailNotUniqueError(email)
			}
		}
		if nameNotUniqueError != nil && emailNotUniqueError != nil {
			return model.User{}, fmt.Errorf("UserRepo error: %w %w %w",
				nameNotUniqueError, emailNotUniqueError, notUniqueError)
		} else if nameNotUniqueError != nil {
			return model.User{}, fmt.Errorf("UserRepo error: %w %w", nameNotUniqueError, notUniqueError)
		} else if emailNotUniqueError != nil {
			return model.User{}, fmt.Errorf("UserRepo error: %w %w", emailNotUniqueError, notUniqueError)
		}
	} else {
		return model.User{}, fmt.Errorf("UserRepo error: error checking unique constraints: %w %w", err, notUniqueError)
	}

	return model.User{}, fmt.Errorf("UserRepo error: unique constraint violation but failed to check what exactly not unique: %w", notUniqueError)
}

func (r *UserRepo) Update(ctx context.Context, userId int, name, email string) (model.User, error) {
	row, err := r.queries.UserUpdate(ctx, userDb.UserUpdateParams{ID: int32(userId), Name: name, Email: email})
	return model.User{
		ID:        int(row.ID),
		Name:      row.Name,
		Email:     row.Email,
		AvatarURL: row.AvatarUrl.String,
		CreatedAt: row.CreatedAt.Time,
	}, err
}
