package handler

import (
	"context"

	api "github.com/comunicore/comunicore/backend/internal/handler/generated"
	analyticsService "github.com/comunicore/comunicore/backend/internal/service/analytics"
	"github.com/comunicore/comunicore/backend/internal/service/model"
)

type AnalyticsHandler struct {
	svc *analyticsService.AnalyticsService
}

func NewAnalyticsHandler(svc *analyticsService.AnalyticsService) *AnalyticsHandler {
	return &AnalyticsHandler{svc: svc}
}

func (h *AnalyticsHandler) AnalyticsVisitBatchSubmit(ctx context.Context, req *api.AnalyticsVisitBatchRequest) (api.AnalyticsVisitBatchSubmitRes, error) {
	globalCtx := GlobalContextFromContext(ctx)
	var uid *int
	if globalCtx != nil && globalCtx.UserIDIsSet {
		u := globalCtx.UserID
		uid = &u
	}

	compose := false
	if req.HadComposeActivity.IsSet() {
		compose = req.HadComposeActivity.Value
	}
	read := true
	if req.HadReadActivity.IsSet() {
		read = req.HadReadActivity.Value
	}

	if err := h.svc.RecordVisitBatch(ctx, model.AnalyticsVisitBatchInsert{
		UserID:             uid,
		ClientBatchID:      req.ClientBatchId,
		ActiveDurationMs:   req.ActiveDurationMs,
		VisibleDurationMs:  req.VisibleDurationMs,
		IsMobile:           req.IsMobile,
		HadComposeActivity: compose,
		HadReadActivity:    read,
		BatchStartAt:       req.BatchStartAt,
		BatchEndAt:         req.BatchEndAt,
	}); err != nil {
		return nil, err
	}
	return &api.AnalyticsVisitBatchSubmitNoContent{}, nil
}

func (h *AnalyticsHandler) AnalyticsMetricsGet(ctx context.Context, params api.AnalyticsMetricsGetParams) (api.AnalyticsMetricsGetRes, error) {
	dropN := 5
	if params.DropoffAfterMessages.IsSet() {
		dropN = params.DropoffAfterMessages.Value
	}
	inactiveDays := 30
	if params.DropoffInactiveDays.IsSet() {
		inactiveDays = params.DropoffInactiveDays.Value
	}

	m, err := h.svc.Metrics(ctx, dropN, inactiveDays)
	if err != nil {
		return nil, err
	}

	resp := &api.AnalyticsMetricsResponse{
		AvgActiveTimeMs:      m.AvgActiveTimeMs,
		AvgVisibleTimeMs:     m.AvgVisibleTimeMs,
		MaxActiveTimeMs:      m.MaxActiveTimeMs,
		ConnectionDensity:    m.ConnectionDensity,
		DropoffChurnPercent:  m.DropoffChurnPercent,
		MobilePctReaders:     m.MobilePctReaders,
		MobilePctWriters:     m.MobilePctWriters,
		MobilePctSessions:    m.MobilePctSessions,
		MobilePctUsers:       m.MobilePctUsers,
		DropoffAfterMessages: dropN,
		DropoffInactiveDays:  inactiveDays,
	}

	for _, hrow := range m.ActivityByHourUTC {
		resp.ActivityByHourUtc = append(resp.ActivityByHourUtc, api.AnalyticsHourBucket{
			Hour:         hrow.Hour,
			SharePercent: hrow.SharePercent,
		})
	}

	if m.TopTag != nil {
		resp.TopTag = api.NewOptAnalyticsTopTag(api.AnalyticsTopTag{
			Tag:        m.TopTag.Tag,
			UsageCount: m.TopTag.UsageCount,
		})
	}

	if m.TopThreadWeekly != nil {
		resp.TopThreadWeekly = api.NewOptAnalyticsTopThread(api.AnalyticsTopThread{
			ThreadId:        m.TopThreadWeekly.ThreadID,
			Title:           m.TopThreadWeekly.Title,
			RepliesInWindow: m.TopThreadWeekly.RepliesInWindow,
		})
	}

	if m.TopThreadMonthly != nil {
		resp.TopThreadMonthly = api.NewOptAnalyticsTopThread(api.AnalyticsTopThread{
			ThreadId:        m.TopThreadMonthly.ThreadID,
			Title:           m.TopThreadMonthly.Title,
			RepliesInWindow: m.TopThreadMonthly.RepliesInWindow,
		})
	}

	for _, row := range m.TopUsersByPosts {
		resp.TopUsersByPosts = append(resp.TopUsersByPosts, api.AnalyticsUserCount{
			UserId: row.UserID,
			Name:   row.Name,
			Count:  row.Count,
		})
	}

	for _, row := range m.PopularTags {
		resp.PopularTags = append(resp.PopularTags, api.AnalyticsTagCount{
			Tag:         row.Tag,
			ThreadCount: row.ThreadCount,
		})
	}

	for _, row := range m.PostsActivityByDay {
		resp.PostsActivityByDay = append(resp.PostsActivityByDay, api.AnalyticsDayPosts{
			Day:        row.Day,
			PostsCount: row.PostsCount,
		})
	}

	for _, row := range m.TopUsersByThreads {
		resp.TopUsersByThreads = append(resp.TopUsersByThreads, api.AnalyticsUserCount{
			UserId: row.UserID,
			Name:   row.Name,
			Count:  row.Count,
		})
	}

	for _, row := range m.PostOnlyUsers {
		resp.PostOnlyUsers = append(resp.PostOnlyUsers, api.AnalyticsUserCount{
			UserId: row.UserID,
			Name:   row.Name,
			Count:  row.Count,
		})
	}

	return resp, nil
}
