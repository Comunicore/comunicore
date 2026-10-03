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

// create comment in thread
func (r *CommentsRepo) Create(ctx context.Context, comment model.PostCreate) (model.Post, error) {
	row, err := r.queries.CommentCreate(ctx, commentsDb.CommentCreateParams{
		ThreadID: int32(comment.ThreadID),
		UserID:   int32(comment.UserID),
		Content:  comment.Content,
	})
	return model.Post{
		ID:        int(row.ID),
		ThreadID:  int(row.ThreadID),
		UserID:    int(row.UserID),
		Content:   row.Content,
		CreatedAt: row.CreatedAt.Time,
	}, err
}

// list comments by thread id
func (r *CommentsRepo) List(ctx context.Context, threadId int) ([]model.Post, error) {
	rows, err := r.queries.CommentListByThreadId(ctx, int32(threadId))

	var posts []model.Post
	for _, data := range rows {
		posts = append(posts, model.Post{
			ID:        int(data.ID),
			ThreadID:  int(data.ThreadID),
			UserID:    int(data.UserID),
			Content:   data.Content,
			CreatedAt: data.CreatedAt.Time,
		})
	}
	return posts, err
}
