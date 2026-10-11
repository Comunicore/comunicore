import { ReactNode } from 'react';

import { cn } from '@/shared/lib/classNames';
import { Tile } from '@/shared/ui';

interface PostContentProps {
  // Шапка с автором поста (собирается снаружи из сущности user)
  header: ReactNode;
  content: string;
  className?: string;
}

export function PostContent({ header, content, className }: PostContentProps) {
  return (
    <Tile
      color='solid'
      radius='md'
      size='xs'
      className={cn('flex flex-col gap-y-5', className)}
    >
      <header>{header}</header>
      <div className='font-(family-name:--font-inter) text-base leading-normal whitespace-pre-line sm:text-xl'>
        {content}
      </div>
    </Tile>
  );
}
