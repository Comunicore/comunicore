import z from 'zod';

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
