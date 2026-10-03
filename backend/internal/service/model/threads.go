// SPDX-License-Identifier: MIT
// Copyright 2026 Alex Syrnikov <alex19srv@gmail.com>

package model

import "time"

type ThreadWithComments struct {
	ID              int
	AuthorID        int
	AuthorName      string
	AuthorAvatarUrl string
	Title           string
	Content         string
	CommentsCount   int
	CreatedAt       time.Time
	Posts           []PostListItem
}

type ThreadCreate struct {
	Title   string
	Content string
	UserID  int
	Tags    []string
}
type ThreadRepoInfo struct {
	ID            int
	Title         string
	Content       string
	UserID        int
	CommentsCount int
	CreatedAt     time.Time
}
type ThreadListRepo struct {
	Threads []ThreadRepoInfo

	TotalCountEstimated int
	HavePrev            bool
	HaveNext            bool
}
type ThreadInfoResponse struct {
	ID              int
	Title           string
	Content         string
	AuthorID        int
	AuthorName      string
	AuthorAvatarUrl string
	CommentsCount   int
	CreatedAt       time.Time
}

type ThreadListResponse struct {
	Threads []ThreadInfoResponse

	TotalCountEstimated int
	HavePrev            bool
	HaveNext            bool
}

type ThreadInfo struct {
	ID            int
	Title         string
	Content       string
	UserID        int
	UserName      string
	CommentsCount int
	CreatedAt     time.Time
}
