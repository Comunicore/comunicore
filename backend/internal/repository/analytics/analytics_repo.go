package analytics

import (
	"context"
	"errors"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/hetagdarchiev/comunicore/backend/internal/repository"
	analyticsDb "github.com/hetagdarchiev/comunicore/backend/internal/repository/sqlc/db"
	"github.com/hetagdarchiev/comunicore/backend/internal/service/model"
)

type AnalyticsRepo struct {
	dbpool  *pgxpool.Pool
	queries *analyticsDb.Queries
}

func NewAnalyticsRepo(dsn string) (*AnalyticsRepo, error) {
	pool, err := repository.PgPool(dsn)
	if err != nil {
		return nil, err
	}
	return &AnalyticsRepo{dbpool: pool, queries: analyticsDb.New(pool)}, nil
}

func pgUUID(u uuid.UUID) pgtype.UUID {
	return pgtype.UUID{Bytes: u, Valid: true}
}

func pgTimestamptz(t time.Time) pgtype.Timestamptz {
	return pgtype.Timestamptz{Time: t, Valid: true}
}

func (r *AnalyticsRepo) InsertVisitBatch(ctx context.Context, batch model.AnalyticsVisitBatchInsert) error {
	uid := pgtype.Int4{Valid: false}
	if batch.UserID != nil {
		uid = pgtype.Int4{Int32: int32(*batch.UserID), Valid: true}
	}
	return r.queries.AnalyticsVisitBatchInsert(ctx, analyticsDb.AnalyticsVisitBatchInsertParams{
		UserID:             uid,
		ClientBatchID:      pgUUID(batch.ClientBatchID),
		ActiveDurationMs:   batch.ActiveDurationMs,
		VisibleDurationMs:  batch.VisibleDurationMs,
		IsMobile:           batch.IsMobile,
		HadComposeActivity: batch.HadComposeActivity,
		HadReadActivity:    batch.HadReadActivity,
		BatchStartAt:       pgTimestamptz(batch.BatchStartAt),
		BatchEndAt:         pgTimestamptz(batch.BatchEndAt),
	})
}

