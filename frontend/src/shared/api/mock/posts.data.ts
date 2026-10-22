export interface MockPostSummary {
  id: number;
  title: string;
  category: string;
  createdAt: string;
}

export const mockPostSummaries: MockPostSummary[] = [
  {
    id: 6,
    title: 'Стоит ли учить Vue в 2026?',
    category: 'Программирование',
    createdAt: '2027-02-14T10:00:00Z',
  },
  {
    id: 5,
    title: 'Пепе шнейне ватафа?',
    category: 'Оффтоп',
    createdAt: '2027-02-13T10:00:00Z',
  },
  {
    id: 4,
    title: 'Достоевский или Булгаков? Кто вам сильнее симпатизирует?',
    category: 'Литература',
    createdAt: '2027-02-12T18:00:00Z',
  },
  {
    id: 3,
    title: 'Как выучить TypeScript с нуля',
    category: 'Программирование',
    createdAt: '2027-02-12T09:00:00Z',
  },
  {
    id: 2,
    title: 'Лучшие фильмы года',
    category: 'Развлечения',
    createdAt: '2027-02-11T20:00:00Z',
  },
  {
    id: 1,
    title: 'Java или C# в 2026: Что выбрать новичку?',
    category: 'Программирование',
    createdAt: '2027-02-11T08:33:00Z',
  },
];
