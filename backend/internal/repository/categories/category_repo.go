// SPDX-License-Identifier: MIT
// Copyright 2026 Alex Syrnikov <alex19srv@gmail.com>

package category

import (
	"context"
	"fmt"
	"sync"

	"github.com/comunicore/comunicore/backend/internal/apperror"
	"github.com/comunicore/comunicore/backend/internal/repository"
	categoryDb "github.com/comunicore/comunicore/backend/internal/repository/sqlc/db"
	"github.com/comunicore/comunicore/backend/internal/service/model"
)

type CategoryRepo struct {
	queries     *categoryDb.Queries
	mu          sync.RWMutex
	idToName    map[int]string
	nameToID    map[string]int
	initialized bool
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
		queries:  categoryDb.New(pool),
		idToName: make(map[int]string),
		nameToID: make(map[string]int),
	}
	if err := repo.ensureCache(context.Background()); err != nil {
		return nil, err
	}
	return repo, nil
}

func NewCategoryRepoWithQueries(queries *categoryDb.Queries) *CategoryRepo {
	return &CategoryRepo{
		queries:  queries,
		idToName: make(map[int]string),
		nameToID: make(map[string]int),
	}
}

func (r *CategoryRepo) ensureCache(ctx context.Context) error {
	r.mu.RLock()
	if r.initialized {
		r.mu.RUnlock()
		return nil
	}
	r.mu.RUnlock()

	r.mu.Lock()
	defer r.mu.Unlock()
	if r.initialized {
		return nil
	}
	return r.loadCacheLocked(ctx)
}

func (r *CategoryRepo) loadCacheLocked(ctx context.Context) error {
	rows, err := r.queries.GetAllCategories(ctx)
	if err != nil {
		return apperror.PgErrorToAppError(err)
	}

	idToName := make(map[int]string, len(rows)+1)
	nameToID := make(map[string]int, len(rows)+1)
	for _, row := range rows {
		id := int(row.ID)
		idToName[id] = row.Name
		nameToID[row.Name] = id
	}
	if _, ok := idToName[defaultCategory.ID]; !ok {
		idToName[defaultCategory.ID] = defaultCategory.Name
		nameToID[defaultCategory.Name] = defaultCategory.ID
	}

	r.idToName = idToName
	r.nameToID = nameToID
	r.initialized = true
	return nil
}

func (r *CategoryRepo) Reload(ctx context.Context) error {
	r.mu.Lock()
	defer r.mu.Unlock()
	return r.loadCacheLocked(ctx)
}

// get all categories (id, name)
func (r *CategoryRepo) GetAllList(ctx context.Context) ([]model.Category, error) {
	if err := r.ensureCache(ctx); err != nil {
		return nil, err
	}
	r.mu.RLock()
	defer r.mu.RUnlock()

	categories := make([]model.Category, 0, len(r.idToName))
	for id, name := range r.idToName {
		categories = append(categories, model.Category{
			ID:   id,
			Name: name,
		})
	}
	return categories, nil
}

// get categories (id, name) by list of category IDs
func (r *CategoryRepo) GetDictByIDList(ctx context.Context, idList []int64) (map[int]model.Category, error) {
	if err := r.ensureCache(ctx); err != nil {
		return nil, err
	}
	r.mu.RLock()
	defer r.mu.RUnlock()

	categories := make(map[int]model.Category, len(idList))
	for _, id := range idList {
		intID := int(id)
		if name, ok := r.idToName[intID]; ok {
			categories[intID] = model.Category{
				ID:   intID,
				Name: name,
			}
		}
	}
	return categories, nil
}

func (r *CategoryRepo) GetCategoryByID(ctx context.Context, id int64) (model.Category, error) {
	if err := r.ensureCache(ctx); err != nil {
		return model.Category{}, err
	}
	r.mu.RLock()
	defer r.mu.RUnlock()

	intID := int(id)
	name, ok := r.idToName[intID]
	if !ok {
		return model.Category{}, fmt.Errorf("category with ID %d not found", intID)
	}
	return model.Category{
		ID:   intID,
		Name: name,
	}, nil
}

func (r *CategoryRepo) GetCategoryByName(ctx context.Context, name string) (model.Category, error) {
	if err := r.ensureCache(ctx); err != nil {
		return model.Category{}, err
	}
	r.mu.RLock()
	defer r.mu.RUnlock()

	id, ok := r.nameToID[name]
	if !ok {
		return model.Category{}, fmt.Errorf("category with name %s not found", name)
	}
	return model.Category{
		ID:   id,
		Name: name,
	}, nil
}
