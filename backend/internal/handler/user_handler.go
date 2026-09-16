// SPDX-License-Identifier: MIT
// Copyright 2026 Alex Syrnikov <alex19srv@gmail.com>

package handler

import (
	"context"
	"errors"
	"fmt"
	"log"
	"net/url"

	"github.com/hetagdarchiev/comunicore/backend/internal/apperror"
	api "github.com/hetagdarchiev/comunicore/backend/internal/handler/generated"
	userService "github.com/hetagdarchiev/comunicore/backend/internal/service/user"
)

type UserHandler struct {
	userService *userService.UserService
}

func NewUserHandler(userService *userService.UserService) *UserHandler {
	return &UserHandler{userService: userService}
}

func (u *UserHandler) UserGet(ctx context.Context, params api.UserGetParams) (api.UserGetRes, error) {
	res, err := u.userGetById(ctx, params.UserId)
	if err != nil {
		return &api.UserGetInternalServerError{}, err
	}
	return res, err
}
func (u *UserHandler) userGetById(ctx context.Context, userId int) (*api.UserCreateResponse, error) {
	user, err := u.userService.Get(ctx, userId)
	if err != nil {
		return nil, err
	}
	avatarUrl, err := url.Parse(user.AvatarURL)
	if err != nil {
		return nil, err
	}
	return &api.UserCreateResponse{
		ID:        user.ID,
		Name:      user.Name,
		Email:     user.Email,
		AvatarUrl: *avatarUrl,
		CreatedAt: api.NewOptDateTime(user.CreatedAt),
	}, nil
}
func (u *UserHandler) UserMe(ctx context.Context) (api.UserMeRes, error) {
	globalCtx := GlobalContextFromContext(ctx)
	if globalCtx == nil || globalCtx.UserIDIsSet == false || globalCtx.UserID <= 0 {
		log.Printf("global context %p, %+v\n", globalCtx, globalCtx)
		return nil, fmt.Errorf("handler UserMe invalid UserID")
	}
	return u.userGetById(ctx, globalCtx.UserID)
}
func (u *UserHandler) UserCreate(ctx context.Context, req *api.UserCreateRequest) (api.UserCreateRes, error) {
	user, err := u.userService.Create(ctx, req.Name, req.Email, req.Password)
	if err == nil {
		avatarUrl, err := url.Parse(user.AvatarURL)
		if err != nil {
			return nil, err
		}
		return &api.UserCreateResponse{
			ID:        user.ID,
			Name:      user.Name,
			Email:     user.Email,
			AvatarUrl: *avatarUrl,
			CreatedAt: api.NewOptDateTime(user.CreatedAt),
		}, nil
	}
	var nonUniqueFields []string
	if _, ok := errors.AsType[*apperror.NameNotUniqueError](err); ok {
		// res := forumApi.NewErrorNotUniqueUserCreateBadRequest(
		nonUniqueFields = append(nonUniqueFields, "name")
		// return &res, nil
	}
	if _, ok := errors.AsType[*apperror.EmailNotUniqueError](err); ok {
		// res := forumApi.NewErrorNotUniqueUserCreateBadRequest(
		nonUniqueFields = append(nonUniqueFields, "email")
		// return &res, nil
	}
	if len(nonUniqueFields) > 0 {
		res := api.NewErrorNotUniqueUserCreateBadRequest(
			api.ErrorNotUnique{
				Code: api.ErrorNotUniqueCode(api.ErrorNotUniqueCodeErrorNotUnique),
				Data: nonUniqueFields,
			})
		return &res, nil
	} else {
		res := api.NewErrorStringMessageUserCreateBadRequest(
			api.ErrorStringMessage{
				Code:    api.ErrorStringMessageCodeErrorStringMessage,
				Message: "Unknown UserCreate error",
			})
		return &res, nil
	}
}

func (u *UserHandler) UserUpdate(ctx context.Context, req *api.UserUpdateRequest, params api.UserUpdateParams) (*api.UserCreateResponse, error) {
	user, err := u.userService.Update(ctx, params.UserId, req.Name, req.Email)
	if err != nil {
		return nil, err
	}
	avatarUrl, err := url.Parse(user.AvatarURL)
	if err != nil {
		return nil, err
	}
	return &api.UserCreateResponse{
		ID:        user.ID,
		Name:      user.Name,
		Email:     user.Email,
		AvatarUrl: *avatarUrl,
	}, nil
}
