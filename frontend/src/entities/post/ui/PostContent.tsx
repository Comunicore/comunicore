import { ReactNode } from 'react';

import { cn } from '@/shared/lib/classNames';

interface PostContentProps {
  // Шапка с автором поста (собирается снаружи из сущности user)
  header: ReactNode;
  content: string;
  className?: string;
}

export function PostContent({ header, content, className }: PostContentProps) {
  return (
    <div
      className={cn(
        'bg-dark-1b flex flex-col gap-y-5 rounded-[0.625rem] p-2.5',
        className,
      )}
    >
      <header>{header}</header>
      <div className='font-(family-name:--font-inter) text-base leading-normal whitespace-pre-line sm:text-xl'>
        {content}
      </div>
    </div>
  );
}
