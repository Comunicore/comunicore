'use client';

import { useSearchParams } from 'next/navigation';

import { usePostsList } from '../model/usePostsList';

import { PostCard } from '@/entities/post';

import { cn } from '@/shared/lib/classNames';
import { Loader, Pagination } from '@/shared/ui';

const tableGridClassName = cn(
  'flex flex-col *:not-first:text-center',
  'md:grid md:grid-cols-2 md:items-center',
  'lg:grid-cols-[45%_11.5rem_auto_auto]',
  '2xl:grid-cols-[52.5%_11.5rem_auto_auto]',
);

export function PostsList() {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get('page')) || 1;
  const { data, isPending, isError } = usePostsList(page);

  const renderBody = () => {
    if (isPending) {
      return (
        <div className='flex justify-center py-10'>
          <Loader size='sm' />
        </div>
      );
    }

    if (isError) {
      return (
        <p className='text-gray-9e px-2.5 py-10 text-center'>
          Не удалось загрузить посты. Попробуйте обновить страницу.
        </p>
      );
    }

    if (!data.posts.length) {
      return (
        <p className='text-gray-9e px-2.5 py-10 text-center'>
          Постов пока нет.
        </p>
      );
    }

    return (
      <ul>
        {data.posts.map((post) => (
          <li
            key={post.id}
            className={cn(
              'group relative px-2.5 py-5 transition',
              'not-last:border-b-gray-9e/10 not-last:border-b',
              'focus-within:ring-offset focus-within:ring focus-within:ring-white',
            )}
          >
            <PostCard className={tableGridClassName} post={post} />
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div>
      <div className='border-gray-9e/10 bg-dark-1b/50 h-fit rounded-[0.625rem] border py-1.25'>
        <header
          className={cn(
            'text-gray-9e border-b-gray-9e/10 md:*:nth-child(2):inline border-b px-1.25 py-5 *:not-first:hidden md:*:nth-[n+2]:inline md:*:nth-[n+3]:hidden lg:*:nth-[n]:inline',
            tableGridClassName,
          )}
        >
          <span>Пост</span>
          <span>Категория</span>
          <span>Комментарии</span>
          <span>Просмотры</span>
        </header>
        {renderBody()}
      </div>
      {data && <Pagination totalPages={data.totalPages} />}
    </div>
  );
}
