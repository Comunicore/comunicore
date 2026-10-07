import { routeGroup } from '../lib/helpers/routeGroup';

export const AppRouter = {
  main: '/',
  verification: '/verification',
  settings: '/settings',
  questions: '/questions',
  support: '/support',
  award: '/award',
  notification: '/notifications',
  participants: '/participants',
  faq: '/faq',
  favorites: '/favorites',
  editor: '/editor',

  posts: routeGroup('/posts', { new: '/new' }).withId(),
  tags: routeGroup('/tags').withId(),
  user: routeGroup('/user').withId(),
  achivements: routeGroup('/achivements').withId(),
  blog: routeGroup('/blog'),

  profile: routeGroup('/profile', {
    notifications: '/notifications',
    messages: '/messages',
    settings: '/settings',
    favorites: '/favorites',
    posts: '/posts',
  }),

  auth: routeGroup('/auth', {
    login: '?mode=login',
    registration: '?mode=register',
  }),

  rules: routeGroup('/rules', { community: '/community' }),

  // Политика
  policy: routeGroup('/policy', {
    privacy: '/privacy', // Конфиденциальность
    userAgreement: '/user-agreement', // Пользовательское соглашение
  }),

  recovery: routeGroup('/recovery', { password: '/password' }),
} as const;
