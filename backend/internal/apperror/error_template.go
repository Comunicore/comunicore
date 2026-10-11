// SPDX-License-Identifier: MIT
// Copyright 2026 Alex Syrnikov <alex19srv@gmail.com>

package apperror

// error handling algorythm:
//
//	if err != nil {
//	    return fmt.Errorf("error: %w\n caused by: %w", NewNotUniqueError(), err)
//	}
//
// here Error() with text description will go from Errorf,
// and NewNotUniqueError() will be used to create typed error that can be checked with errors.Is or errors.As

// deprecated error, user fmt.Errorf with %w and New...Error() instead
type UnspecifiedError struct {
	msg string
}

func NewUnspecifiedError(msg string) *UnspecifiedError {
	return &UnspecifiedError{msg: msg}
}

func (e *UnspecifiedError) Error() string {
	return "Unspecified error: " + e.msg
}

type NotUniqueError struct{}

func NewNotUniqueError(name ...string) *NotUniqueError {
	return &NotUniqueError{}
}

func (e *NotUniqueError) Error() string {
	return "NotUniqueError"
}

type NameNotUniqueError struct {
	login string
}

func NewLoginNotUniqueError(login string) *NameNotUniqueError {
	return &NameNotUniqueError{login: login}
}

func (e *NameNotUniqueError) Error() string {
	return "LoginNotUniqueError for login: " + e.login
}

type EmailNotUniqueError struct {
	email string
}

func NewEmailNotUniqueError(email string) *EmailNotUniqueError {
	return &EmailNotUniqueError{email: email}
}

func (e *EmailNotUniqueError) Error() string {
	return "EmailNotUniqueError for email: " + e.email
}
