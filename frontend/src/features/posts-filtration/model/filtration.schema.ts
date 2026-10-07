import z from 'zod';

import { postsPeriodSortEnum } from './period-sort.enum';
import { postsSortEnum } from './sort.enum';

export const postsFiltrationSchema = z.object({
  sortBy: postsSortEnum,
  period: postsPeriodSortEnum,
  withoutComments: z.boolean(),
});

export type PostsFiltrationTypes = z.infer<typeof postsFiltrationSchema>;
