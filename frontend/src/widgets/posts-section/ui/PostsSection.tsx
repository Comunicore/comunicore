'use client';

import { useSearchParams } from 'next/dist/client/components/navigation';

import { NotFoundResp } from './NotFoundRespl';
import { PostsList } from './PostsList';

import { FilterByTag } from '@/features/filter-by-tag';
import { PostsFiltration } from '@/features/posts-filtration';

import { usePostList } from '@/entities/post';

import { cn } from '@/shared/lib/classNames';
import { Loader } from '@/shared/ui';
import { QueryError } from '@/shared/ui/QueryError';

const POSTS_LIMIT = 10;
const PARAM_PAGE_KEY = 'page';

export function PostsSection() {
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get(PARAM_PAGE_KEY) || '1');
  const { posts, isLoading, error } = usePostList({
    query: { limit: POSTS_LIMIT, page },
  });

  if (isLoading) {
    return (
      <div className='flex h-[40svh] flex-col items-center gap-y-4 pt-[10svh]'>
        <Loader size='sm' />
      </div>
    );
  }

  if (error) {
    return (
      <QueryError
        title='Error'
        description='An error occurred while fetching posts.'
        className='h-[20svh]'
      />
    );
  }

  if (!posts?.posts || posts.posts.length === 0) {
    return (
      <QueryError
        title='Oops...'
        error='no posts found'
        description='An error occurred while fetching posts.'
        className='h-[20svh]'
      />
    );
  }

  const postsLists = posts.posts;
  const totalPages = Math.ceil((posts.totalCountEstimated || 0) / POSTS_LIMIT);

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
