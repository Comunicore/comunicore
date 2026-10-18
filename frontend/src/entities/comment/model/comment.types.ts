export interface Comment<TAuthor> {
  id: string;
  author: TAuthor;
  text: string;
  isPending?: boolean;
}
