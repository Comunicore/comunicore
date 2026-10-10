// SPDX-License-Identifier: MIT
// Copyright 2026 Alex Syrnikov <alex19srv@gmail.com>

package model

import "time"

type PostWithComments struct {
	ID              int
	AuthorID        int
	AuthorName      string
	AuthorAvatarUrl string
	Title           string
	Content         string
	CommentsCount   int
	CreatedAt       time.Time
	Comments        []CommentListItem
}

type PostCreate struct {
	Title   string
	Content string
	UserID  int
	Tags    []string
}
type PostRepoInfo struct {
	ID            int
	Title         string
	Content       string
	UserID        int
	CommentsCount int
	CreatedAt     time.Time
}
type PostListRepo struct {
	Posts []PostRepoInfo

	TotalCountEstimated int
	HavePrev            bool
	HaveNext            bool
}
type PostInfoResponse struct {
	ID              int
	Title           string
	Content         string
	AuthorID        int
	AuthorName      string
	AuthorAvatarUrl string
	CommentsCount   int
	CreatedAt       time.Time
}

type PostListResponse struct {
	Posts []PostInfoResponse

	TotalCountEstimated int
	HavePrev            bool
	HaveNext            bool
}

type PostInfo struct {
	ID            int
	Title         string
	Content       string
	UserID        int
	UserName      string
	CommentsCount int
	CreatedAt     time.Time
}
