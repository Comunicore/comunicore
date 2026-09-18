import z from 'zod';

import { threadsPeriodSortEnum } from './period-sort.enum';
import { threadsSortEnum } from './sort.enum';

export const threadsFiltrationSchema = z.object({
  sortBy: threadsSortEnum,
  period: threadsPeriodSortEnum,
  withoutAnswers: z.boolean(),
});

export type ThreadsFiltrationTypes = z.infer<typeof threadsFiltrationSchema>;
