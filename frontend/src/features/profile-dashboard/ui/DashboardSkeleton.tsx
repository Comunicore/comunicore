import { memo } from 'react';

import { Tile } from '@/shared/ui';

const SkeletonItem = memo(
  ({ hasDescription = false }: { hasDescription?: boolean }) => (
    <div className='flex items-center justify-between gap-x-7.5 border-b border-gray-800/30 pb-4 last:border-0 last:pb-0'>
      <div className='relative flex max-w-5xl flex-1 flex-col gap-y-2.5'>
        <h4 className='h-4 w-3/4 rounded bg-gray-700 2xl:h-5' />

        {hasDescription && <p className='h-4 w-5/6 rounded bg-gray-800' />}

        <div>
          <div className='h-6 w-24 rounded bg-gray-800' />
        </div>
      </div>

      <div
        className={
          'grid max-w-94 grid-cols-3 items-center justify-items-center gap-x-5 justify-self-end text-center *:flex *:flex-col'
        }
      >
        <div>
          <span className='mb-1 h-4 w-8 self-center rounded bg-gray-700 2xl:h-5' />
          <p className='h-3 w-12 self-center rounded bg-gray-800 max-2xl:h-2.5' />
        </div>

        <div>
          <span className='mb-1 h-4 w-10 self-center rounded bg-gray-700 2xl:h-5' />
          <p className='h-3 w-14 self-center rounded bg-gray-800 max-2xl:h-2.5' />
        </div>

        <div className='justify-self-center'>
          <div className='h-3 w-20 rounded bg-gray-800 max-2xl:h-2.5 2xl:w-24' />
        </div>
      </div>
    </div>
  ),
);

SkeletonItem.displayName = 'SkeletonItem';

export function DashboardSkeleton() {
  const rows = [1, 2, 3];

  return (
    <div className='w-full animate-pulse'>
      <div className='flex flex-col gap-6'>
        <Tile
          size='lg'
          className='flex w-full animate-pulse flex-col gap-y-7.5'
        >
          <div className='flex items-center justify-between gap-x-10'>
            <div className='h-7 w-44 rounded bg-gray-700' />
            <div className='h-7 w-28 rounded bg-gray-800' />
          </div>
          <ul className={`flex flex-col gap-y-7.5`}>
            {rows.map((i) => (
              <SkeletonItem key={i} hasDescription={false} />
            ))}
          </ul>
        </Tile>

        <Tile
          size='lg'
          className='flex w-full animate-pulse flex-col gap-y-7.5'
        >
          <div className='flex items-center justify-between gap-x-10'>
            <div className='h-7 w-44 rounded bg-gray-700' />
            <div className='h-7 w-28 rounded bg-gray-800' />
          </div>
          <ul className={`flex flex-col gap-y-7.5`}>
            {rows.map((i) => (
              <SkeletonItem key={i} hasDescription={true} />
            ))}
          </ul>
        </Tile>

        <Tile
          size='lg'
          className='flex w-full animate-pulse flex-col gap-y-7.5'
        >
          <div className='flex items-center justify-between gap-x-10'>
            <div className='h-7 w-44 rounded bg-gray-700' />
            <div className='h-7 w-28 rounded bg-gray-800' />
          </div>
          <ul className={`flex flex-col gap-y-7.5`}>
            {rows.map((i) => (
              <SkeletonItem key={i} hasDescription={false} />
            ))}
          </ul>
        </Tile>
      </div>
    </div>
  );
}
