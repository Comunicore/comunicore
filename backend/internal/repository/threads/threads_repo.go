// SPDX-License-Identifier: MIT
// Copyright 2026 Alex Syrnikov <alex19srv@gmail.com>

package threads

import (
	"context"
	"strings"

	"github.com/comunicore/comunicore/backend/internal/repository"
	threadDb "github.com/comunicore/comunicore/backend/internal/repository/sqlc/db"
	"github.com/comunicore/comunicore/backend/internal/service/model"
	"github.com/jackc/pgx/v5/pgxpool"
)

type ThreadsRepo struct {
	dbpool  *pgxpool.Pool
	queries *threadDb.Queries
}

func NewThreadsRepo(dsn string) (*ThreadsRepo, error) {
	pool, err := repository.PgPool(dsn)
	if err != nil {
		return nil, err
	}
	return &ThreadsRepo{dbpool: pool, queries: threadDb.New(pool)}, nil
}

// create thread
func (r *ThreadsRepo) Create(ctx context.Context, thread model.ThreadCreate) (model.ThreadRepoInfo, error) {
	row, err := r.queries.ThreadCreate(ctx, threadDb.ThreadCreateParams{
		Title:   thread.Title,
		Content: thread.Content,
		UserID:  int32(thread.UserID),
	})
	return model.ThreadRepoInfo{
		ID:            int(row.ID),
		UserID:        int(row.UserID),
		Title:         row.Title,
		Content:       row.Content,
		CommentsCount: int(row.CommentsCount),
		CreatedAt:     row.CreatedAt.Time,
	}, err
}

func (r *ThreadsRepo) InsertThreadTags(ctx context.Context, threadID int, tags []string) error {
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
		if err := r.queries.ThreadTagInsert(ctx, threadDb.ThreadTagInsertParams{
			ThreadID: int32(threadID),
			Tag:      tag,
		}); err != nil {
			return err
		}
	}
	return nil
}

// list threads page
func (r *ThreadsRepo) PageByPageID(ctx context.Context, page, limit int) (model.ThreadListRepo, error) {
	rows, err := r.queries.ThreadPageByPageID(ctx, threadDb.ThreadPageByPageIDParams{
		Limit:  int32(limit),
		Offset: int32((page - 1) * limit),
	})
	if err != nil {
		return model.ThreadListRepo{}, err
	}

	threads := make([]model.ThreadRepoInfo, 0, limit)
	for _, row := range rows {
		threads = append(threads, model.ThreadRepoInfo{
			ID:            int(row.ID),
			UserID:        int(row.UserID),
			Title:         row.Title,
			Content:       row.Content,
			CommentsCount: int(row.CommentsCount),
			CreatedAt:     row.CreatedAt.Time,
		})
	}
	if len(threads) == 0 {
		return model.ThreadListRepo{
			TotalCountEstimated: 0,
			HaveNext:            false,
			HavePrev:            false,
		}, nil
	}
	res, err := r.threadListInfo(ctx, threads[len(threads)-1].ID, threads[0].ID)
	if err != nil {
		return model.ThreadListRepo{}, err
	}
	res.Threads = threads

	return res, nil
}

// list threads page by page id, with next and prev page info
func (r *ThreadsRepo) PageByOffset(ctx context.Context, threadId, limit int, before bool) (model.ThreadListRepo, error) {
	threads := make([]model.ThreadRepoInfo, 0, limit)
	if before {
		rows, err := r.queries.ThreadPagesBeforeThreadID(ctx, threadDb.ThreadPagesBeforeThreadIDParams{
			ID:    int32(threadId),
			Limit: int32(limit),
		})
		if err != nil {
			return model.ThreadListRepo{}, err
		}
		for _, row := range rows {
			threads = append(threads, model.ThreadRepoInfo{
				ID:            int(row.ID),
				UserID:        int(row.UserID),
				Title:         row.Title,
				Content:       row.Content,
				CommentsCount: int(row.CommentsCount),
				CreatedAt:     row.CreatedAt.Time,
			})
		}
	} else {
		rows, err := r.queries.ThreadPagesBeforeThreadID(ctx, threadDb.ThreadPagesBeforeThreadIDParams{
			ID:    int32(threadId),
			Limit: int32(limit),
		})
		if err != nil {
			return model.ThreadListRepo{}, err
		}
		for _, row := range rows {
			threads = append(threads, model.ThreadRepoInfo{
				ID:            int(row.ID),
				UserID:        int(row.UserID),
				Title:         row.Title,
				Content:       row.Content,
				CommentsCount: int(row.CommentsCount),
				CreatedAt:     row.CreatedAt.Time,
			})
		}
	}

	res, err := r.threadListInfo(ctx, threads[len(threads)-1].ID, threads[0].ID)
	if err != nil {
		return model.ThreadListRepo{}, err
	}
	res.Threads = threads

	return res, nil
}

func (r *ThreadsRepo) threadListInfo(ctx context.Context, minId, maxId int) (model.ThreadListRepo, error) {
	row := r.dbpool.QueryRow(ctx,
		`SELECT COUNT(*) FROM threads`)

	var count int
	if err := row.Scan(&count); err != nil {
		return model.ThreadListRepo{}, err
	}
	res := model.ThreadListRepo{
		TotalCountEstimated: count,
	}
	row = r.dbpool.QueryRow(ctx,
		`SELECT id FROM threads WHERE id < $1 LIMIT 1`, minId)
	var prevId int
	if err := row.Scan(&prevId); err != nil {
		if err.Error() == "no rows in result set" { // FIXME: this is not a good way to check for no rows, but pgx does not export the error type
			res.HaveNext = false
		} else {
			return model.ThreadListRepo{}, err
		}
	} else {
		res.HaveNext = true
	}

	row = r.dbpool.QueryRow(ctx,
		`SELECT id FROM threads WHERE id > $1 LIMIT 1`, maxId)
	var nextId int
	if err := row.Scan(&nextId); err != nil {
		if err.Error() == "no rows in result set" { // FIXME: this is not a good way to check for no rows, but pgx does not export the error type
			res.HavePrev = false
		} else {
			return model.ThreadListRepo{}, err
		}
	} else {
		res.HavePrev = true
	}

	return res, nil
}

func (r *ThreadsRepo) Get(ctx context.Context, threadId int) (*model.ThreadRepoInfo, error) {
	row, err := r.queries.ThreadGetById(ctx, int32(threadId))
	return &model.ThreadRepoInfo{
		ID:            int(row.ID),
		UserID:        int(row.UserID),
		Title:         row.Title,
		Content:       row.Content,
		CommentsCount: int(row.CommentsCount),
		CreatedAt:     row.CreatedAt.Time,
	}, err
}
