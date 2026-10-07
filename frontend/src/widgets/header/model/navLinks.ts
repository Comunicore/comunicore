import {
  FaBalanceScale,
  FaBullhorn,
  FaFeather,
  FaHome,
  FaUsers,
} from 'react-icons/fa';

import { AppRouter } from '@/shared/config/app-router';

export const navLinks = [
  { label: 'Главная', href: AppRouter.main, Icon: FaHome },
  { label: 'Форум', href: AppRouter.posts.root, Icon: FaBullhorn },
  { label: 'Участники', href: AppRouter.participants, Icon: FaUsers },
  { label: 'Блог', href: AppRouter.blog.root, Icon: FaFeather },
  { label: 'Правила', href: AppRouter.rules.root, Icon: FaBalanceScale },
];
