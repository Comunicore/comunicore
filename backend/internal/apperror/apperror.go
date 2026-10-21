// SPDX-License-Identifier: MIT
// Copyright 2026 Alex Syrnikov <alex19srv@gmail.com>

package apperror

import (
	"fmt"
	"strings"
)

type appError interface {
	error
	ErrorString() string
	Unwrap() error
}
type BaseError struct {
	opName string // current operation produced error
	cause  error  // original error
}

func (b *BaseError) Unwrap() error {
	return b.cause
}

// print error message with all wrapped errors
func appErrorStringChain(err appError) string {
	if err == nil {
		return ""
	}
	var res strings.Builder
	res.WriteString(err.ErrorString() + "\n")

	var processedError error = err
	for {
		if err, ok := processedError.(interface{ Unwrap() error }); ok {
			cause := err.Unwrap()
			if cause == nil {
				break
			}
			if appErr, ok := cause.(interface{ ErrorString() string }); ok {
				res.WriteString("caused by: " + appErr.ErrorString() + "\n")
			} else {
				res.WriteString("caused by: " + cause.Error() + "\n")
			}
			processedError = cause
		} else {
			break
		}
	}

	return res.String()
}

type ValidationError struct {
	BaseError
	Message string
}
type AuthenticationError struct {
	BaseError
	Message string
}

func NewErrValidation(op string, cause error, msg string) error {
	return &ValidationError{
		BaseError: BaseError{
			opName: op,
			cause:  cause,
		},
		Message: msg,
	}
}
func (e *ValidationError) ErrorString() string {
	return fmt.Sprintf("Op: %s\nvalidation error: %s", e.opName, e.Message)
}
func (e *ValidationError) Error() string {
	return appErrorStringChain(e)
}
func NewAuthenticationError(op string, cause error, msg string) error {
	return &AuthenticationError{
		BaseError: BaseError{
			opName: op,
			cause:  cause,
		},
		Message: msg,
	}
}
func (e *AuthenticationError) ErrorString() string {
	return fmt.Sprintf("Op: %s\nauth error: %s", e.opName, e.Message)
}
func (e *AuthenticationError) Error() string {
	return appErrorStringChain(e)
}
