// SPDX-License-Identifier: MIT
// Copyright 2026 Alex Syrnikov <alex19srv@gmail.com>

package model

import "time"

type Comment struct {
	ID        int
	PostID    int
	UserID    int
	Content   string
	CreatedAt time.Time
}
type CommentInfo struct {
	ID        int
	PostID    int
	UserID    int
	UserName  string
	Content   string
	CreatedAt time.Time
}
type CommentListItem struct {
	ID              int
	UserID          int
	UserName        string
	AuthorAvatarUrl string
	Content         string
	CreatedAt       time.Time
}

type CommentCreate struct {
	PostID  int
	UserID  int
	Content string
}
