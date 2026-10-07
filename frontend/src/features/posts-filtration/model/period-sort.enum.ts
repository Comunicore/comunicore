import z from 'zod';

export const postsPeriodSortEnum = z.enum(['newest', 'oldest', 'all']);

export type PostsPeriodSortTypes = z.infer<typeof postsPeriodSortEnum>;

export const sortPeriodLabels: Record<PostsPeriodSortTypes, string> = {
  all: 'За все время',
  newest: 'Сначала новые',
  oldest: 'Сначала старые',
} as const;
