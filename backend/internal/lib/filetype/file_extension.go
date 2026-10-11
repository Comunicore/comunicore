// SPDX-License-Identifier: MIT
// Copyright 2026 Alex Syrnikov <alex19srv@gmail.com>

package filetype

import (
	"mime"
	"net/http"
)

var prefferedExtensions map[string]string = map[string]string{
	"image/jpeg": ".jpeg",
	"image/png":  ".png",
	"image/gif":  ".gif",
	"image/webp": ".webp",
}

func GetFileExtension(buffer []byte) string {
	fileMimeType := http.DetectContentType(buffer)

	extention, ok := prefferedExtensions[fileMimeType]
	if ok {
		return extention
	}

	extList, err := mime.ExtensionsByType(fileMimeType)
	if err != nil || len(extList) == 0 {
		// TODO: log error
		return ""
	}

	return extList[0]
}
