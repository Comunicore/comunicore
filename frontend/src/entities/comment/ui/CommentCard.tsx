import { ReactNode } from 'react';

import { CommentText } from './CommentText';

import { cn } from '@/shared/lib/classNames';

interface CommentCardProps {
  avatar: ReactNode;
  author: ReactNode;
  text: string;
  actions?: ReactNode;
  className?: string;
}

export function CommentCard({
  avatar,
  author,
  text,
  actions,
  className,
}: CommentCardProps) {
  return (
    <article className={cn('relative flex items-start gap-x-1.5', className)}>
      {avatar}
      <div className='flex min-w-0 flex-1 flex-col gap-y-2.5'>
        <div className='flex flex-wrap items-start gap-1.5'>{author}</div>
        <CommentText text={text} />
        {actions}
      </div>
    </article>
  );
}
