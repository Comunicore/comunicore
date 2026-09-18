import { AuthState } from './auth-store';

export const selectStatus = (state: AuthState): AuthState['status'] =>
  state.status;

export const selectIsAuthenticated = (state: AuthState): boolean =>
  state.status === 'authenticated';
