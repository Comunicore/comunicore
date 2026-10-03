// SPDX-License-Identifier: MIT
// Copyright 2026 Alex Syrnikov <alex19srv@gmail.com>

package auth

import (
	"crypto/subtle"
	"encoding/base64"
	"errors"
	"fmt"
	"strings"

	"github.com/comunicore/comunicore/backend/internal/lib/utils"

	"github.com/comunicore/comunicore/backend/internal/apperror"
	"golang.org/x/crypto/argon2"
)

type argon2Params struct {
	TimeCost   uint32
	MemoryCost uint32
	Threads    uint8
}
type argon2Config struct {
	argon2Params
	Salt      []byte
	HashRaw   []byte
	KeyLength uint32
}

var (
	defaultParams = argon2Params{
		TimeCost:   1,
		MemoryCost: 64 * 1024,
		Threads:    4,
	}
)

const (
	DefaultKeyLength uint32 = 32
)

func hashPassword(password string) string {
	salt := utils.RandomBytes(32)

	hash := argon2.IDKey([]byte(password), salt,
		defaultParams.TimeCost, defaultParams.MemoryCost, defaultParams.Threads, DefaultKeyLength)

	encodedHash := fmt.Sprintf(
		"$argon2id$v=%d$m=%d,t=%d,p=%d$%s$%s",
		argon2.Version,
		defaultParams.MemoryCost,
		defaultParams.TimeCost,
		defaultParams.Threads,
		base64.RawStdEncoding.EncodeToString(salt),
		base64.RawStdEncoding.EncodeToString(hash),
	)

	return encodedHash
}

func parseArgon2Hash(encodedHash string) (*argon2Config, error) {
	components := strings.Split(encodedHash, "$")
	if len(components) != 6 {
		return nil, errors.New("invalid hash format structure")
	}

	if !strings.HasPrefix(components[1], "argon2id") {
		return nil, errors.New("unsupported algorithm variant")
	}

	var version int
	fmt.Sscanf(components[2], "v=%d", &version)

	config := argon2Config{}
	fmt.Sscanf(components[3], "m=%d,t=%d,p=%d",
		&config.MemoryCost, &config.TimeCost, &config.Threads)

	salt, err := base64.RawStdEncoding.DecodeString(components[4])
	if err != nil {
		return nil, fmt.Errorf("salt decoding failed: %w", err)
	}
	config.Salt = salt

	hash, err := base64.RawStdEncoding.DecodeString(components[5])
	if err != nil {
		return nil, fmt.Errorf("hash decoding failed: %w", err)
	}
	config.HashRaw = hash
	config.KeyLength = uint32(len(hash))

	return &config, nil
}

func verifyPassword(storedHash, providedPassword string) (bool, error) {
	op := "repo.auth.verifyPassword"
	config, err := parseArgon2Hash(storedHash)
	if err != nil {
		return false, apperror.NewErrValidation(op, err, "invalid password hash format")
	}

	computedHash := argon2.IDKey(
		[]byte(providedPassword),
		config.Salt,
		config.TimeCost,
		config.MemoryCost,
		config.Threads,
		config.KeyLength,
	)

	match := subtle.ConstantTimeCompare(config.HashRaw, computedHash) == 1

	return match, nil
}

func authenticateUser(storedHash, password string) error {
	isValid, err := verifyPassword(storedHash, password)
	if err != nil {
		return fmt.Errorf("password verification failed: %w", err)
	}

	if !isValid {
		return errors.New("invalid password")
	}

	return nil
}

// package main_test

// import (
//     "bytes"
//     "testing"

//     "golang.org/x/crypto/argon2"
// )

// func TestArgon2Consistency(t *testing.T) {
//     password := []byte("enterprise_test_password")
//     salt := []byte("standardized_salt_value")

//     // Standard parameters
//     timeCost := uint32(3)
//     memoryCost := uint32(64 * 1024)
//     threads := uint8(4)
//     keyLength := uint32(32)

//     // Generate multiple hashes with identical parameters
//     hash1 := argon2.IDKey(password, salt, timeCost, memoryCost, threads, keyLength)
//     hash2 := argon2.IDKey(password, salt, timeCost, memoryCost, threads, keyLength)

//     // Verify consistency
//     if !bytes.Equal(hash1, hash2) {
//         t.Error("Identical inputs produced inconsistent hashes")
//     }

//     // Verify uniqueness for different inputs
//     differentPassword := []byte("alternative_test_password")
//     hash3 := argon2.IDKey(differentPassword, salt, timeCost, memoryCost, threads, keyLength)

//     if bytes.Equal(hash1, hash3) {
//         t.Error("Different passwords produced identical hashes")
//     }
// }

// func TestArgon2EdgeCases(t *testing.T) {
//     salt := []byte("edge_case_testing_salt")
//     timeCost := uint32(1)
//     memoryCost := uint32(32 * 1024)
//     threads := uint8(2)
//     keyLength := uint32(32)

//     // Test empty password handling
//     emptyPassword := []byte("")
//     hash := argon2.IDKey(emptyPassword, salt, timeCost, memoryCost, threads, keyLength)
//     if len(hash) != int(keyLength) {
//         t.Error("Empty password handling failed")
//     }

//     // Test extended and special characters handling
//     extendedPassword := append(bytes.Repeat([]byte("x"), 1000), []byte("🙂🙃")...)
//     hash = argon2.IDKey(extendedPassword, salt, timeCost, memoryCost, threads, keyLength)
//     if len(hash) != int(keyLength) {
//         t.Error("Extended password handling failed")
//     }

//     // Verify parameter sensitivity
//     baseHash := argon2.IDKey([]byte("test_password"), salt, timeCost, memoryCost, threads, keyLength)
//     modifiedHash := argon2.IDKey([]byte("test_password"), salt, timeCost+1, memoryCost+1, threads+1, keyLength)

//     if bytes.Equal(baseHash, modifiedHash) {
//         t.Error("Parameter modification did not affect hash output")
//     }
// }
