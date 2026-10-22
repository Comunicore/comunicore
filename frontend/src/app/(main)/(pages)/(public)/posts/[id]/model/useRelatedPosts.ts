'use client';

import { useQuery } from '@tanstack/react-query';

import { RelatedPost } from './post-details.types';

import { postsListOptions } from '@/shared/api/generated/@tanstack/react-query.gen';
import { formatInt } from '@/shared/lib/helpers/formatInt';

const RELATED_POSTS_COUNT = 3;
const SOURCE_POSTS_LIMIT = 50;

const useRelatedPosts = (postId: number, category?: string) =>
  useQuery({
    ...postsListOptions({ query: { limit: SOURCE_POSTS_LIMIT } }),
    enabled: Boolean(category),
    select: (data): RelatedPost[] =>
      data.posts
        .filter((post) => post.id !== postId && post.category === category)
        .slice(0, RELATED_POSTS_COUNT)
        .map((post) => ({
          id: String(post.id),
          title: post.title,
          position: post.id,
          commentsCount: post.postStats.commentsCount,
          views: formatInt(post.postStats.viewsCount),
        })),
  });

export default useRelatedPosts;
