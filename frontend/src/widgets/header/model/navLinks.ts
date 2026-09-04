import { AppRouter } from '@/shared/config/app-router';

export const navLinks = [
  { label: 'Форум', href: AppRouter.threads.root },
  { label: 'Участники', href: AppRouter.participants },
  { label: 'Блог', href: AppRouter.blog.root },
  { label: 'Правила', href: AppRouter.rules.root },
];
