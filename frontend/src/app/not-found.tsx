'use client';

import { useRef } from 'react';

import { Footer } from '@/widgets/footer';
import { BurgerMenu, Header } from '@/widgets/header';
import { NotFoundSection } from '@/widgets/not-found-section';

/**
 * Прямой заход на несуществующий URL (в статическом экспорте — 404.html).
 * Разметка повторяет (main)/layout: клиентские переходы на такие пути
 * обрабатывает (main)/[...slug], и обе версии должны выглядеть одинаково.
 */
export default function NotFound() {
  const menuRef = useRef<HTMLElement | null>(null);
  const burgerRef = useRef<HTMLButtonElement | null>(null);

  return (
    <>
      <Header menuRef={menuRef} burgerRef={burgerRef} />
      <BurgerMenu menuRef={menuRef} />
      <main className='flex-1'>
        <NotFoundSection />
      </main>
      <Footer />
    </>
  );
}
