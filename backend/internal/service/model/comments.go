// SPDX-License-Identifier: MIT
// Copyright 2026 Alex Syrnikov <alex19srv@gmail.com>

package model

import "time"

type Comment struct {
	ID        int
	ParentID  int
	PostID    int
	UserID    int
	Content   string
	CreatedAt time.Time
	UpdatedAt time.Time
}

type CommentInfo struct {
	ID        int
	ParentID  int
	PostID    int
	Author    MessageAuthor
	Content   string
	CreatedAt time.Time
	UpdatedAt time.Time
}
type CommentListItem struct {
	ID        int
	ParentID  int
	Author    MessageAuthor
	Content   string
	CreatedAt time.Time
	UpdatedAt time.Time
}

type CommentCreate struct {
	PostID          int
	ParentCommentID int
	UserID          int
	Content         string
}
