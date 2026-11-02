// SPDX-License-Identifier: MIT
// Copyright 2026 Alex Syrnikov <alex19srv@gmail.com>

package saga

const (
	SagaStateInitial = iota // SagaStateInitial is the initial state of the saga.
)

type Saga struct {
	State int
}
