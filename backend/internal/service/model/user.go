// SPDX-License-Identifier: MIT
// Copyright 2026 Alex Syrnikov <alex19srv@gmail.com>

package model

import (
	"net/url"
	"time"
)

type UserRepo struct {
	ID          int
	Name        string
	DisplayName string
	Email       string
	AvatarURL   *url.URL
	Rank        int
	CreatedAt   time.Time
}

type MessageAuthor struct {
	ID          int
	Username    string
	DisplayName string
	AvatarUrl   *url.URL
	Rank        int
}
