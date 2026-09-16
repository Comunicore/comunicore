'use client';

import { RefObject, useEffect } from 'react';
import { LuSearch } from 'react-icons/lu';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { navLinks } from '../model/navLinks';

import { AuthButtons } from './auth-buttons';
import { Burger } from './burger';

import { ProfileActions } from '@/features/profile-actions';

import { selectIsAuthenticated, useAuthStore } from '@/entities/session';

import logo from '@/shared/assets/images/logo.svg';
import { AppRouter } from '@/shared/config/app-router';
import {
  useMenuActions,
  useMenuIsOpen,
} from '@/shared/hooks/useMenu.selectors';
import { useModal } from '@/shared/hooks/useModal';
import { cn } from '@/shared/lib/classNames';
import { Container } from '@/shared/ui';

interface HeaderProps {
  menuRef: RefObject<HTMLElement | null>;
  burgerRef: RefObject<HTMLButtonElement | null>;
}

export function Header(props: HeaderProps) {
  const { menuRef, burgerRef } = props;
  const pathname = usePathname();

  const isAuthenticated = useAuthStore(selectIsAuthenticated);

  const isOpen = useMenuIsOpen();
  const setIsOpen = useMenuActions().setIsOpen;

  const { modalOpen, setModalOpen } = useModal(menuRef, burgerRef, {
    autoClose: true,
    closeByEsc: true,
    initialState: isOpen,
  });

  const setMenuOpen = (value: boolean) => {
    setIsOpen(value);
    setModalOpen(value);
  };

  useEffect(() => {
    if (!modalOpen && isOpen) {
      setIsOpen(false);
    }

    if (!isOpen && modalOpen) {
      setModalOpen(false);
    }
  }, [modalOpen, isOpen, setIsOpen, setModalOpen]);

  return (
    <header className='bg-dark-0e sticky top-0 z-50 w-full py-2.5 after:absolute after:right-0 after:bottom-0 after:left-0 after:h-px after:bg-[linear-gradient(90deg,transparent,color-mix(in_srgb,var(--color-light)_15%,transparent),transparent)] after:content-[""]'>
      <Container className='flex items-center justify-between gap-x-5'>
        <h1 className='sr-only'>Communicore</h1>
        <Link href={AppRouter.main} className='flex w-fit lg:shrink-0'>
          <Image
            src={logo}
            alt='Logo'
            width={240}
            height={44}
            loading='eager'
            fetchPriority='high'
            className='min-w-18'
          />
        </Link>

        <nav className='[&_a:hover]:text-purple-67 hidden shrink gap-x-5 text-[18px] font-medium xl:flex [&_a]:transition-colors'>
          {navLinks.map(({ label, href }) => {
            const isActive = pathname === href;

            return (
              <Link
                key={label}
                href={href}
                className={cn(isActive && 'text-purple-67 cursor-not-allowed')}
                onClick={(event) => {
                  if (isActive) {
                    event.preventDefault();
                  }
                }}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        <div className='flex shrink-0 items-center gap-x-6.25'>
          <button title='Search' aria-label='Search button'>
            <LuSearch size={30} />
          </button>
          {isAuthenticated ? (
            <ProfileActions className='hidden xl:flex' />
          ) : (
            <AuthButtons className='hidden xl:flex' />
          )}
          <Burger
            isOpen={isOpen}
            setIsOpen={setMenuOpen}
            ref={burgerRef}
            controls='aside-menu'
            className='justify-self-end xl:hidden'
          />
        </div>
      </Container>
    </header>
  );
}
