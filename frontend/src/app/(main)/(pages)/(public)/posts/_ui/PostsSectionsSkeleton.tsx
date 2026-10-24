import { cn } from '@/shared/lib/classNames';
import { Bone } from '@/shared/ui';

const CARD = 'rounded-2xl border border-white/10';
const ROWS = 6;
const POPULAR_TAGS = 5;
const CHIP_WIDTHS = ['w-24', 'w-32', 'w-36', 'w-28', 'w-32', 'w-28'];

const ROW_GRID =
  'grid items-center gap-x-3 px-3 grid-cols-[minmax(0,1fr)_72px_88px_72px] md:grid-cols-[1fr_120px_120px_120px]';

function PostRowSkeleton() {
  return (
    <li className={cn(ROW_GRID, 'border-t border-white/10 py-4')}>
      <div className='flex items-center gap-x-3'>
        <Bone className='size-10 shrink-0 rounded-full' />
        <div className='grid flex-1 gap-y-2'>
          <Bone className='h-4 w-4/5' />
          <Bone className='h-3 w-3/5' />
        </div>
      </div>
      <Bone className='mx-auto h-6 w-14' />
      <Bone className='mx-auto h-4 w-5' />
      <Bone className='mx-auto h-4 w-5' />
    </li>
  );
}

function PostsTableSkeleton() {
  return (
    <div className={cn(CARD, 'min-w-0 overflow-hidden')}>
      <div className={cn(ROW_GRID, 'py-5')}>
        <Bone className='h-4 w-10' />
        <Bone className='mx-auto h-4 w-14' />
        <Bone className='mx-auto h-4 w-16' />
        <Bone className='mx-auto h-4 w-14' />
      </div>
      <ul>
        {Array.from({ length: ROWS }, (_, i) => (
          <PostRowSkeleton key={i} />
        ))}
      </ul>
    </div>
  );
}

function MobileTagsSkeleton() {
  return (
    <div className='grid gap-y-3 xl:hidden'>
      <div className='flex items-center justify-between'>
        <Bone className='h-5 w-40' />
        <Bone className='h-5 w-36' />
      </div>

      <div className='flex gap-x-3 overflow-hidden'>
        {CHIP_WIDTHS.map((width, i) => (
          <Bone key={i} className={cn('h-9 shrink-0', width)} />
        ))}
      </div>
    </div>
  );
}

function MobileFiltersSkeleton() {
  return <Bone className='h-12 w-36 xl:hidden' />;
}

function DesktopFiltersSkeleton() {
  return (
    <div className={cn(CARD, 'grid gap-y-4 p-4')}>
      <Bone className='h-5 w-24' />
      <div className='grid gap-y-2'>
        <Bone className='h-4 w-24' />
        <Bone className='h-11 w-full' />
      </div>
      <div className='grid gap-y-2'>
        <Bone className='h-4 w-16' />
        <Bone className='h-11 w-full' />
      </div>
      <div className='flex items-center gap-x-2'>
        <Bone className='size-4 rounded' />
        <Bone className='h-4 w-40' />
      </div>
      <Bone className='h-12 w-full' />
    </div>
  );
}

function DesktopPopularTagsSkeleton() {
  return (
    <div className={cn(CARD, 'grid gap-y-4 p-4')}>
      <Bone className='h-5 w-40' />
      <ul className='grid gap-y-4'>
        {Array.from({ length: POPULAR_TAGS }, (_, i) => (
          <li key={i} className='flex items-center justify-between'>
            <Bone className='h-6 w-20' />
            <Bone className='h-4 w-8' />
          </li>
        ))}
      </ul>
    </div>
  );
}

function PostsSectionSkeleton() {
  return (
    <div
      aria-busy='true'
      aria-label='Загрузка постов'
      className='flex min-w-0 flex-col-reverse gap-y-4 xl:grid xl:grid-cols-[1fr_17rem] xl:gap-x-5'
    >
      <PostsTableSkeleton />

      <aside className='grid content-start gap-y-4'>
        {/* мобильные */}
        <MobileTagsSkeleton />
        <MobileFiltersSkeleton />

        {/* десктоп */}
        <div className='hidden gap-y-4 xl:grid'>
          <DesktopFiltersSkeleton />
          <DesktopPopularTagsSkeleton />
        </div>
      </aside>
    </div>
  );
}

export default PostsSectionSkeleton;
