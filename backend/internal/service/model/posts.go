// SPDX-License-Identifier: MIT
// Copyright 2026 Alex Syrnikov <alex19srv@gmail.com>

package model

import (
	"net/url"
	"time"
)

type PostWithComments struct {
	ID        int
	Category  string
	Author    MessageAuthor
	Title     string
	Content   string
	Tags      []string
	PostStats PostStats
	SeoMeta   SeoMeta
	CreatedAt time.Time
	UpdatedAt time.Time
	Comments  []CommentListItem
}
type PostCreateService struct {
	Category string
	Title    string
	Content  string
	UserID   int
	Tags     []string
}
type PostCreateRepo struct {
	CategoryID int
	Title      string
	Content    string
	UserID     int
	Tags       []string
}
type PostRepoInfo struct {
	ID         int
	CategoryID int
	Title      string
	Content    string
	UserID     int
	Tags       []string
	PostStats  PostStats
	SeoMeta    SeoMeta
	CreatedAt  time.Time
	UpdatedAt  time.Time
}
type PostListRepo struct {
	Posts []PostRepoInfo

	TotalCountEstimated int
	HavePrev            bool
	HaveNext            bool
}
type PostInfoResponse struct {
	ID        int
	Category  string
	Title     string
	Content   string
	Author    MessageAuthor
	Tags      []string
	PostStats PostStats
	SeoMeta   SeoMeta
	CreatedAt time.Time
	UpdatedAt time.Time
}

type PostListResponse struct {
	Posts []PostInfoResponse

	TotalCountEstimated int
	HavePrev            bool
	HaveNext            bool
}

type PostInfo struct {
	ID        int
	Category  string
	Title     string
	Content   string
	Author    MessageAuthor
	Tags      []string
	PostStats PostStats
	SeoMeta   SeoMeta
	CreatedAt time.Time
	UpdatedAt time.Time
}

type PostStats struct {
	CommentsCount int
	LikesCount    int
	ViewsCount    int
}
type SeoMeta struct {
	Description string
	OgImageUrl  *url.URL
	Keywords    []string
}

func (sm *SeoMeta) IsEmpty() bool {
	return len(sm.Description) == 0 && sm.OgImageUrl == nil && len(sm.Keywords) == 0
}
