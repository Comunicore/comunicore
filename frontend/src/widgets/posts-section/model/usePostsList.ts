'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { mapPostListItem } from '@/entities/post';

import { postsListOptions } from '@/shared/api/generated/@tanstack/react-query.gen';

const POSTS_PAGE_LIMIT = 20;

export const usePostsList = (page: number) =>
  useQuery({
    ...postsListOptions({ query: { page, limit: POSTS_PAGE_LIMIT } }),
    select: (data) => ({
      posts: data.posts.map(mapPostListItem),
      totalPages: Math.max(
        1,
        Math.ceil(data.totalCountEstimated / POSTS_PAGE_LIMIT),
      ),
    }),
    placeholderData: keepPreviousData,
  });
