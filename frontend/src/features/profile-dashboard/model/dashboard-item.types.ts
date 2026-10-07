export interface DashboardItemTypes {
  id: string;
  title: string;
  message?: string | null;
  commentsCount: number;
  category: string;
  messageId?: string | null;
  views: number;
  updatedAt: string;
}
