'use client';

import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { LuServerCrash } from 'react-icons/lu';
import { QueryErrorResetBoundary } from '@tanstack/react-query';

import { NotFoundResp } from './NotFoundRespl';
import { PostsList } from './PostsList';
import { PostsListSkeleton } from './PostsListSkeleton';

import { FilterByTag } from '@/features/filter-by-tag';
import { PostsFiltration } from '@/features/posts-filtration';

import { cn } from '@/shared/lib/classNames';
import { Button, StatePlaceholder } from '@/shared/ui';

export function PostsSection() {
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
        <QueryErrorResetBoundary>
          {({ reset }) => (
            <ErrorBoundary
              onReset={reset}
              fallbackRender={({ resetErrorBoundary }) => (
                <StatePlaceholder
                  tone='error'
                  icon={<LuServerCrash size={28} />}
                  title='Не удалось загрузить посты'
                  description='Попробуйте обновить список.'
                  actions={
                    <Button
                      size='sm'
                      color='purple'
                      onClick={() => {
                        resetErrorBoundary();
                      }}
                    >
                      Попробовать снова
                    </Button>
                  }
                />
              )}
            >
              <Suspense fallback={<PostsListSkeleton />}>
                <PostsList />
              </Suspense>
            </ErrorBoundary>
          )}
        </QueryErrorResetBoundary>
      </div>
    </>
  );
}
