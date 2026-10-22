'use client';

import { useQuery } from '@tanstack/react-query';

import { postsListOptions } from '@/shared/api/generated/@tanstack/react-query.gen';

type PostsListOptions = Parameters<typeof postsListOptions>[0];

export const usePostList = (options?: PostsListOptions) => {
  const query = useQuery({
    ...postsListOptions(options),
  });

  return {
    posts: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    query,
  };
};
