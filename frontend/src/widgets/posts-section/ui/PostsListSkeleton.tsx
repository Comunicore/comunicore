import { cn } from '@/shared/lib/classNames';
import { Bone } from '@/shared/ui';

const CARD = 'rounded-2xl border border-white/10';
const ROWS = 6;

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

export function PostsListSkeleton() {
  return (
    <div aria-busy='true' aria-label='Загрузка постов'>
      <PostsTableSkeleton />
    </div>
  );
}
