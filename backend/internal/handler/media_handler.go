// SPDX-License-Identifier: MIT
// Copyright 2026 Alex Syrnikov <alex19srv@gmail.com>

package handler

import (
	"context"

	api "github.com/comunicore/comunicore/backend/internal/handler/generated"
	mediaService "github.com/comunicore/comunicore/backend/internal/service/media"
)

type MediaHandler struct {
	mediaService *mediaService.MediaService
}

func NewMediaHandler(mediaService *mediaService.MediaService) *MediaHandler {
	return &MediaHandler{mediaService: mediaService}
}
func (m *MediaHandler) MediaUpload(
	ctx context.Context, req *api.MediaUploadRequestMultipart) (r api.MediaUploadRes, _ error) {

	file := req.Content.File
	fileURL, err := m.mediaService.MediaUpload(ctx, file)
	if err != nil {
		return &api.MediaUploadResponse{}, err
	}
	return &api.MediaUploadResponse{
		FileName: req.Content.Name,
		URL:      fileURL}, nil
}
