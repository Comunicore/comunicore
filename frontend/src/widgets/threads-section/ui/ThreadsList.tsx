import { threadsList } from '../model/mock-posts';

import { PostCard } from '@/entities/post';

import { cn } from '@/shared/lib/classNames';
import { Pagination } from '@/shared/ui';

const tableGridClassName = cn(
  'flex flex-col *:not-first:text-center',
  'md:grid md:grid-cols-2 md:items-center',
  'lg:grid-cols-[45%_11.5rem_auto_auto]',
  '2xl:grid-cols-[52.5%_11.5rem_auto_auto]',
);

export function ThreadsList() {
  return (
    <div>
      <div className='border-gray-9e/10 bg-dark-1b/50 h-fit rounded-[0.625rem] border py-1.25'>
        <header
          className={cn(
            'text-gray-9e border-b-gray-9e/10 md:*:nth-child(2):inline border-b px-1.25 py-5 *:not-first:hidden md:*:nth-[n+2]:inline md:*:nth-[n+3]:hidden lg:*:nth-[n]:inline',
            tableGridClassName,
          )}
        >
          <span>Тред</span>
          <span>Раздел</span>
          <span>Ответы</span>
          <span>Просмотры</span>
        </header>
        <ul className=''>
          {threadsList.map((thread) => (
            <li
              key={thread.id}
              className={cn(
                'group relative px-2.5 py-5 transition',
                'not-last:border-b-gray-9e/10 not-last:border-b',
                'focus-within:ring-offset focus-within:ring focus-within:ring-white',
              )}
            >
              <PostCard className={tableGridClassName} post={thread} />
            </li>
          ))}
        </ul>
      </div>
      <Pagination totalPages={10} />
    </div>
  );
}
