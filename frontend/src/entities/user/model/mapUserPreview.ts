import { User } from './user.types';
import { UserPreview } from './user-preview.types';

import type { MessageAuthor } from '@/shared/api/generated';

export const mapMessageAuthorToPreview = (
  author: MessageAuthor,
): UserPreview => ({
  id: String(author.id),
  name: author.displayName || author.username,
  avatarUrl: author.avatarUrl ?? null,
  role: 'member',
});

export const mapUserToPreview = (user: User): UserPreview => ({
  id: user.id,
  name: user.name,
  avatarUrl: user.avatarUrl ?? null,
  role: 'member',
});

export const mapUserToMessageAuthor = (user: User): MessageAuthor => ({
  id: Number(user.id) || 0,
  username: user.userTag || user.name,
  displayName: user.name,
  avatarUrl: user.avatarUrl ?? undefined,
  rank: user.rank,
});
