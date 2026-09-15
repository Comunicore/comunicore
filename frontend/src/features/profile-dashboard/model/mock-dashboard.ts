import { DashboardItemTypes } from './dashboard-item.types';
import { MockDashboardTypes } from './mock-dashbooard.types';

const mockActiveThreads: DashboardItemTypes[] = [
  {
    id: 'dniv-cmdsk-vkdns',
    title: 'Как организовать своё время и всё успевать?',
    chapter: 'Продуктивность',
    answers: 19,
    views: 877,
    updatedAt: '2026-06-27T08:45:00.000Z',
  },
  {
    id: 'dhiv-chdsk-vkdns',
    title: 'Лучшие библиотеки для анимаций в React',
    chapter: 'Программирование',
    answers: 23,
    views: 2100,
    updatedAt: '2026-06-26T08:45:00.000Z',
  },
  {
    id: 'dniv-cmxsk-vkdns',
    title: 'Удалённая работа: плюсы и минусы',
    chapter: 'Работа и карьера',
    answers: 44,
    views: 4000,
    updatedAt: '2026-06-15T08:45:00.000Z',
  },
];
const mockLastComments: DashboardItemTypes[] = [
  {
    id: 'dniv-cmdsc-vkdns',
    title: 'Посоветуйте книги по расперделению времени',
    messageId: 'mcdns-vdns-cdsk',
    message:
      'Например "Атомные привычки". Читаю сейчас вроде как мне очень нра...',
    chapter: 'Продуктивность',
    answers: 19,
    views: 877,
    updatedAt: '2026-06-27T08:45:00.000Z',
  },
  {
    id: 'dhiv-chdsk-vkans',
    title: 'Какой лучший дестрибутив для Linux?',
    messageId: 'mcdns-qqdns-cdsk',
    message: 'Думаю лучший дестрибутив это Ubunty или Arch Linux',
    chapter: 'Программирование',
    answers: 23,
    views: 2100,
    updatedAt: '2026-06-26T08:45:00.000Z',
  },
  {
    id: 'ddiv-cmxsk-vkdns',
    title: 'В какое время года вы чаще гуляете?',
    messageId: 'mcdnscds-vdns-cdsk',
    message: 'Лучшее время для этого это весна, всё цветёт и пахнет и крас...',
    chapter: 'Общие обсуждения',
    answers: 23,
    views: 32034,
    updatedAt: '2026-06-10T08:45:00.000Z',
  },
];
const mockBookmarks: DashboardItemTypes[] = [
  {
    id: 'dniv-cmdsk-vkdns',
    title: 'Полный гайд по TypeScript для начинающих',
    chapter: 'Программирование',
    answers: 19,
    views: 877,
    updatedAt: '2026-06-27T08:45:00.000Z',
  },
  {
    id: 'dhiv-chdsk-vkdns',
    title: 'Гайд по Tailwind',
    chapter: 'Программирование',
    answers: 23,
    views: 2100,
    updatedAt: '2026-05-26T08:45:00.000Z',
  },
  {
    id: 'dniv-cmxsk-vkdns',
    title: 'Что нового в мире фрофнтенда: Июнь 2026',
    chapter: 'Продуктивность',
    answers: 44,
    views: 1000234,
    updatedAt: '2026-04-15T08:45:00.000Z',
  },
];

export const mockDashboard: MockDashboardTypes = {
  activeThreads: mockActiveThreads,
  lastComments: mockLastComments,
  bookmarks: mockBookmarks,
} as const;
