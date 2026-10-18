import { PostComment } from '@/widgets/post-comments';

import { UserPreview } from '@/entities/user';

export interface PostDetailsData {
  id: number;
  title: string;
  content: string;
  category: string;
  author: UserPreview;
  likesCount: number;
  commentsCount: number;
  viewsCount: number;
  createdAt: string;
  lastCommentAt: string | null;
  comments: PostComment[];
}

export interface RelatedPost {
  id: string;
  title: string;
  position: number;
  commentsCount: number;
  views: string;
}
