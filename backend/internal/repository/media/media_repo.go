// SPDX-License-Identifier: MIT
// Copyright 2026 Alex Syrnikov <alex19srv@gmail.com>

package media

import (
	"context"
	"crypto/sha256"
	"encoding/base64"
	"fmt"
	"io"
	"os"
	"path"

	"github.com/comunicore/comunicore/backend/internal/lib/filetype"
)

type MediaRepo struct {
	uploadDir string
}

func NewMediaRepo(uploadDir string) (*MediaRepo, error) {
	// check uploadDir exists and is a directory
	info, err := os.Stat(uploadDir)
	if os.IsNotExist(err) {
		// Try to create the directory if it doesn't exist
		if err := os.MkdirAll(uploadDir, 0755); err != nil {
			return nil, fmt.Errorf("failed to create upload directory: %w", err)
		}
	} else if err != nil {
		return nil, fmt.Errorf("failed to stat upload directory: %w", err)
	} else if !info.IsDir() {
		return nil, fmt.Errorf("upload path exists but is not a directory")
	}
	return &MediaRepo{
		uploadDir: uploadDir,
	}, nil
}

type limitWriter struct {
	buf []byte
	off int
}

func (w *limitWriter) Write(p []byte) (n int, err error) {
	if w.off < len(w.buf) {
		n = copy(w.buf[w.off:], p)
		w.off += n
	}
	return len(p), nil
}

// NewBufferWriter returns an io.NewBufferWriter that writes to buf until it is full, then discards any further data.
func NewBufferWriter(buf []byte) io.Writer {
	return &limitWriter{buf: buf}
}

// MediaUpload saves the uploaded file and returns a unique identifier for it.
func (r *MediaRepo) MediaUpload(ctx context.Context, reader io.Reader) (string, error) {
	dstFile, err := os.CreateTemp(r.uploadDir, "tmp-*")
	if err != nil {
		if os.IsNotExist(err) {
			if err := os.MkdirAll(r.uploadDir, 0755); err != nil {
				return "", fmt.Errorf("upload dir not exists and can't be created: %w", err)
			}
		}
		return "", fmt.Errorf("failed to create temporary upload file: %w", err)
	}
	temporaryFileName := dstFile.Name()
	fileRenamed := false
	defer func() {
		if !fileRenamed {
			os.Remove(temporaryFileName)
		}
	}()
	defer dstFile.Close()

	hash := sha256.New()

	mimeBuffer := make([]byte, 512)
	mimeWriter := NewBufferWriter(mimeBuffer)

	multiWriter := io.MultiWriter(dstFile, hash, mimeWriter)
	if _, err := io.Copy(multiWriter, reader); err != nil {
		return "", fmt.Errorf("failed to copy file content: %w", err)
	}

	hashValue := hash.Sum(nil)
	dst := make([]byte, base64.RawURLEncoding.EncodedLen(len(hashValue)))
	base64.RawURLEncoding.Encode(dst, hashValue)
	fileName := string(dst)

	fileExtention := filetype.GetFileExtension(mimeBuffer)
	fileName += fileExtention

	newFileName := path.Join(r.uploadDir, fileName)
	if err := os.Rename(dstFile.Name(), newFileName); err != nil {
		return "", fmt.Errorf("failed to rename uploaded file")
	}
	fileRenamed = true
	err = os.Chmod(newFileName, 0644)
	if err != nil {
		return "", fmt.Errorf("failed to change file permissions")
	}

	return fileName, nil
}
