import { ReactNode } from 'react';

import { getCommentElementId } from '../lib/commentReference';

import { CommentText } from './CommentText';

import { cn } from '@/shared/lib/classNames';

interface CommentCardProps {
  commentId: string;
  avatar: ReactNode;
  author: ReactNode;
  text: string;
  actions?: ReactNode;
  className?: string;
}

export function CommentCard({
  commentId,
  avatar,
  author,
  text,
  actions,
  className,
}: CommentCardProps) {
  return (
    <article
      id={getCommentElementId(commentId)}
      className={cn(
        '-m-2 flex scroll-mt-28 items-start gap-x-1.5 rounded-xl p-2',
        className,
      )}
    >
      {avatar}
      <div className='flex min-w-0 flex-1 flex-col gap-y-2.5'>
        <div className='flex flex-wrap items-start gap-1.5'>{author}</div>
        <CommentText text={text} />
        {actions}
      </div>
    </article>
  );
}
