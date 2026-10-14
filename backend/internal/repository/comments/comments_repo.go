// SPDX-License-Identifier: MIT
// Copyright 2026 Alex Syrnikov <alex19srv@gmail.com>

package comments

import (
	"context"

	"github.com/comunicore/comunicore/backend/internal/repository"
	commentsDb "github.com/comunicore/comunicore/backend/internal/repository/sqlc/db"
	"github.com/comunicore/comunicore/backend/internal/service/model"
)

type CommentsRepo struct {
	queries *commentsDb.Queries
}

func NewCommentsRepo(dsn string) (*CommentsRepo, error) {
	pool, err := repository.PgPool(dsn)
	if err != nil {
		return nil, err
	}
	return &CommentsRepo{queries: commentsDb.New(pool)}, nil
}

// create comment in post
func (r *CommentsRepo) Create(ctx context.Context, comment model.CommentCreate) (model.Comment, error) {
	row, err := r.queries.CommentCreate(ctx, commentsDb.CommentCreateParams{
		PostID:  int32(comment.PostID),
		UserID:  int32(comment.UserID),
		Content: comment.Content,
	})
	commentRes := model.Comment{
		ID:        int(row.ID),
		PostID:    int(row.PostID),
		UserID:    int(row.UserID),
		Content:   row.Content,
		CreatedAt: row.CreatedAt.Time,
	}
	if row.UpdatedAt.Valid {
		commentRes.UpdatedAt = row.UpdatedAt.Time
	}
	return commentRes, err
}

// list comments by post id
func (r *CommentsRepo) List(ctx context.Context, postId int) ([]model.Comment, error) {
	rows, err := r.queries.CommentListByPostId(ctx, int32(postId))

	var comments []model.Comment
	for _, row := range rows {
		commentRepo := model.Comment{
			ID:        int(row.ID),
			PostID:    int(row.PostID),
			UserID:    int(row.UserID),
			Content:   row.Content,
			CreatedAt: row.CreatedAt.Time,
		}
		if row.UpdatedAt.Valid {
			commentRepo.UpdatedAt = row.UpdatedAt.Time
		}
		comments = append(comments, commentRepo)
	}
	return comments, err
}
