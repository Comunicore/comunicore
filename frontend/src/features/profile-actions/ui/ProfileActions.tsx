'use client';

import {
  IoBookmarkSharp,
  IoChatboxSharp,
  IoNotificationsSharp,
  IoSettingsSharp,
} from 'react-icons/io5';
import Link from 'next/link';

import { NavigationItem } from '../model/navigation-item.types';

import { selectIsAuthenticated, useAuthStore } from '@/entities/session';
import { useUser } from '@/entities/user';

import { AppRouter } from '@/shared/config/app-router';
import { cn } from '@/shared/lib/classNames';
import { Button, ProfileAvatar } from '@/shared/ui';

const navigations = [
  {
    name: 'Notifications',
    Icon: IoNotificationsSharp,
    href: AppRouter.profile.notifications,
  },
  {
    name: 'Messages',
    Icon: IoChatboxSharp,
    href: AppRouter.profile.messages,
  },
  {
    name: 'Favorites',
    Icon: IoBookmarkSharp,
    href: AppRouter.profile.favorites,
  },

  {
    name: 'Settings',
    Icon: IoSettingsSharp,
    href: AppRouter.profile.settings,
  },
] satisfies NavigationItem[];

interface Props {
  className?: string;
}

export function ProfileActions({ className }: Props) {
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const { user } = useUser({ enabled: isAuthenticated });
  const userData = user?.user;

  return (
    <nav className={cn(className)}>
      <div className='flex justify-between gap-x-5 xl:hidden'>
        {navigations.map(({ name, Icon, href }) => (
          <Button
            key={name.toLowerCase()}
            href={href}
            aria-label={name}
            title={name}
            color='ghost'
            className='border-gray-9e/10 flex aspect-square items-center justify-center rounded-[10px] border p-2.5'
          >
            <Icon
              aria-label={name}
              width={30}
              height={30}
              title={name}
              className='min-h-7.5 min-w-7.5'
            />
          </Button>
        ))}
      </div>
      <div className='hidden gap-x-6 xl:flex'>
        {navigations
          // фильтр на десктопе убирает лишние кнопки
          .filter(({ name }) =>
            ['messages', 'notifications'].includes(name.toLowerCase()),
          )
          .map(({ name, Icon, href }) => (
            <Link
              key={name.toLowerCase()}
              href={href}
              aria-label={name}
              title={name}
            >
              <Icon
                aria-label={name}
                width={30}
                height={30}
                title={name}
                className='min-h-7.5 min-w-7.5'
              />
            </Link>
          ))}
        <Link
          className='flex items-center gap-x-2.5'
          href={AppRouter.profile.root}
        >
          <ProfileAvatar
            width={30}
            authorName={userData ? userData.name : 'Avatar'}
            avatarUrl={userData?.avatarUrl}
          />
          <p className='max-w-32 truncate'>
            {userData ? userData.name : 'Anonym'}
          </p>
        </Link>
      </div>
    </nav>
  );
}
