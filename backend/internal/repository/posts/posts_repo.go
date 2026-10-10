// SPDX-License-Identifier: MIT
// Copyright 2026 Alex Syrnikov <alex19srv@gmail.com>

package posts

import (
	"context"
	"strings"

	"github.com/comunicore/comunicore/backend/internal/repository"
	postdDb "github.com/comunicore/comunicore/backend/internal/repository/sqlc/db"
	"github.com/comunicore/comunicore/backend/internal/service/model"
	"github.com/jackc/pgx/v5/pgxpool"
)

type PostsRepo struct {
	dbpool  *pgxpool.Pool
	queries *postdDb.Queries
}

func NewPostsRepo(dsn string) (*PostsRepo, error) {
	pool, err := repository.PgPool(dsn)
	if err != nil {
		return nil, err
	}
	return &PostsRepo{dbpool: pool, queries: postdDb.New(pool)}, nil
}

// create post
func (r *PostsRepo) Create(ctx context.Context, post model.PostCreate) (model.PostRepoInfo, error) {
	row, err := r.queries.PostCreate(ctx, postdDb.PostCreateParams{
		Title:   post.Title,
		Content: post.Content,
		UserID:  int32(post.UserID),
	})
	return model.PostRepoInfo{
		ID:            int(row.ID),
		UserID:        int(row.UserID),
		Title:         row.Title,
		Content:       row.Content,
		CommentsCount: int(row.CommentsCount),
		CreatedAt:     row.CreatedAt.Time,
	}, err
}

func (r *PostsRepo) InsertPostTags(ctx context.Context, postID int, tags []string) error {
	seen := make(map[string]struct{}, len(tags))
	for _, raw := range tags {
		tag := strings.ToLower(strings.TrimSpace(raw))
		if tag == "" {
			continue
		}
		if _, ok := seen[tag]; ok {
			continue
		}
		seen[tag] = struct{}{}
		if err := r.queries.PostTagInsert(ctx, postdDb.PostTagInsertParams{
			PostID: int32(postID),
			Tag:    tag,
		}); err != nil {
			return err
		}
	}
	return nil
}

// list posts page
func (r *PostsRepo) PageByPageID(ctx context.Context, page, limit int) (model.PostListRepo, error) {
	rows, err := r.queries.PostPageByPageID(ctx, postdDb.PostPageByPageIDParams{
		Limit:  int32(limit),
		Offset: int32((page - 1) * limit),
	})
	if err != nil {
		return model.PostListRepo{}, err
	}

	posts := make([]model.PostRepoInfo, 0, limit)
	for _, row := range rows {
		posts = append(posts, model.PostRepoInfo{
			ID:            int(row.ID),
			UserID:        int(row.UserID),
			Title:         row.Title,
			Content:       row.Content,
			CommentsCount: int(row.CommentsCount),
			CreatedAt:     row.CreatedAt.Time,
		})
	}
	if len(posts) == 0 {
		return model.PostListRepo{
			TotalCountEstimated: 0,
			HaveNext:            false,
			HavePrev:            false,
		}, nil
	}
	res, err := r.postListInfo(ctx, posts[len(posts)-1].ID, posts[0].ID)
	if err != nil {
		return model.PostListRepo{}, err
	}
	res.Posts = posts

	return res, nil
}

// list posts page by page id, with next and prev page info
func (r *PostsRepo) PageByOffset(ctx context.Context, postId, limit int, before bool) (model.PostListRepo, error) {
	posts := make([]model.PostRepoInfo, 0, limit)
	if before {
		rows, err := r.queries.PostPagesBeforePostID(ctx, postdDb.PostPagesBeforePostIDParams{
			ID:    int32(postId),
			Limit: int32(limit),
		})
		if err != nil {
			return model.PostListRepo{}, err
		}
		for _, row := range rows {
			posts = append(posts, model.PostRepoInfo{
				ID:            int(row.ID),
				UserID:        int(row.UserID),
				Title:         row.Title,
				Content:       row.Content,
				CommentsCount: int(row.CommentsCount),
				CreatedAt:     row.CreatedAt.Time,
			})
		}
	} else {
		rows, err := r.queries.PostPagesBeforePostID(ctx, postdDb.PostPagesBeforePostIDParams{
			ID:    int32(postId),
			Limit: int32(limit),
		})
		if err != nil {
			return model.PostListRepo{}, err
		}
		for _, row := range rows {
			posts = append(posts, model.PostRepoInfo{
				ID:            int(row.ID),
				UserID:        int(row.UserID),
				Title:         row.Title,
				Content:       row.Content,
				CommentsCount: int(row.CommentsCount),
				CreatedAt:     row.CreatedAt.Time,
			})
		}
	}

	res, err := r.postListInfo(ctx, posts[len(posts)-1].ID, posts[0].ID)
	if err != nil {
		return model.PostListRepo{}, err
	}
	res.Posts = posts

	return res, nil
}

func (r *PostsRepo) postListInfo(ctx context.Context, minId, maxId int) (model.PostListRepo, error) {
	row := r.dbpool.QueryRow(ctx,
		`SELECT COUNT(*) FROM posts`)

	var count int
	if err := row.Scan(&count); err != nil {
		return model.PostListRepo{}, err
	}
	res := model.PostListRepo{
		TotalCountEstimated: count,
	}
	row = r.dbpool.QueryRow(ctx,
		`SELECT id FROM posts WHERE id < $1 LIMIT 1`, minId)
	var prevId int
	if err := row.Scan(&prevId); err != nil {
		if err.Error() == "no rows in result set" { // FIXME: this is not a good way to check for no rows, but pgx does not export the error type
			res.HaveNext = false
		} else {
			return model.PostListRepo{}, err
		}
	} else {
		res.HaveNext = true
	}

	row = r.dbpool.QueryRow(ctx,
		`SELECT id FROM posts WHERE id > $1 LIMIT 1`, maxId)
	var nextId int
	if err := row.Scan(&nextId); err != nil {
		if err.Error() == "no rows in result set" { // FIXME: this is not a good way to check for no rows, but pgx does not export the error type
			res.HavePrev = false
		} else {
			return model.PostListRepo{}, err
		}
	} else {
		res.HavePrev = true
	}

	return res, nil
}

func (r *PostsRepo) Get(ctx context.Context, postId int) (*model.PostRepoInfo, error) {
	row, err := r.queries.PostGetById(ctx, int32(postId))
	return &model.PostRepoInfo{
		ID:            int(row.ID),
		UserID:        int(row.UserID),
		Title:         row.Title,
		Content:       row.Content,
		CommentsCount: int(row.CommentsCount),
		CreatedAt:     row.CreatedAt.Time,
	}, err
}
