import z from 'zod';

export const threadsSortEnum = z.enum([
  'last_activity',
  'views',
  'likes',
  'popular',
]);

export type ThreadsSortTypes = z.infer<typeof threadsSortEnum>;

export const sortLabels: Record<ThreadsSortTypes, string> = {
  last_activity: 'Последняя активность',
  likes: 'По лайкам',
  views: 'По прoсмотрам',
  popular: 'Популярные',
} as const;
