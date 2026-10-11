// SPDX-License-Identifier: MIT
// Copyright 2026 Alex Syrnikov <alex19srv@gmail.com>

package utils

import (
	"crypto/rand"
	mathRand "math/rand"
	"time"
)

func RandomBytes(count int) []byte {
	buf := make([]byte, count)
	rand.Read(buf)

	return buf
}

var seededRand *mathRand.Rand = mathRand.New(
	mathRand.NewSource(time.Now().UnixNano()),
)

// generate random string of given length started from letter
func RandomString(length int) string {
	const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
	const letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"

	original := make([]byte, length)
	original[0] = letters[seededRand.Intn(len(letters))]

	result := original[1:]
	for i := range result {
		result[i] = charset[seededRand.Intn(len(charset))]
	}

	return string(original)
}
