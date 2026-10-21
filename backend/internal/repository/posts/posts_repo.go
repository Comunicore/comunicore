// SPDX-License-Identifier: MIT
// Copyright 2026 Alex Syrnikov <alex19srv@gmail.com>

package posts

import (
	"context"
	"encoding/json"
	"net/url"
	"strings"

	"github.com/comunicore/comunicore/backend/internal/repository"
	postdDb "github.com/comunicore/comunicore/backend/internal/repository/sqlc/db"
	"github.com/comunicore/comunicore/backend/internal/service/model"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/samber/mo"
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

func optionUrlsToJsonbArray(optUrls mo.Option[[]url.URL]) ([]byte, error) {
	if !optUrls.IsPresent() {
		return nil, nil
	}
	urls, _ := optUrls.Get()
	if len(urls) == 0 {
		return nil, nil
	}
	return json.Marshal(urls)
}

// create post
func (r *PostsRepo) Create(ctx context.Context, post model.PostCreateRepo) (model.PostRepoInfo, error) {
	params := postdDb.PostCreateParams{
		CategoryID: int32(post.CategoryID),
		Title:      post.Title,
		Content:    post.Content,
		UserID:     int32(post.UserID),
	}
	jsonArray, err := optionUrlsToJsonbArray(post.Files)
	if err == nil {
		params.Files = jsonArray
	}
	row, err := r.queries.PostCreate(ctx, params)
	if err != nil {
		return model.PostRepoInfo{}, err
	}
	postRepo := model.PostRepoInfo{
		ID:         int(row.ID),
		UUID:       uuid.UUID(row.Uuid.Bytes),
		CategoryID: int(row.CategoryID),
		UserID:     int(row.UserID),
		Title:      row.Title,
		Content:    row.Content,
		SeoMeta:    extractSeoMeta(row.SeoMeta),
		CreatedAt:  row.CreatedAt.Time,
	}
	if jsonbToUrls, err := jsonbToUrls(row.Files); err == nil {
		postRepo.Files = mo.Some(jsonbToUrls)
	}
	if row.UpdatedAt.Valid {
		postRepo.UpdatedAt = row.UpdatedAt.Time
	}
	// post stats is empty - post just creted, so all values are zero (by default)
	return postRepo, err
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
	for _, postRow := range rows {
		postRepo := model.PostRepoInfo{
			ID:         int(postRow.ID),
			UUID:       uuid.UUID(postRow.Uuid.Bytes),
			CategoryID: int(postRow.CategoryID),
			UserID:     int(postRow.UserID),
			Title:      postRow.Title,
			Content:    postRow.Content,
			SeoMeta:    extractSeoMeta(postRow.SeoMeta),
			CreatedAt:  postRow.CreatedAt.Time,
		}
		if jsonbToUrls, err := jsonbToUrls(postRow.Files); err == nil {
			postRepo.Files = mo.Some(jsonbToUrls)
		}
		if postRow.UpdatedAt.Valid {
			postRepo.UpdatedAt = postRow.UpdatedAt.Time
		}
		stats, err := r.stats(ctx, int(postRow.ID))
		// if there is an error, we will return the post without stats,
		// post stats for zero values will default to zero, so we can ignore the error here
		if err == nil {
			postRepo.PostStats = stats
		}
		tags, err := r.queries.PostTags(ctx, int32(postRow.ID))
		if err == nil {
			postRepo.Tags = tags
		}
		posts = append(posts, postRepo)
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
		for _, postRow := range rows {
			postRepo := model.PostRepoInfo{
				ID:        int(postRow.ID),
				UUID:      uuid.UUID(postRow.Uuid.Bytes),
				UserID:    int(postRow.UserID),
				Title:     postRow.Title,
				Content:   postRow.Content,
				SeoMeta:   extractSeoMeta(postRow.SeoMeta),
				CreatedAt: postRow.CreatedAt.Time,
			}
			if jsonbToUrls, err := jsonbToUrls(postRow.Files); err == nil {
				postRepo.Files = mo.Some(jsonbToUrls)
			}
			if postRow.UpdatedAt.Valid {
				postRepo.UpdatedAt = postRow.UpdatedAt.Time
			}
			stats, err := r.stats(ctx, int(postRow.ID))
			// if there is an error, we will return the post without stats,
			// post stats for zero values will default to zero, so we can ignore the error here
			if err == nil {
				postRepo.PostStats = stats
			}
			tags, err := r.queries.PostTags(ctx, int32(postRow.ID))
			if err == nil {
				postRepo.Tags = tags
			}
			posts = append(posts, postRepo)
		}
	} else {
		rows, err := r.queries.PostPagesBeforePostID(ctx, postdDb.PostPagesBeforePostIDParams{
			ID:    int32(postId),
			Limit: int32(limit),
		})
		if err != nil {
			return model.PostListRepo{}, err
		}
		for _, postRow := range rows {
			postRepo := model.PostRepoInfo{
				ID:        int(postRow.ID),
				UUID:      uuid.UUID(postRow.Uuid.Bytes),
				UserID:    int(postRow.UserID),
				Title:     postRow.Title,
				Content:   postRow.Content,
				SeoMeta:   extractSeoMeta(postRow.SeoMeta),
				CreatedAt: postRow.CreatedAt.Time,
			}
			if jsonbToUrls, err := jsonbToUrls(postRow.Files); err == nil {
				postRepo.Files = mo.Some(jsonbToUrls)
			}
			if postRow.UpdatedAt.Valid {
				postRepo.UpdatedAt = postRow.UpdatedAt.Time
			}
			stats, err := r.stats(ctx, int(postRow.ID))
			// if there is an error, we will return the post without stats,
			// post stats for zero values will default to zero, so we can ignore the error here
			if err == nil {
				postRepo.PostStats = stats
			}
			tags, err := r.queries.PostTags(ctx, int32(postRow.ID))
			if err == nil {
				postRepo.Tags = tags
			}
			posts = append(posts, postRepo)
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

type SeoMeta struct {
	Description string   `json:"description"`
	OgImageUrl  string   `json:"ogImageUrl"`
	Keywords    []string `json:"keywords"`
}

func (r *PostsRepo) Get(ctx context.Context, postId int) (model.PostRepoInfo, error) {
	postRow, err := r.queries.PostGetById(ctx, int32(postId))
	if err != nil {
		return model.PostRepoInfo{}, err
	}

	post := model.PostRepoInfo{
		ID:         int(postRow.ID),
		UUID:       uuid.UUID(postRow.Uuid.Bytes),
		UserID:     int(postRow.UserID),
		CategoryID: int(postRow.CategoryID),
		Title:      postRow.Title,
		Content:    postRow.Content,
		SeoMeta:    extractSeoMeta(postRow.SeoMeta),
		CreatedAt:  postRow.CreatedAt.Time,
	}
	if filesUrls, err := jsonbToUrls(postRow.Files); err == nil {
		post.Files = mo.Some(filesUrls)
	}
	if postRow.UpdatedAt.Valid {
		post.UpdatedAt = postRow.UpdatedAt.Time
	}
	stats, err := r.stats(ctx, post.ID)
	// if there is an error, we will return the post without stats,
	// post stats for zero values will default to zero, so we can ignore the error here
	if err == nil {
		post.PostStats = stats
	}
	tags, err := r.queries.PostTags(ctx, int32(postRow.ID))
	if err == nil {
		post.Tags = tags
	}

	return post, err
}

func jsonbToUrls(jsonb []byte) ([]url.URL, error) {
	if jsonb == nil {
		return nil, nil
	}
	urlStrings := make([]string, 0)
	if err := json.Unmarshal(jsonb, &urlStrings); err != nil {
		return nil, err
	}
	urls := make([]url.URL, 0, len(urlStrings))
	for _, s := range urlStrings {
		parsedUrl, err := url.Parse(s)
		if err == nil {
			urls = append(urls, *parsedUrl)
		}
	}
	return urls, nil
}

func extractSeoMeta(seoJsonb []byte) model.SeoMeta {
	if len(seoJsonb) == 0 {
		return model.SeoMeta{}
	}
	var seoMeta SeoMeta
	if err := json.Unmarshal(seoJsonb, &seoMeta); err == nil {
		res := model.SeoMeta{
			Description: seoMeta.Description,
			Keywords:    seoMeta.Keywords,
		}
		ogImageUrl, err := url.Parse(seoMeta.OgImageUrl)
		if err == nil {
			res.OgImageUrl = ogImageUrl
		}
		return res
	}
	return model.SeoMeta{}
}

func (r *PostsRepo) stats(ctx context.Context, postId int) (model.PostStats, error) {
	row, err := r.queries.PostStats(ctx, int32(postId))
	if err != nil {
		return model.PostStats{}, err
	}
	return model.PostStats{
		CommentsCount: int(row.CommentsCount),
		LikesCount:    int(row.LikesCount),
		ViewsCount:    int(row.ViewsCount),
	}, nil
}
