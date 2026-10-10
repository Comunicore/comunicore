import { ReactNode } from 'react';

import { cn } from '@/shared/lib/classNames';

interface CommentCardProps {
  avatar: ReactNode;
  // Имя автора и его бейдж
  author: ReactNode;
  text: string;
  className?: string;
}

export function CommentCard({
  avatar,
  author,
  text,
  className,
}: CommentCardProps) {
  return (
    <article className={cn('relative flex items-center gap-x-1.5', className)}>
      {avatar}
      <div className='flex min-w-0 flex-col gap-y-2.5'>
        <div className='flex flex-wrap items-start gap-1.5'>{author}</div>
        <p className='leading-normal whitespace-pre-line'>{text}</p>
      </div>
    </article>
  );
}
