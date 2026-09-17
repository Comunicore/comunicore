'use client';

import Link from 'next/link';

import { CreateThreadEditor } from '@/widgets/create-thread-editor';

import {
  selectIsAuthenticated,
  selectStatus,
  useAuthStore,
} from '@/entities/session';

import { AppRouter } from '@/shared/config/app-router';

export default function EditorPage() {
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const isLoading = useAuthStore(selectStatus) === 'loading';

  if (isLoading) {
    return (
      <div className='py-2'>
        <section className='mx-auto flex w-full max-w-5xl flex-col gap-y-3'>
          <p className='text-gray-80'>Проверяем авторизацию...</p>
        </section>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <section className='mx-auto flex w-full max-w-5xl flex-col gap-y-3'>
        <h1 className='text-2xl font-bold'>Публикация постов недоступна</h1>
        <p className='text-gray-80'>
          Чтобы создавать посты, войдите в аккаунт или зарегистрируйтесь.
        </p>
        <div className='flex gap-3'>
          <Link
            href={AppRouter.auth.login}
            className='bg-blue-16 hover:bg-blue-20 inline-flex w-fit items-center justify-center rounded-md px-5 py-3 text-center font-bold text-white duration-200'
          >
            Войти
          </Link>
          <Link
            href={AppRouter.auth.registration}
            className='bg-blue-16 hover:bg-blue-20 inline-flex w-fit items-center justify-center rounded-md px-5 py-3 text-center font-bold text-white duration-200'
          >
            Регистрация
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className='mx-auto flex w-full max-w-5xl flex-col gap-y-3'>
      <CreateThreadEditor />
    </section>
  );
}
