// SPDX-License-Identifier: MIT
// Copyright 2026 Alex Syrnikov <alex19srv@gmail.com>

package handler

import (
	"context"
	"runtime/debug"

	api "github.com/comunicore/comunicore/backend/internal/handler/generated"
)

type VersionHandler struct {
}

func NewVersionHandler() *VersionHandler {
	return &VersionHandler{}
}
func (m *VersionHandler) VersionGet(ctx context.Context) (r api.VersionGetRes, _ error) {
	commitHash := "0000000000000000000000000000000000000000"
	info, ok := debug.ReadBuildInfo()
	if ok {
		for _, setting := range info.Settings {
			switch setting.Key {
			case "vcs.revision":
				commitHash = setting.Value
			}
		}
	}

	return &api.VersionResponse{
		Commit: commitHash,
	}, nil

}
