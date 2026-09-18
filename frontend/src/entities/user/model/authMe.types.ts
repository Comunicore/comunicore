import { User } from './user.types';

export interface AuthMeResponse {
  accessToken: string;
  user: User;
}
