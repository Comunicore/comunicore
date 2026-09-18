'use client';

import { useMemo } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { mockTags } from '../model/mock-tags';

import { ViewAllButton } from './ViewAllButton';

import { cn } from '@/shared/lib/classNames';
import { Tag } from '@/shared/ui';

const TAG_QUERY_KEY = 'tags';

export function FilterByTag() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeTags = useMemo(() => {
    const tagsToken = searchParams.get(TAG_QUERY_KEY);
    return tagsToken ? tagsToken.split(',') : [];
  }, [searchParams]);

  const addTagToQueryUrl = (name: string) => {
    const currentParams = new URLSearchParams(searchParams.toString());
    let updatedTags = [...activeTags];

    if (updatedTags.includes(name)) {
      updatedTags = updatedTags.filter((tag) => tag !== name);
    } else {
      updatedTags.push(name);
    }
    if (updatedTags.length > 0) {
      currentParams.set(TAG_QUERY_KEY, updatedTags.join(','));
    } else {
      currentParams.delete(TAG_QUERY_KEY);
    }
    router.push(`${pathname}?${currentParams.toString()}`, { scroll: false });
  };

  return (
    <div
      className={cn(
        'xl:bg-dark-1b/50 xl:border-gray-9e/10 xl:grid xl:gap-y-6.75 xl:rounded-[1.25rem] xl:border xl:px-3.75 xl:py-5',
      )}
    >
      <div
        className={cn(
          'order-1 flex flex-col sm:gap-y-2',
          'sm:flex-row sm:justify-between sm:gap-x-5 sm:gap-y-0',
          'xl:contents',
        )}
      >
        <h2 className='sr-only text-lg font-bold sm:not-sr-only'>
          Популярные теги
        </h2>
        <ViewAllButton className='xl:hidden' />
      </div>
      <ul
        className={cn(
          'custom-scrollbar flex items-center gap-x-5 overflow-auto',
          'xl:grid xl:grid-cols-1 xl:gap-x-0 xl:gap-y-2.75',
        )}
      >
        {mockTags.map(({ name, quantity }, index) => {
          const activeTag = activeTags.includes(name);
          return (
            <li key={name + index} className='text-gray-9e'>
              <button
                type='button'
                aria-pressed={activeTag}
                className={cn(
                  'relative flex w-full items-center justify-between gap-x-2 rounded-lg py-2 duration-200',
                  'xl:hover:bg-purple-67/10 xl:hover:px-2',
                  'xl:hover:*:border-purple-67 xl:hover:*:text-purple-67',
                  activeTag && '*:text-purple-86 *:duration-100',
                  activeTag &&
                    'xl:bg-purple-67/10 xl:*:border-purple-67 xl:px-2',
                  'xl:static',
                )}
                onClick={() => addTagToQueryUrl(name)}
              >
                <Tag
                  color='dark'
                  className={cn(
                    'flex gap-x-3 px-4 py-3 text-lg',
                    'xl:h-7.5 xl:px-1.5 xl:text-sm',
                  )}
                >
                  {name}
                  <span className='xl:hidden'>{quantity}</span>
                </Tag>
                <span className='hidden xl:inline'>{quantity}</span>
              </button>
            </li>
          );
        })}
      </ul>
      <ViewAllButton className='hidden xl:flex' />
    </div>
  );
}
