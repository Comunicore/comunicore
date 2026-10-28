'use client';

import { LuInbox, LuSearchX } from 'react-icons/lu';
import { useSearchParams } from 'next/navigation';

import {
  filtrationQueryKeys,
  parsePostsParams,
  PostCard,
  useSuspensePostList,
} from '@/entities/post';

import { AppRouter } from '@/shared/config/app-router';
import { useUpdateSearchParams } from '@/shared/hooks/useUpdateSearchParams';
import { cn } from '@/shared/lib/classNames';
import { Button, Pagination, StatePlaceholder } from '@/shared/ui';

const tableGridClassName = cn(
  'flex flex-col *:not-first:text-center',
  'md:grid md:grid-cols-2 md:items-center',
  'lg:grid-cols-[45%_11.5rem_auto_auto]',
  '2xl:grid-cols-[52.5%_11.5rem_auto_auto]',
);

const tableLabels = ['Пост', 'Категория', 'Комментарии', 'Просмотры'] as const;

export function PostsList() {
  const searchParams = useSearchParams();
  const { limit: POSTS_LIMIT, page } = parsePostsParams(searchParams);
  const { posts } = useSuspensePostList({
    query: { limit: POSTS_LIMIT, page },
  });
  const postsLists = posts.posts;
  const totalPages = Math.ceil((posts.totalCountEstimated || 0) / POSTS_LIMIT);
  const setParam = useUpdateSearchParams();

  const onRetry = () => setParam({ [filtrationQueryKeys.page]: undefined });

  if (postsLists.length === 0) {
    if (page > 1) {
      return (
        <StatePlaceholder
          tone='info'
          icon={<LuSearchX size={28} />}
          title='Страница не найдена'
          description='Такой страницы нет в списке.'
          className='max-h-150'
          actions={
            <Button size='sm' color='bordered' onClick={onRetry}>
              Вернуться на первую страницу
            </Button>
          }
        />
      );
    }

    return (
      <StatePlaceholder
        icon={<LuInbox size={28} />}
        title='Пока нет постов'
        description='Будьте первым, кто начнёт обсуждение.'
        className='max-h-150'
        actions={
          <Button size='sm' color='purple' href={AppRouter.posts.new}>
            Создать пост
          </Button>
        }
      />
    );
  }
  return (
    <div>
      <div className='border-gray-9e/10 bg-dark-1b/50 h-fit rounded-[0.625rem] border py-1.25'>
        <header
          className={cn(
            'text-gray-9e border-b-gray-9e/10 md:*:nth-child(2):inline border-b px-1.25 py-5 *:not-first:hidden md:*:nth-[n+2]:inline md:*:nth-[n+3]:hidden lg:*:nth-[n]:inline',
            tableGridClassName,
          )}
        >
          {tableLabels.map((label) => (
            <span key={label}>{label}</span>
          ))}
        </header>
        <ul>
          {postsLists.map((post) => (
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
      </div>
      <Pagination
        totalPages={totalPages}
        pageQueryKey={filtrationQueryKeys.page}
        currentPage={page}
      />
    </div>
  );
}
