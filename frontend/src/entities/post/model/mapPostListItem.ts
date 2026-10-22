import { Post } from './post.types';

import type { PostListItem } from '@/shared/api/generated';

export const mapPostListItem = (post: PostListItem): Post => ({
  id: post.id,
  avatarUrl: post.author.avatarUrl ?? '',
  title: post.title,
  authorName: post.author.displayName || post.author.username,
  category: post.category,
  commentsCount: post.postStats.commentsCount,
  views: post.postStats.viewsCount,
  createdAt: post.createdAt,
});
