import { ReactNode } from 'react';
import Link from 'next/link';

import { PostComment } from '../model/post-comment.types';

import { CommentCard } from '@/entities/comment';
import { RoleBadge, UserAvatar } from '@/entities/user';

import { AppRouter } from '@/shared/config/app-router';
import { cn } from '@/shared/lib/classNames';
import { ChevronDownIcon } from '@/shared/ui';

// ---------------------------------------------------------------------------
// Линии ветки комментариев.
// Вертикальная линия идёт от центра аватара родителя (35px) к центру
// дочернего элемента. --thread-offset - расстояние от этой линии до ребёнка.
// ---------------------------------------------------------------------------

// Линия вниз от аватара родителя до списка ответов
const parentLineStyles = cn(
  'after:absolute after:top-[calc(50%+2.1875rem)] after:left-8.75 after:w-px',
  'after:bg-gray-9e/30',
);

// Изгиб к последнему ребёнку: сверху до его центра
const lastElbowStyles = cn(
  'before:absolute before:top-0 before:bottom-1/2',
  'before:left-[calc(-1*var(--thread-offset))] before:w-(--thread-offset)',
  'before:rounded-bl-xl before:border-b before:border-l',
  'before:border-gray-9e/30',
);

// Ответвление к промежуточному ребёнку (вертикаль рисует rail у li)
const branchStyles = cn(
  'before:absolute before:bottom-1/2 before:h-3',
  'before:left-[calc(-1*var(--thread-offset))] before:w-(--thread-offset)',
  'before:rounded-bl-xl before:border-b before:border-l',
  'before:border-gray-9e/30',
);

// Вертикаль вдоль промежуточного ребёнка и отступа до следующего
const railStyles = cn(
  'after:absolute after:top-0 after:-bottom-5 after:w-px',
  'after:left-[calc(-1*var(--thread-offset))] after:bg-gray-9e/30',
);

interface ThreadNodeProps {
  isLast: boolean;
  children: ReactNode;
  nested?: ReactNode;
}

function ThreadNode({ isLast, children, nested }: ThreadNodeProps) {
  return (
    <li className={cn('relative', !isLast && railStyles)}>
      <div className={cn('relative', isLast ? lastElbowStyles : branchStyles)}>
        {children}
      </div>
      {nested}
    </li>
  );
}

function HiddenRepliesButton({ count }: { count: number }) {
  return (
    <button
      type='button'
      className='hover:text-purple-86 flex h-6 items-center gap-x-2.5 text-xs leading-3 transition-colors'
    >
      {count} ответов
      <ChevronDownIcon />
    </button>
  );
}

interface CommentProps {
  comment: PostComment;
}

const hasReplies = (comment: PostComment) => !!comment.replies?.length;

const hasThread = (comment: PostComment) =>
  hasReplies(comment) || !!comment.hiddenRepliesCount;

function ThreadComment({ comment }: CommentProps) {
  const { author, text } = comment;

  return (
    <CommentCard
      className={cn(
        hasThread(comment) && parentLineStyles,
        hasThread(comment) &&
          (hasReplies(comment) ? 'after:-bottom-5' : 'after:-bottom-1'),
      )}
      avatar={<UserAvatar user={author} />}
      author={
        <>
          <Link
            href={AppRouter.user.getRoute(author.id)}
            className='hover:text-purple-86 text-xl leading-normal font-semibold sm:text-2xl'
          >
            {author.name}
          </Link>
          <RoleBadge role={author.role} />
        </>
      }
      text={text}
    />
  );
}

function CommentReplies({ comment }: CommentProps) {
  const replies = comment.replies ?? [];
  const hiddenCount = comment.hiddenRepliesCount ?? 0;
  const lastIndex = replies.length - (hiddenCount ? 0 : 1);

  if (!hasThread(comment)) {
    return null;
  }

  // Ответы ещё не загружены: только кнопка под комментарием
  if (!replies.length) {
    return (
      <ul className='mt-1 pl-17.5 [--thread-offset:2.1875rem]'>
        <ThreadNode isLast>
          <HiddenRepliesButton count={hiddenCount} />
        </ThreadNode>
      </ul>
    );
  }

  return (
    <ul
      className={cn(
        'mt-5 flex flex-col gap-y-5',
        'pl-[calc(var(--thread-offset)+2.1875rem)]',
        '[--thread-offset:1.3125rem] sm:[--thread-offset:4.4375rem]',
      )}
    >
      {replies.map((reply, index) => (
        <ThreadNode
          key={reply.id}
          isLast={index === lastIndex}
          nested={<CommentReplies comment={reply} />}
        >
          <ThreadComment comment={reply} />
        </ThreadNode>
      ))}
      {!!hiddenCount && (
        <ThreadNode isLast>
          <HiddenRepliesButton count={hiddenCount} />
        </ThreadNode>
      )}
    </ul>
  );
}

export function CommentThread({ comment }: CommentProps) {
  return (
    <li>
      <ThreadComment comment={comment} />
      <CommentReplies comment={comment} />
    </li>
  );
}
