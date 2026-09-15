import type { ApiUser } from './apiUser.types';
import type { User } from './user.types';

const toId = (id: ApiUser['id']): string =>
  id === null || id === undefined ? '' : String(id);

const toCount = (value: number | undefined): number =>
  typeof value === 'number' && Number.isFinite(value) ? value : 0;

const toDateOrNull = (value: string | null | undefined): string | null =>
  typeof value === 'string' && value.trim() !== '' ? value : null;

export const mapApiUserToUser = (apiUser: ApiUser): User => ({
  id: toId(apiUser.id),
  name: apiUser.name ?? '',
  email: apiUser.email ?? '',
  avatarUrl: apiUser.avatarUrl ?? null,
  profileBanerUrl: apiUser.profileBanerUrl ?? null,
  userTag: apiUser.userTag ?? '',
  role: apiUser.role ?? '',
  verify: apiUser.verify ?? false,
  description: apiUser.description,
  rank: toCount(apiUser.rank),
  threadsQuantity: toCount(apiUser.threadsQuantity),
  likes: toCount(apiUser.likes),
  recivedLikes: toCount(apiUser.recivedLikes),
  bookMarks: toCount(apiUser.bookMarks),
  achievements: Array.isArray(apiUser.achievements) ? apiUser.achievements : [],
  lastActivity: toDateOrNull(apiUser.lastActivity),
  createdAt: toDateOrNull(apiUser.createdAt),
  updatedAt: toDateOrNull(apiUser.updatedAt),
  birthday: apiUser.birthday,
  webSite: apiUser.webSite,
  location: apiUser.location,
});