func (r *AnalyticsRepo) GetMetrics(ctx context.Context, dropoffN, dropoffInactiveDays int) (model.AnalyticsMetricsRepo, error) {
	var out model.AnalyticsMetricsRepo

	dur, err := r.queries.AnalyticsAvgDurations(ctx)
	if err != nil {
		return out, err
	}
	out.AvgActiveTimeMs = dur.AvgActiveMs
	out.AvgVisibleTimeMs = dur.AvgVisibleMs
	out.MaxActiveTimeMs = dur.MaxActiveMs

	out.ConnectionDensity, err = r.queries.AnalyticsConnectionDensity(ctx)
	if err != nil {
		return out, err
	}

	out.DropoffChurnPercent, err = r.queries.AnalyticsDropoffPercent(ctx, analyticsDb.AnalyticsDropoffPercentParams{
		ThresholdN:   int32(dropoffN),
		InactiveDays: int32(dropoffInactiveDays),
	})
	if err != nil {
		return out, err
	}

	mobileSess, err := r.queries.AnalyticsMobileSessionShares(ctx)
	if err != nil {
		return out, err
	}
	out.MobilePctReaders = mobileSess.PctMobileReaders
	out.MobilePctWriters = mobileSess.PctMobileWriters
	out.MobilePctSessions = mobileSess.PctMobileSessions

	out.MobilePctUsers, err = r.queries.AnalyticsMobileUserPercent(ctx)
	if err != nil {
		return out, err
	}

	hours, err := r.queries.AnalyticsActivityHourDistribution(ctx)
	if err != nil {
		return out, err
	}
	out.ActivityByHourUTC = make([]model.AnalyticsHourShare, 0, len(hours))
	for _, h := range hours {
		out.ActivityByHourUTC = append(out.ActivityByHourUTC, model.AnalyticsHourShare{
			Hour:         int(h.HourUtc),
			SharePercent: h.SharePercent,
		})
	}

	tagRow, err := r.queries.AnalyticsTopTag(ctx)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			out.TopTag = nil
		} else {
			return out, err
		}
	} else {
		out.TopTag = &model.AnalyticsTopTag{
			Tag:        tagRow.Tag,
			UsageCount: tagRow.UsageCount,
		}
	}

	now := time.Now().UTC()
	weekStart := now.AddDate(0, 0, -7)
	monthStart := now.AddDate(0, -1, 0)

	weekRow, err := r.queries.AnalyticsTopThreadInRange(ctx, analyticsDb.AnalyticsTopThreadInRangeParams{
		StartAt: pgTimestamptz(weekStart),
		EndAt:   pgTimestamptz(now),
	})
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			out.TopThreadWeekly = nil
		} else {
			return out, err
		}
	} else {
		out.TopThreadWeekly = &model.AnalyticsTopThread{
			ThreadID:        int(weekRow.ID),
			Title:           weekRow.Title,
			RepliesInWindow: weekRow.ReplyCountInRange,
		}
	}

	monthRow, err := r.queries.AnalyticsTopThreadInRange(ctx, analyticsDb.AnalyticsTopThreadInRangeParams{
		StartAt: pgTimestamptz(monthStart),
		EndAt:   pgTimestamptz(now),
	})
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			out.TopThreadMonthly = nil
		} else {
			return out, err
		}
	} else {
		out.TopThreadMonthly = &model.AnalyticsTopThread{
			ThreadID:        int(monthRow.ID),
			Title:           monthRow.Title,
			RepliesInWindow: monthRow.ReplyCountInRange,
		}
	}

	topUsersByPosts, err := r.queries.AnalyticsTopUsersByComments(ctx)
	if err != nil {
		return out, err
	}
	out.TopUsersByPosts = make([]model.AnalyticsUserCount, 0, len(topUsersByPosts))
	for _, row := range topUsersByPosts {
		out.TopUsersByPosts = append(out.TopUsersByPosts, model.AnalyticsUserCount{
			UserID: int(row.ID),
			Name:   row.Name,
			Count:  row.CommentCount,
		})
	}

	popularTags, err := r.queries.AnalyticsPopularTagsByThreadCount(ctx)
	if err != nil {
		return out, err
	}
	out.PopularTags = make([]model.AnalyticsTagCount, 0, len(popularTags))
	for _, row := range popularTags {
		out.PopularTags = append(out.PopularTags, model.AnalyticsTagCount{
			Tag:         row.Tag,
			ThreadCount: row.ThreadCount,
		})
	}

	postsByDay, err := r.queries.AnalyticsCommentsActivityByDay(ctx)
	if err != nil {
		return out, err
	}
	out.PostsActivityByDay = make([]model.AnalyticsDayPosts, 0, len(postsByDay))
	for _, row := range postsByDay {
		out.PostsActivityByDay = append(out.PostsActivityByDay, model.AnalyticsDayPosts{
			Day:        row.Day.Time,
			PostsCount: row.CommentsCount,
		})
	}

	topUsersByThreads, err := r.queries.AnalyticsTopUsersByThreads(ctx)
	if err != nil {
		return out, err
	}
	out.TopUsersByThreads = make([]model.AnalyticsUserCount, 0, len(topUsersByThreads))
	for _, row := range topUsersByThreads {
		out.TopUsersByThreads = append(out.TopUsersByThreads, model.AnalyticsUserCount{
			UserID: int(row.ID),
			Name:   row.Name,
			Count:  row.ThreadCount,
		})
	}

	postOnlyUsers, err := r.queries.AnalyticsUsersWithCommentsButNoThreads(ctx)
	if err != nil {
		return out, err
	}
	out.PostOnlyUsers = make([]model.AnalyticsUserCount, 0, len(postOnlyUsers))
	for _, row := range postOnlyUsers {
		out.PostOnlyUsers = append(out.PostOnlyUsers, model.AnalyticsUserCount{
			UserID: int(row.ID),
			Name:   row.Name,
			Count:  row.CommentCount,
		})
	}

	return out, nil
}
