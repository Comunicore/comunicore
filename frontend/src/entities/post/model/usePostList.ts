import { useSuspenseQuery } from '@tanstack/react-query';

import { postsListOptions } from '@/shared/api/generated/@tanstack/react-query.gen';

export type PostsListOptions = Parameters<typeof postsListOptions>[0];

export const useSuspensePostList = (options?: PostsListOptions) => {
  const query = useSuspenseQuery({
    ...postsListOptions(options),
  });

  return {
    posts: query.data,
    refetch: query.refetch,
    query,
  };
};
