'use client';

import { useRef } from 'react';
import { LuMessagesSquare, LuSearch } from 'react-icons/lu';
import Image from 'next/image';

import { Footer } from '@/widgets/footer';
import { BurgerMenu, Header } from '@/widgets/header';

import spaceManImage from '@/shared/assets/images/space-man.png';
import { AppRouter } from '@/shared/config/app-router';
import { Button, Container } from '@/shared/ui';

export default function NotFound() {
  const menuRef = useRef<HTMLElement | null>(null);
  const burgerRef = useRef<HTMLButtonElement | null>(null);

  return (
    <div className='flex min-h-screen flex-col'>
      <Header menuRef={menuRef} burgerRef={burgerRef} />
      <BurgerMenu menuRef={menuRef} />

      <main className='flex flex-1 items-center justify-center py-10 md:py-14 lg:py-18'>
        <Container className='grid w-full max-w-337.5 items-center gap-8 md:gap-10 lg:grid-cols-[minmax(300px,470px)_minmax(420px,1fr)] lg:gap-12'>
          <section className='mx-auto flex w-full max-w-md flex-col items-center text-center lg:mx-0 lg:items-start lg:text-left'>
            <h1 className='text-purple-86 text-6xl leading-none font-bold tracking-normal md:text-7xl lg:text-8xl'>
              404
            </h1>
            <h2 className='mt-5 text-2xl leading-tight font-bold md:text-3xl lg:text-4xl'>
              Страница не найдена
            </h2>
            <p className='text-gray-9e mt-3 text-base leading-5 md:text-[18px]'>
              Кажется вы заблудились. Такой страницы не существует или она была
              перемещена
            </p>

            <div className='relative order-2 my-7 w-full max-w-96 lg:hidden'>
              <Image
                src={spaceManImage}
                alt='Космонавт с картой на фиолетовой планете'
                priority
                className='mx-auto w-full'
              />
            </div>

            <div className='order-3 flex w-full flex-col gap-3 lg:mt-7 lg:max-w-none lg:flex-row lg:gap-5'>
              <Button
                href={AppRouter.main}
                color='purple'
                className='w-full lg:w-auto'
              >
                На главную
              </Button>
              <Button
                href={AppRouter.threads.root}
                color='bordered'
                className='w-full gap-3 lg:w-auto'
              >
                <LuMessagesSquare size={24} aria-hidden='true' />
                Перейти на форум
              </Button>
            </div>

            <form className='order-4 mt-6 w-full lg:max-w-100'>
              <label
                htmlFor='not-found-search'
                className='text-gray-9e block text-left text-sm leading-5 sm:text-base'
              >
                Или попробуй поискать
              </label>
              <div className='bg-dark-1b mt-3 flex min-h-10 items-center gap-2 rounded-lg border border-white/5 px-4'>
                <input
                  id='not-found-search'
                  name='search'
                  type='search'
                  placeholder='Поиск по форуму...'
                  className='placeholder:text-gray-9e text-gray-9e min-w-0 flex-1 bg-transparent text-sm outline-none'
                />
                <button
                  type='submit'
                  aria-label='Найти'
                  className='text-light/90 hover:text-purple-86 transition-colors'
                >
                  <LuSearch size={18} aria-hidden='true' />
                </button>
              </div>
            </form>
          </section>

          <div className='hidden justify-center lg:flex'>
            <Image
              src={spaceManImage}
              alt='Космонавт с картой на фиолетовой планете'
              priority
              className='w-full max-w-158'
            />
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
