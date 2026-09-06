// SPDX-License-Identifier: MIT
// Copyright 2026 Alex Syrnikov <alex19srv@gmail.com>

package model

import "time"

type User struct {
	ID        int
	Name      string
	Email     string
	AvatarURL string
	CreatedAt time.Time
}
