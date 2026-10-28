import z from 'zod';

// ======================== period =================================

export const postsPeriodSortEnum = z.enum(['newest', 'oldest', 'all']);

export type PostsPeriodSortTypes = z.infer<typeof postsPeriodSortEnum>;

export const sortPeriodLabels: Record<PostsPeriodSortTypes, string> = {
  all: 'Все',
  newest: 'Сначала новые',
  oldest: 'Сначала старые',
} as const;
// ======================== sort =================================

export const postsSortEnum = z.enum([
  'last_activity',
  'views',
  'likes',
  'popular',
]);

export type PostsSortTypes = z.infer<typeof postsSortEnum>;

export const sortLabels: Record<PostsSortTypes, string> = {
  last_activity: 'Последняя активность',
  likes: 'По лайкам',
  views: 'По прoсмотрам',
  popular: 'Популярные',
} as const;
