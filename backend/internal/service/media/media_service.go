package media

import (
	"context"
	"errors"
	"io"
	"net/url"
)

type MediaRepo interface {
	MediaUpload(ctx context.Context, reader io.Reader) (string, error)
}

type MediaService struct {
	mediaRepo    MediaRepo
	mediaBaseURL string
}

func NewMediaService(mediaBaseURL string, mediaRepo MediaRepo) *MediaService {
	return &MediaService{mediaRepo: mediaRepo, mediaBaseURL: mediaBaseURL}
}

func (r *MediaService) MediaUpload(ctx context.Context, reader io.Reader) (url.URL, error) {
	fileHash, err := r.mediaRepo.MediaUpload(ctx, reader)
	if err != nil {
		return url.URL{}, errors.New("failed to upload media")
	}
	fileURLstring, err := url.JoinPath(r.mediaBaseURL, "storage/media", fileHash)
	if err != nil {
		return url.URL{}, errors.New("failed to construct media URL")
	}
	fileURL, err := url.Parse(fileURLstring)
	if err != nil {
		return url.URL{}, errors.New("failed to construct media URL")
	}
	return *fileURL, nil
}
