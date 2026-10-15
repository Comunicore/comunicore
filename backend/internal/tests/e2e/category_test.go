// SPDX-License-Identifier: MIT
// Copyright 2026 Alex Syrnikov <alex19srv@gmail.com>

package e2e

import (
	"context"
	"errors"
	"fmt"
	"sync"
	"testing"

	"github.com/jackc/pgx/v5"
	"github.com/stretchr/testify/require"

	"github.com/comunicore/comunicore/backend/internal/repository"
	categoryRepo "github.com/comunicore/comunicore/backend/internal/repository/category"
)

func getTestDSN() string {
	return fmt.Sprintf("postgres://%s:%s@%s:%d/%s",
		globalConfig.DbUser, globalConfig.DbPassword,
		globalConfig.DbHost, globalConfig.DbPort,
		globalConfig.DbName,
	)
}

func TestCategoryRepo_CacheAndLookup(t *testing.T) {
	ctx := context.Background()
	repo, err := categoryRepo.NewCategoryRepo(getTestDSN())
	require.NoError(t, err)

	// Default category
	defCat := repo.DefaultCategory()
	require.Equal(t, 0, defCat.ID)
	require.Equal(t, "default", defCat.Name)

	// GetCategoryByID
	cat0, err := repo.GetCategoryByID(ctx, 0)
	require.NoError(t, err)
	require.Equal(t, 0, cat0.ID)
	require.Equal(t, "default", cat0.Name)

	cat1, err := repo.GetCategoryByID(ctx, 1)
	require.NoError(t, err)
	require.Equal(t, 1, cat1.ID)
	require.Equal(t, "Программирование", cat1.Name)

	_, err = repo.GetCategoryByID(ctx, 99999)
	require.Error(t, err)
	require.True(t, errors.Is(err, pgx.ErrNoRows))

	// GetCategoryByName
	byName0, err := repo.GetCategoryByName(ctx, "default")
	require.NoError(t, err)
	require.Equal(t, 0, byName0.ID)
	require.Equal(t, "default", byName0.Name)

	byName1, err := repo.GetCategoryByName(ctx, "Программирование")
	require.NoError(t, err)
	require.Equal(t, 1, byName1.ID)
	require.Equal(t, "Программирование", byName1.Name)

	_, err = repo.GetCategoryByName(ctx, "Несуществующая категория")
	require.Error(t, err)
	require.True(t, errors.Is(err, pgx.ErrNoRows))

	// GetDictByIDList
	dict, err := repo.GetDictByIDList(ctx, []int64{0, 1, 99999})
	require.NoError(t, err)
	require.Len(t, dict, 2)
	require.Equal(t, "default", dict[0].Name)
	require.Equal(t, "Программирование", dict[1].Name)

	emptyDict, err := repo.GetDictByIDList(ctx, []int64{})
	require.NoError(t, err)
	require.Empty(t, emptyDict)
}

func TestCategoryRepo_CacheReload(t *testing.T) {
	ctx := context.Background()
	dsn := getTestDSN()
	repo, err := categoryRepo.NewCategoryRepo(dsn)
	require.NoError(t, err)

	pool, err := repository.PgPool(dsn)
	require.NoError(t, err)

	newCategoryName := "Садоводство"
	var insertedID int32
	err = pool.QueryRow(ctx, "INSERT INTO categories (name) VALUES ($1) ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name RETURNING id", newCategoryName).Scan(&insertedID)
	require.NoError(t, err)

	// Before reload: should NOT be in cache
	_, err = repo.GetCategoryByName(ctx, newCategoryName)
	require.Error(t, err)
	require.True(t, errors.Is(err, pgx.ErrNoRows))

	// After reload: should be in cache
	err = repo.Reload(ctx)
	require.NoError(t, err)

	catReloaded, err := repo.GetCategoryByName(ctx, newCategoryName)
	require.NoError(t, err)
	require.Equal(t, int(insertedID), catReloaded.ID)
	require.Equal(t, newCategoryName, catReloaded.Name)

	catByID, err := repo.GetCategoryByID(ctx, int64(insertedID))
	require.NoError(t, err)
	require.Equal(t, newCategoryName, catByID.Name)
}

func TestCategoryRepo_ConcurrentReads(t *testing.T) {
	ctx := context.Background()
	repo, err := categoryRepo.NewCategoryRepo(getTestDSN())
	require.NoError(t, err)

	var wg sync.WaitGroup
	const goroutines = 30
	for i := 0; i < goroutines; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			for j := 0; j < 50; j++ {
				c, err := repo.GetCategoryByID(ctx, 1)
				if err != nil || c.Name != "Программирование" {
					t.Errorf("unexpected result: %v, %v", c, err)
				}
				c2, err := repo.GetCategoryByName(ctx, "Программирование")
				if err != nil || c2.ID != 1 {
					t.Errorf("unexpected result: %v, %v", c2, err)
				}
				dict, err := repo.GetDictByIDList(ctx, []int64{0, 1})
				if err != nil || len(dict) < 2 {
					t.Errorf("unexpected dict: %v, %v", dict, err)
				}
			}
		}()
	}
	wg.Wait()
}
