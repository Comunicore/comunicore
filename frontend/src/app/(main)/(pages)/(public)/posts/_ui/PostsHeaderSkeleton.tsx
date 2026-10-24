import { cn } from '@/shared/lib/classNames';
import { Bone } from '@/shared/ui';

const TAG_WIDTHS = ['w-42', 'w-60', 'w-40', 'w-30', 'w-50', 'w-21'];

const PostsHeaderSkeleton = () => (
  <header
    className='grid gap-y-5 md:gap-y-7.5'
    aria-busy='true'
    aria-label='Загрузка'
  >
    <div className='flex flex-col justify-between gap-y-3 xl:flex-row xl:items-center xl:gap-y-0'>
      <div className='grid w-full max-w-130.5 gap-y-2 md:gap-y-3.25'>
        <Bone className='h-10 w-48 md:h-12 md:w-64' />

        <div className='grid w-full gap-y-2'>
          <Bone className='h-4 w-full md:h-5' />
          <Bone className='h-4 w-2/3 md:h-5' />
        </div>
      </div>

      <Bone className='h-12 w-full max-w-120 xl:w-56' />
    </div>

    <ul className='flex flex-wrap gap-4.25'>
      {TAG_WIDTHS.map((width, index) => (
        <li key={index}>
          <Bone className={cn('h-9.5 rounded-lg md:h-13', width)} />
        </li>
      ))}
      <li>
        <Bone className='h-9.5 w-20 rounded-lg md:h-13' />
      </li>
    </ul>
  </header>
);

export default PostsHeaderSkeleton;
