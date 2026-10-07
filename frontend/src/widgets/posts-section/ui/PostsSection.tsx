import { NotFoundResp } from './NotFoundRespl';
import { PostsHeader } from './PostsHeader';
import { PostsList } from './PostsList';

import { FilterByTag } from '@/features/filter-by-tag';
import { PostsFiltration } from '@/features/posts-filtration';

import { cn } from '@/shared/lib/classNames';
import { containerClassName } from '@/shared/ui';

export function PostsSection() {
  return (
    <section className={`${containerClassName} grid gap-y-18.5 py-21.25`}>
      <PostsHeader />
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
        <PostsList />
      </div>
    </section>
  );
}
