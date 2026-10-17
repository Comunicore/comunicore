export interface Comment<TAuthor> {
  id: string;
  author: TAuthor;
  text: string;
  replies?: Comment<TAuthor>[];
  hiddenRepliesCount?: number;
}
