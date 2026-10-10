// Тип автора задаётся снаружи: сущность comment не импортирует сущность user
export interface Comment<TAuthor> {
  id: string;
  author: TAuthor;
  text: string;
  replies?: Comment<TAuthor>[];
  // Ответы, которые ещё не загружены (кнопка «N ответов»)
  hiddenRepliesCount?: number;
}
