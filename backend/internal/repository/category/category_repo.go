// SPDX-License-Identifier: MIT
// Copyright 2026 Alex Syrnikov <alex19srv@gmail.com>

package category

import (
	"context"

	"github.com/comunicore/comunicore/backend/internal/apperror"
	"github.com/comunicore/comunicore/backend/internal/repository"
	categoryDb "github.com/comunicore/comunicore/backend/internal/repository/sqlc/db"
	"github.com/comunicore/comunicore/backend/internal/service/model"
)

type CategoryRepo struct {
	queries *categoryDb.Queries
}

var defaultCategory = model.Category{ID: 0, Name: "default"}

func (r *CategoryRepo) DefaultCategory() model.Category {
	return defaultCategory
}

func NewCategoryRepo(dsn string) (*CategoryRepo, error) {
	pool, err := repository.PgPool(dsn)
	if err != nil {
		return nil, err
	}

	return &CategoryRepo{
		queries: categoryDb.New(pool),
	}, nil
}

func (r *CategoryRepo) GetDictByIDList(ctx context.Context, idList []int64) (map[int]model.Category, error) {
	// TODO: add caching for categories, because they are not changed frequently
	rows, err := r.queries.GetCategoriesByIDList(ctx, idList)
	if err != nil {
		return nil, apperror.PgErrorToAppError(err)
	}
	categories := make(map[int]model.Category, len(rows))
	for _, row := range rows {
		categories[int(row.ID)] = model.Category{
			ID:   int(row.ID),
			Name: row.Name,
		}
	}
	return categories, nil
}
