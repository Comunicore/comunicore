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
	res.WriteString(err.ErrorString())
	res.WriteString("\n")

	var processedError error = err
	for {
		if err, ok := processedError.(interface{ Unwrap() error }); ok {
			cause := err.Unwrap()
			if cause == nil {
				break
			}
			if appErr, ok := cause.(interface{ ErrorString() string }); ok {
				res.WriteString("caused by: ")
				res.WriteString(appErr.ErrorString())
				res.WriteString("\n")
			} else {
				res.WriteString("caused by: ")
				res.WriteString(cause.Error())
				res.WriteString("\n")
			}
			processedError = cause
		} else {
			break
		}
	}

	return res.String()
}

type NotFoundError struct {
	BaseError
	Type string
	Name string
}

type ValidationError struct {
	BaseError
	Message string
}
type AuthenticationError struct {
	BaseError
	Message string
}

func NewErrNotFound(op string, cause error, typeName, name string) error {
	return &NotFoundError{
		opName: op,
		cause:  cause,
		Type:   typeName,
		Name:   name,
	}
}

func (e *NotFoundError) ErrorString() string {
	return fmt.Sprintf("Op: %s\n%s with name %s not found", e.opName, e.Type, e.Name)
}

func (e *NotFoundError) Error() string {
	return appErrorStringChain(e)
}

func NewErrValidation(op string, cause error, msg string) error {
	return &ValidationError{
		opName:  op,
		cause:   cause,
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
		opName:  op,
		cause:   cause,
		Message: msg,
	}
}

func (e *AuthenticationError) ErrorString() string {
	return fmt.Sprintf("Op: %s\nauth error: %s", e.opName, e.Message)
}

func (e *AuthenticationError) Error() string {
	return appErrorStringChain(e)
}
