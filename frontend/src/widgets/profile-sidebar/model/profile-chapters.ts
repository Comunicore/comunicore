import { LiaProjectDiagramSolid } from 'react-icons/lia';
import {
  LuBell,
  LuBookmark,
  LuClipboardList,
  LuMessageSquare,
} from 'react-icons/lu';

import { AppRouter } from '@/shared/config/app-router';
import { ListItemLinkWithIcon } from '@/shared/types/list-item-link.types';

export const profileChapters = [
  {
    id: 'review',
    icon: LiaProjectDiagramSolid,
    label: 'Обзор',
    href: AppRouter.profile.root,
  },
  {
    id: 'threads',
    icon: LuClipboardList,
    label: 'Мои треды',
    href: AppRouter.profile.threads,
  },
  {
    id: 'messages',
    icon: LuMessageSquare,
    label: 'Мои сообщения',
    href: AppRouter.profile.messages,
  },
  {
    id: 'favorites',
    icon: LuBookmark,
    label: 'Закладки',
    href: AppRouter.profile.favorites,
  },
  {
    id: 'notifications',
    icon: LuBell,
    label: 'Уведомления',
    href: AppRouter.profile.notifications,
  },
] as const satisfies ListItemLinkWithIcon[];
