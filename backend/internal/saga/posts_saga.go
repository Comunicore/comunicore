// SPDX-License-Identifier: MIT
// Copyright 2026 Alex Syrnikov <alex19srv@gmail.com>

package saga

import (
	"context"
	"errors"
	"fmt"
	"uuid"

	"github.com/comunicore/comunicore/backend/internal/apperror"
	"github.com/comunicore/comunicore/backend/internal/service/model"
)

type CategoryRepo interface {
	GetCategoryByName(ctx context.Context, name string) (model.Category, error)
}

type PostsRepo interface {
	Create(ctx context.Context, post model.PostCreateRepo) (model.PostRepoInfo, error)
	Delete(ctx context.Context, postId int) error
	InsertPostTags(ctx context.Context, postID int, tags []string) error
}

type PostsSaga struct {
	categoryRepo CategoryRepo
	postsRepo    PostsRepo
}

func NewPostsSaga(categoryRepo CategoryRepo, postsRepo PostsRepo) *PostsSaga {
	return &PostsSaga{
		categoryRepo: categoryRepo,
		postsRepo:    postsRepo,
	}
}

type PostCreateState struct {
	Saga
	UUID         uuid.UUID
	category     model.Category
	postRepoInfo model.PostRepoInfo
}

func (s *PostsSaga) PostCreate(
	ctx context.Context,
	post model.PostCreateService,
) (model.PostRepoInfo, model.Category, error) {
	sagaState := &PostCreateState{State: 0}

	return s.postCreate(ctx, sagaState, post)
}

const (
	PostCreateStatePostCreated = iota + 1
	PostCreateStateTagsInserted
)

// этот метод должен быть отдельным,
// чтобы вызывать его для продолжения выполнения в случае падения приложения на каком-то шаге
func (s *PostsSaga) postCreate(
	ctx context.Context,
	sagaState *PostCreateState,
	post model.PostCreateService,
) (model.PostRepoInfo, model.Category, error) {
	switch sagaState.State {
	case SagaStateInitial:
		var err error
		sagaState.category, err = s.categoryRepo.GetCategoryByName(ctx, post.Category)
		if err != nil {
			return model.PostRepoInfo{}, model.Category{}, err
		}
		sagaState.UUID = uuid.NewV7()
		sagaState.postRepoInfo, err = s.postsRepo.Create(ctx, model.PostCreateRepo{
			UUID:       sagaState.UUID,
			CategoryID: sagaState.category.ID,
			Type:       post.Type,
			Title:      post.Title,
			Content:    post.Content,
			Files:      post.Files,
			UserID:     post.UserID,
			Tags:       post.Tags,
		})
		if errors.Is(err, apperror.NotUniqueError) {
			return model.PostRepoInfo{}, model.Category{},
				fmt.Errorf("saga.postCreate(): error: %w, duplicate field in postsRepo.Create", err)
		}
		if err != nil {
			return model.PostRepoInfo{}, model.Category{}, err
		}
		sagaState.State = 1
		fallthrough
	case PostCreateStatePostCreated:
		if len(post.Tags) > 0 {
			if err := s.postsRepo.InsertPostTags(ctx, sagaState.postRepoInfo.ID, post.Tags); err != nil {
				s.postCreateCancel(ctx, sagaState)
				return model.PostRepoInfo{}, model.Category{}, err
			}
		}
		sagaState.State = 2
		fallthrough
	case PostCreateStateTagsInserted:
		return sagaState.postRepoInfo, sagaState.category, nil
	default:
		return model.PostRepoInfo{}, model.Category{},
			fmt.Errorf("Saga.postCreate(): error: %w, invalid state value: %d",
				apperror.IncorrectParametersError, sagaState.State)
	}
}
func (s *PostsSaga) postCreateCancel(
	ctx context.Context,
	sagaState *PostCreateState,
) error {
	switch sagaState.State {
	case SagaStateInitial:
		return nil
	case PostCreateStatePostCreated:
		s.postsRepo.Delete(ctx, sagaState.postRepoInfo.ID)
		return nil
	case PostCreateStateTagsInserted:
		fallthrough
	default:
		return fmt.Errorf("Saga.postCreateCancel(): error: %w, invalid state value: %d",
			apperror.IncorrectParametersError, sagaState.State)
	}
}
