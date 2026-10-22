import { RelatedPost } from './post-details.types';

export const mockRelatedPosts: RelatedPost[] = [
  {
    id: '6',
    title: 'Стоит ли учить Vue в 2026?',
    position: 6,
    commentsCount: 24,
    views: '1.1k',
  },
  {
    id: '22',
    title: 'Достоевский или Булгаков? Кто вам сильнее симпатизирует?',
    position: 22,
    commentsCount: 11,
    views: '531',
  },
  {
    id: '2',
    title: 'Пепе шнейне ватафа?',
    position: 2,
    commentsCount: 111,
    views: '2.1k',
  },
];

export const mockPostIds = ['1', ...mockRelatedPosts.map(({ id }) => id)];
