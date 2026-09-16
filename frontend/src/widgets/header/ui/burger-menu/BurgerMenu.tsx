'use client';

import { RefObject, useEffect } from 'react';
import { FaRegHeart, FaRegMessage, FaTrophy } from 'react-icons/fa6';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { navLinks } from '../../model/navLinks';
import { AuthButtons } from '../auth-buttons';

import { ProfileActions } from '@/features/profile-actions';

import {
  selectIsAuthenticated,
  useAuthStore,
  useLogoutMutation,
} from '@/entities/session';
import { useUser } from '@/entities/user';

import { AppRouter } from '@/shared/config/app-router';
import {
  useMenuActions,
  useMenuIsOpen,
} from '@/shared/hooks/useMenu.selectors';
import { cn } from '@/shared/lib/classNames';
import { Button, ProfileAvatar } from '@/shared/ui';

interface BurgerMenuProps {
  menuRef: RefObject<HTMLElement | null>;
}

const userStats = [
  {
    label: 'Репутация',
    value: '1.2к',
    Icon: FaTrophy,
  },
  {
    label: 'Сообщений',
    value: '11к',
    Icon: FaRegMessage,
  },
  {
    label: 'Лайки',
    value: '42',
    Icon: FaRegHeart,
  },
];

export function BurgerMenu({ menuRef }: BurgerMenuProps) {
  const isOpen = useMenuIsOpen();
  const setIsOpen = useMenuActions().setIsOpen;
  const pathname = usePathname();
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const { user } = useUser({ enabled: isAuthenticated });
  const userData = user?.user;
  const { mutate: logout } = useLogoutMutation();

  const isLinkActive = (href: string) => {
    if (href === '/') return pathname === href;

    return pathname.startsWith(href);
  };

  useEffect(() => {
    if (!isOpen) return;

    const bodyOverflow = document.body.style.overflow;

    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = bodyOverflow;
    };
  }, [isOpen]);

  return (
    <aside
      id='aside-menu'
      inert={!isOpen}
      ref={menuRef}
      className={cn(
        'fixed top-0 bottom-0 left-0 z-40',
        'bg-dark-1b flex min-h-0 w-screen max-w-full flex-col gap-y-5 overflow-y-auto px-2.5 py-18.5 duration-300 ease-in-out',
        !isOpen && '-translate-x-full',
        'sm:w-80',
        'xl:hidden',
      )}
    >
      {isAuthenticated && (
        <div className='border-gray-9e/10 rounded-[10px] border'>
          <Link
            className='border-gray-9e/10 flex w-full items-center justify-center gap-x-2.5 border-b p-2.5'
            href={AppRouter.profile.root}
            title={userData ? userData.name : 'user'}
            onClick={() => setIsOpen(false)}
          >
            <ProfileAvatar
              width={60}
              height={60}
              authorName={userData ? userData.name : 'user'}
              avatarUrl={userData?.avatarUrl}
            />
            <div className='p-2.5'>
              <h2 className='text-[18px]'>
                {userData ? userData.name : 'Anonym'}
              </h2>
              <p className='text-gray-9e text-sm'>
                {userData ? userData.id : 'Anonym'}
              </p>
            </div>
          </Link>
          <ul className='flex justify-between gap-x-2.5 px-2.5 py-5'>
            {userStats.map(({ label, value, Icon }) => (
              <li key={label} className='flex min-w-0 items-center gap-x-1.5'>
                <span
                  className={cn(
                    'text-purple-86 flex size-8 shrink-0 items-center justify-center rounded-md',
                    'bg-purple-67/45 p-1.5',
                  )}
                  aria-hidden='true'
                >
                  <Icon className='size-full' />
                </span>
                <span className='flex min-w-0 flex-col leading-none'>
                  <span className='text-gray-9e truncate text-[13px]'>
                    {label}
                  </span>
                  <span className='mt-1 text-center text-xs text-white'>
                    {value}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <nav className='flex flex-col gap-y-2.5'>
        {navLinks.map(({ label, href }) => {
          const isActive = isLinkActive(href);

          return (
            <Button
              key={label}
              href={href}
              aria-current={isActive ? 'page' : undefined}
              aria-disabled={isActive}
              onClick={(event) => {
                if (isActive) {
                  event.preventDefault();
                  return;
                }

                setIsOpen(false);
              }}
              color='ghost'
              className={cn(
                'text-gray-9e w-full justify-start gap-x-3',
                isActive && 'bg-purple-67 text-white',
              )}
            >
              {/* <Icon
                className='size-5 shrink-0 text-current'
                aria-hidden='true'
              /> */}
              {label}
            </Button>
          );
        })}
      </nav>
      {isAuthenticated ? <ProfileActions /> : <AuthButtons />}
      {isAuthenticated && (
        <Button
          color='red'
          className='w-full'
          onClick={() => {
            if (window.confirm('Вы уверены, что хотите выйти?')) {
              logout({});
            }
          }}
        >
          Выйти
        </Button>
      )}
    </aside>
  );
}
