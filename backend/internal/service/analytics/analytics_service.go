package analytics

import (
	"context"

	"github.com/comunicore/comunicore/backend/internal/service/model"
)

type AnalyticsRepo interface {
	InsertVisitBatch(ctx context.Context, batch model.AnalyticsVisitBatchInsert) error
	GetMetrics(ctx context.Context, dropoffN, dropoffInactiveDays int) (model.AnalyticsMetricsRepo, error)
}

type AnalyticsService struct {
	repo AnalyticsRepo
}

func NewAnalyticsService(repo AnalyticsRepo) *AnalyticsService {
	return &AnalyticsService{repo: repo}
}

func (s *AnalyticsService) RecordVisitBatch(ctx context.Context, batch model.AnalyticsVisitBatchInsert) error {
	return s.repo.InsertVisitBatch(ctx, batch)
}

func (s *AnalyticsService) Metrics(ctx context.Context, dropoffN, dropoffInactiveDays int) (model.AnalyticsMetricsRepo, error) {
	if dropoffN < 1 {
		dropoffN = 1
	}
	if dropoffInactiveDays < 1 {
		dropoffInactiveDays = 30
	}
	return s.repo.GetMetrics(ctx, dropoffN, dropoffInactiveDays)
}
