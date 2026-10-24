'use client';

import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { LuServerCrash } from 'react-icons/lu';
import { QueryErrorResetBoundary } from '@tanstack/react-query';

import PostsHeader from './_ui/PostsHeader';
import PostsHeaderSkeleton from './_ui/PostsHeaderSkeleton';
import PostsSectionSkeleton from './_ui/PostsSectionsSkeleton';

import { PostsSection } from '@/widgets/posts-section';

import { Button, StatePlaceholder } from '@/shared/ui';
import { containerClassName } from '@/shared/ui/Container';

export default function PostsPage() {
  return (
    <section className={`${containerClassName} grid gap-y-18.5 py-21.25`}>
      {/* Create header skeleton */}
      <Suspense fallback={<PostsHeaderSkeleton />}>
        <PostsHeader />
      </Suspense>

      {/* create PsostSection Skeleton */}
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
                  <Button size='sm' color='purple' onClick={resetErrorBoundary}>
                    Попробовать снова
                  </Button>
                }
              />
            )}
          >
            <Suspense fallback={<PostsSectionSkeleton />}>
              <PostsSection />
            </Suspense>
          </ErrorBoundary>
        )}
      </QueryErrorResetBoundary>
    </section>
  );
}
