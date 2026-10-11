'use client';

import { useEffect } from 'react';

import { AppRouter } from '@/shared/config/app-router';
import { Button, Container } from '@/shared/ui';

const isDev = process.env.NODE_ENV !== 'production';

export default function MainError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Ошибка рендера в разделе (main):', error);
  }, [error]);

  return (
    <Container className='flex flex-col items-center justify-center gap-y-5 py-24 text-center'>
      <h1 className='text-2xl font-bold'>Что-то пошло не так</h1>

      <p className='text-gray-9e max-w-125'>
        Страницу не удалось отобразить. Попробуйте обновить её — если ошибка
        повторяется, вернитесь на главную.
      </p>

      {isDev && (
        <pre className='bg-dark-1b border-gray-9e/10 text-gray-9e max-w-full overflow-x-auto rounded-[0.625rem] border p-4 text-left text-sm'>
          {error.message}
        </pre>
      )}

      {error.digest && (
        <p className='text-gray-9e/60 text-sm'>Код ошибки: {error.digest}</p>
      )}

      <div className='flex flex-col gap-2.5 sm:flex-row'>
        <Button onClick={reset}>Попробовать снова</Button>
        <Button href={AppRouter.main} color='bordered'>
          На главную
        </Button>
      </div>
    </Container>
  );
}
