// SPDX-License-Identifier: MIT
// Copyright 2026 Alex Syrnikov <alex19srv@gmail.com>

package category

import (
	"context"
	"fmt"
	"sync/atomic"

	"github.com/comunicore/comunicore/backend/internal/apperror"
	"github.com/comunicore/comunicore/backend/internal/repository"
	categoryDb "github.com/comunicore/comunicore/backend/internal/repository/sqlc/db"
	"github.com/comunicore/comunicore/backend/internal/service/model"
)

type dataCache struct {
	idToName map[int]string
	nameToID map[string]int
}
type CategoryRepo struct {
	queries     *categoryDb.Queries
	atomicCache atomic.Pointer[dataCache]
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

	repo := &CategoryRepo{
		queries: categoryDb.New(pool),
	}
	if cache, err := repo.loadCacheFromDB(context.Background()); err != nil {
		return nil, err
	} else {
		repo.atomicCache.Store(cache)
	}

	return repo, nil
}

func NewCategoryRepoWithQueries(queries *categoryDb.Queries) *CategoryRepo {
	return &CategoryRepo{
		queries: queries,
	}
}

// check cache filled or fill it if not
func (r *CategoryRepo) ensureCache(ctx context.Context) (*dataCache, error) {
	var cache *dataCache = r.atomicCache.Load()
	if cache != nil {
		return cache, nil
	}

	cache, err := r.loadCacheFromDB(ctx)
	if err != nil {
		return nil, err
	}
	r.atomicCache.Store(cache)

	return cache, nil
}

func (r *CategoryRepo) loadCacheFromDB(ctx context.Context) (*dataCache, error) {
	rows, err := r.queries.GetAllCategories(ctx)
	if err != nil {
		return nil, apperror.PgErrorToAppError(err)
	}

	res := &dataCache{
		idToName: make(map[int]string, len(rows)+1),
		nameToID: make(map[string]int, len(rows)+1),
	}
	for _, row := range rows {
		id := int(row.ID)
		res.idToName[id] = row.Name
		res.nameToID[row.Name] = id
	}
	if _, ok := res.idToName[defaultCategory.ID]; !ok {
		res.idToName[defaultCategory.ID] = defaultCategory.Name
		res.nameToID[defaultCategory.Name] = defaultCategory.ID
	}

	return res, nil
}

func (r *CategoryRepo) Reload(ctx context.Context) error {
	cache, err := r.loadCacheFromDB(ctx)
	if err != nil {
		return err
	}
	r.atomicCache.Store(cache)

	return nil
}

// get all categories (id, name)
func (r *CategoryRepo) GetAllList(ctx context.Context) ([]model.Category, error) {
	cache, err := r.ensureCache(ctx)
	if err != nil {
		return nil, err
	}

	categories := make([]model.Category, 0, len(cache.idToName))
	for id, name := range cache.idToName {
		categories = append(categories, model.Category{
			ID:   id,
			Name: name,
		})
	}
	return categories, nil
}

// get categories (id, name) by list of category IDs
func (r *CategoryRepo) GetDictByIDList(ctx context.Context, idList []int64) (map[int]model.Category, error) {
	cache, err := r.ensureCache(ctx)
	if err != nil {
		return nil, err
	}

	categories := make(map[int]model.Category, len(idList))
	for _, id := range idList {
		intID := int(id)
		if name, ok := cache.idToName[intID]; ok {
			categories[intID] = model.Category{
				ID:   intID,
				Name: name,
			}
		}
	}
	return categories, nil
}

func (r *CategoryRepo) GetCategoryByID(ctx context.Context, id int64) (model.Category, error) {
	cache, err := r.ensureCache(ctx)
	if err != nil {
		return model.Category{}, err
	}

	intID := int(id)
	name, ok := cache.idToName[intID]
	if !ok {
		return model.Category{}, fmt.Errorf("category with ID %d not found", intID)
	}
	return model.Category{
		ID:   intID,
		Name: name,
	}, nil
}

func (r *CategoryRepo) GetCategoryByName(ctx context.Context, name string) (model.Category, error) {
	cache, err := r.ensureCache(ctx)
	if err != nil {
		return model.Category{}, err
	}

	id, ok := cache.nameToID[name]
	if !ok {
		return model.Category{}, fmt.Errorf("category with name %s not found", name)
	}
	return model.Category{
		ID:   id,
		Name: name,
	}, nil
}
