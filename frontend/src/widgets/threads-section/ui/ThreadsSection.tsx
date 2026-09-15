import { NotFoundResp } from './NotFoundRespl';
import { ThreadsHeader } from './ThreadsHeader';
import { ThreadsList } from './ThreadsList';

import { FilterByTag } from '@/features/filter-by-tag';
import { ThreadsFiltration } from '@/features/threads-filtration';

import { cn } from '@/shared/lib/classNames';
import { containerClassName } from '@/shared/ui';

export function ThreadsSection() {
  return (
    <section className={`${containerClassName} grid gap-y-18.5 py-21.25`}>
      <ThreadsHeader />
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
          <ThreadsFiltration />
          <FilterByTag />
          <NotFoundResp className='hidden xl:flex' />
        </div>
        <ThreadsList />
      </div>
    </section>
  );
}
