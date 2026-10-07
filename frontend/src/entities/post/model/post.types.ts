export interface Post {
  id: string | number;
  avatarUrl: string;
  title: string;
  authorName: string;
  category: string;
  commentsCount: number;
  views: number;
  createdAt: string;
}
