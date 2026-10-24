import z from 'zod';

import { postsPeriodSortEnum, postsSortEnum } from '@/entities/post';

export const postsFiltrationSchema = z.object({
  sortBy: postsSortEnum,
  period: postsPeriodSortEnum,
  withoutComments: z.boolean(),
});

export type PostsFiltrationTypes = z.infer<typeof postsFiltrationSchema>;
