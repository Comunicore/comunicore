export type AuthStatus = 'anonymous' | 'authenticated' | 'loading';

export interface AuthState {
  status: AuthStatus;
}

export interface AuthActions {
  logout: () => void;
  setStatus: (status: AuthStatus) => void;
}

export interface AuthStore extends AuthState {
  actions: AuthActions;
}
