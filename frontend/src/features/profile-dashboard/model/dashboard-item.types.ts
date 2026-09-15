export interface DashboardItemTypes {
  id: string;
  title: string;
  message?: string | null;
  answers: number;
  chapter: string;
  messageId?: string | null;
  views: number;
  updatedAt: string;
}
