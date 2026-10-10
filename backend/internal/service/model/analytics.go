// SPDX-License-Identifier: MIT
// Copyright 2026 Alex Syrnikov <alex19srv@gmail.com>

package model

import (
	"time"

	"github.com/google/uuid"
)

type AnalyticsVisitBatchInsert struct {
	UserID             *int
	ClientBatchID      uuid.UUID
	ActiveDurationMs   int64
	VisibleDurationMs  int64
	IsMobile           bool
	HadComposeActivity bool
	HadReadActivity    bool
	BatchStartAt       time.Time
	BatchEndAt         time.Time
}

type AnalyticsHourShare struct {
	Hour         int
	SharePercent float64
}

type AnalyticsTopTag struct {
	Tag        string
	UsageCount int64
}

type AnalyticsTopThread struct {
	ThreadID        int
	Title           string
	RepliesInWindow int64
}

type AnalyticsUserCount struct {
	UserID int
	Name   string
	Count  int64
}

type AnalyticsTagCount struct {
	Tag       string
	PostCount int64
}

type AnalyticsDayPosts struct {
	Day        time.Time
	PostsCount int64
}

type AnalyticsMetricsRepo struct {
	AvgActiveTimeMs     float64
	AvgVisibleTimeMs    float64
	MaxActiveTimeMs     int64
	ConnectionDensity   float64
	DropoffChurnPercent float64
	MobilePctReaders    float64
	MobilePctWriters    float64
	MobilePctSessions   float64
	MobilePctUsers      float64
	ActivityByHourUTC   []AnalyticsHourShare
	TopTag              *AnalyticsTopTag
	TopThreadWeekly     *AnalyticsTopThread
	TopThreadMonthly    *AnalyticsTopThread
	TopUsersByPosts     []AnalyticsUserCount
	PopularTags         []AnalyticsTagCount
	PostsActivityByDay  []AnalyticsDayPosts
	TopUsersByThreads   []AnalyticsUserCount
	PostOnlyUsers       []AnalyticsUserCount
}
