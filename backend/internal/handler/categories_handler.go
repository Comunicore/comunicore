// SPDX-License-Identifier: MIT
// Copyright 2026 Alex Syrnikov <alex19srv@gmail.com>

package handler

import (
	"context"

	api "github.com/comunicore/comunicore/backend/internal/handler/generated"
	categoriesService "github.com/comunicore/comunicore/backend/internal/service/categories"
)

type CategoriesHandler struct {
	categoriesService *categoriesService.CategoriesService
}

func NewCategoriesHandler(categoriesService *categoriesService.CategoriesService) *CategoriesHandler {
	return &CategoriesHandler{categoriesService: categoriesService}
}

func (h *CategoriesHandler) CategoriesList(ctx context.Context) (api.CategoriesListRes, error) {
	categories, err := h.categoriesService.GetAllList(ctx)
	if err != nil {
		return nil, err
	}

	response := make(api.CategoriesListResponse, len(categories))
	for i, category := range categories {
		response[i] = api.CategoriesListResponseItem{
			ID:   category.ID,
			Name: category.Name,
		}
	}
	return &response, nil
}
