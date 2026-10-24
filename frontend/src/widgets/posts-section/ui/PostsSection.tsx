'use client';

import { LuInbox, LuSearchX } from 'react-icons/lu';
import { useSearchParams } from 'next/navigation';

import { NotFoundResp } from './NotFoundRespl';
import { PostsList } from './PostsList';

import { FilterByTag } from '@/features/filter-by-tag';
import { PostsFiltration } from '@/features/posts-filtration';

import {
  filtrationQueryKeys,
  parsePostsParams,
  useSuspensePostList,
} from '@/entities/post';

import { AppRouter } from '@/shared/config/app-router';
import { useUpdateSearchParams } from '@/shared/hooks/useUpdateSearchParams';
import { cn } from '@/shared/lib/classNames';
import { Button } from '@/shared/ui';
import { StatePlaceholder } from '@/shared/ui/StatePlaceholder';

export function PostsSection() {
  const searchParams = useSearchParams();
  const setParam = useUpdateSearchParams();
  const { limit: POSTS_LIMIT, page } = parsePostsParams(searchParams);
  const { posts } = useSuspensePostList({
    query: { limit: POSTS_LIMIT, page },
  });
  const postsLists = posts.posts;
  const totalPages = Math.ceil((posts.totalCountEstimated || 0) / POSTS_LIMIT);

  const onRetry = () => setParam({ [filtrationQueryKeys.page]: undefined });

  if (postsLists.length === 0) {
    if (page > 1) {
      return (
        <StatePlaceholder
          tone='info'
          icon={<LuSearchX size={28} />}
          title='Страница не найдена'
          description='Такой страницы нет в списке.'
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
        actions={
          <Button size='sm' color='purple' href={AppRouter.posts.new}>
            Создать пост
          </Button>
        }
      />
    );
  }

  return (
    <>
      <div
        className={cn(
          'flex min-w-0 flex-col-reverse gap-y-4',
          'xl:grid xl:grid-cols-[1fr_17rem] xl:gap-x-5',
          '2xl:grid-cols-[1fr_23.125rem]',
        )}
      >
        <div
          className={cn(
            'order-1 flex flex-col-reverse gap-y-4',
            'xl:order-2 xl:grid xl:gap-y-5',
          )}
        >
          <PostsFiltration />
          <FilterByTag />
          <NotFoundResp className='hidden xl:flex' />
        </div>
        <PostsList postsLists={postsLists} totalPages={totalPages} />
      </div>
    </>
  );
}
