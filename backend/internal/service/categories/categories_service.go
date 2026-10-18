package categories

import (
	"context"

	"github.com/comunicore/comunicore/backend/internal/service/model"
)

type CategoryRepo interface {
	GetAllList(ctx context.Context) ([]model.Category, error)
}

type CategoriesService struct {
	repo CategoryRepo
}

func NewCategoriesService(repo CategoryRepo) *CategoriesService {
	return &CategoriesService{repo: repo}
}

func (s *CategoriesService) GetAllList(ctx context.Context) ([]model.Category, error) {
	return s.repo.GetAllList(ctx)
}
