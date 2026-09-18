import z from 'zod';

export const threadsPeriodSortEnum = z.enum(['newest', 'oldest', 'all']);

export type ThreadsPeriodSortTypes = z.infer<typeof threadsPeriodSortEnum>;

export const sortPeriodLabels: Record<ThreadsPeriodSortTypes, string> = {
  all: 'За все время',
  newest: 'Сначала новые',
  oldest: 'Сначала старые',
} as const;
