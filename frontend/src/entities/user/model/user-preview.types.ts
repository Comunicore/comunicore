export type UserRole = 'superAdmin' | 'moderator' | 'member' | 'rude';

// Короткие данные пользователя для карточек постов и комментариев
export interface UserPreview {
  id: string;
  name: string;
  avatarUrl?: string | null;
  role: UserRole;
}
