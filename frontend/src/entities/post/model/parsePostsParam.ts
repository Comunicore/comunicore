import {
  postsPeriodSortEnum,
  PostsPeriodSortTypes,
  postsSortEnum,
  PostsSortTypes,
} from './filtration.enums';
import { filtrationQueryKeys } from './filtrationQuery.keys';

const POSTS_LIMIT = 1;

interface PostFiltrationQueries {
  page: number;
  limit: number;
  sortBy: PostsSortTypes;
  period: PostsPeriodSortTypes;
  withoutComments: boolean;
  category: string;
  tags: string[];
}

export function parsePostsParams(sp: URLSearchParams): PostFiltrationQueries {
  const sortBy = postsSortEnum.safeParse(sp.get('sortBy'));
  const period = postsPeriodSortEnum.safeParse(sp.get('period'));

  return {
    page: Math.max(1, Number(sp.get(filtrationQueryKeys.page)) || 1),
    category: sp.get(filtrationQueryKeys.category) ?? 'all',
    limit: POSTS_LIMIT,
    sortBy: sortBy.success ? sortBy.data : 'last_activity',
    period: period.success ? period.data : 'all',
    withoutComments: sp.get('withoutComments') === 'true',
    tags: sp.get('tags')?.split(',').filter(Boolean) ?? [],
  };
}
