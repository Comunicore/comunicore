'use client';

import { ReactNode, useRef } from 'react';

import { Footer } from '@/widgets/footer';
import { BurgerMenu, Header } from '@/widgets/header';

export const SiteShell = ({ children }: { children: ReactNode }) => {
  const menuRef = useRef<HTMLElement | null>(null);
  const burgerRef = useRef<HTMLButtonElement | null>(null);

  return (
    <div className='flex min-h-screen flex-col'>
      <Header menuRef={menuRef} burgerRef={burgerRef} />
      <BurgerMenu menuRef={menuRef} />

      {children}

      <Footer />
    </div>
  );
};
