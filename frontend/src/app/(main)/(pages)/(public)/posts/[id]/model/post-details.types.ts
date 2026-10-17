import { PostComment } from '@/widgets/post-comments';

import { UserPreview } from '@/entities/user';

export interface PostCategory {
  id: string;
  slug: string;
  name: string;
}

export interface PostDetailsData {
  id: string;
  title: string;
  content: string;
  category: PostCategory;
  author: UserPreview & { title: string };
  likesCount: number;
  repliesCount: number;
  viewsCount: number;
  createdAt: string;
  lastReplyAt: string;
  commentsCount: number;
  comments: PostComment[];
}

export interface RelatedPost {
  id: string;
  title: string;
  position: number;
  commentsCount: number;
  views: string;
}
