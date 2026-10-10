import { PostComment } from '@/widgets/post-comments';

import { UserPreview } from '@/entities/user';

export interface PostDetailsData {
  id: string;
  title: string;
  content: string;
  thread: {
    id: string;
    title: string;
  };
  author: UserPreview & { title: string };
  topic: string;
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
