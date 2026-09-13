import { UserAchievement, UserLocation } from './user.types';

export interface ApiUser {
  id?: number | string;
  name?: string;
  email?: string;
  avatarUrl?: string | null;
  createdAt?: string | null;
  profileBanerUrl?: string | null;
  userTag?: string;
  role?: string;
  verify?: boolean;
  description?: string;
  rank?: number;
  threadsQuantity?: number;
  likes?: number;
  recivedLikes?: number;
  bookMarks?: number;
  achievements?: UserAchievement[];
  lastActivity?: string | null;
  updatedAt?: string | null;
  birthday?: string;
  webSite?: string;
  location?: UserLocation;
}
export interface ApiUserEnvelope {
  accessToken?: string;
  user: ApiUser;
}
