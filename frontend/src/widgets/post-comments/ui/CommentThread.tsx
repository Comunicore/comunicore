import { ReactNode } from 'react';
import { LuChevronDown } from 'react-icons/lu';
import Link from 'next/link';

import { PostComment } from '../model/post-comment.types';

import { CommentReply } from './CommentReply';

import { CommentCard } from '@/entities/comment';
import { RoleBadge, UserAvatar } from '@/entities/user';

import { AppRouter } from '@/shared/config/app-router';
import { cn } from '@/shared/lib/classNames';

const parentLineStyles = cn(
  'after:absolute after:top-17.5 after:left-8.75 after:w-px',
  'after:bg-gray-9e/30',
);

const lastElbowStyles = cn(
  'before:absolute before:top-0 before:h-(--node-center)',
  'before:left-[calc(-1*var(--branch-offset))] before:w-(--branch-offset)',
  'before:rounded-bl-xl before:border-b before:border-l',
  'before:border-gray-9e/30',
);

const branchStyles = cn(
  'before:absolute before:top-[calc(var(--node-center)-0.75rem)] before:h-3',
  'before:left-[calc(-1*var(--branch-offset))] before:w-(--branch-offset)',
  'before:rounded-bl-xl before:border-b before:border-l',
  'before:border-gray-9e/30',
);

const railStyles = cn(
  'after:absolute after:top-0 after:-bottom-5 after:w-px',
  'after:left-[calc(-1*var(--branch-offset))] after:bg-gray-9e/30',
);

const nodeCenterStyles = {
  comment: '[--node-center:2.1875rem]',
  toggle: '[--node-center:0.75rem]',
};

interface ThreadNodeProps {
  isLast: boolean;
  kind: keyof typeof nodeCenterStyles;
  children: ReactNode;
  nested?: ReactNode;
}

function ThreadNode({ isLast, kind, children, nested }: ThreadNodeProps) {
  return (
    <li className={cn('relative', !isLast && railStyles)}>
      <div
        className={cn(
          'relative',
          nodeCenterStyles[kind],
          isLast ? lastElbowStyles : branchStyles,
        )}
      >
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
      <LuChevronDown size={24} aria-hidden='true' />
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
      avatar={
        <Link
          href={AppRouter.user.getRoute(author.id)}
          className='shrink-0 transition-opacity hover:opacity-80'
        >
          <UserAvatar user={author} />
        </Link>
      }
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
      actions={<CommentReply commentId={comment.id} authorName={author.name} />}
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

  if (!replies.length) {
    return (
      <ul className='mt-1 pl-17.5 [--branch-offset:2.1875rem]'>
        <ThreadNode isLast kind='toggle'>
          <HiddenRepliesButton count={hiddenCount} />
        </ThreadNode>
      </ul>
    );
  }

  return (
    <ul
      className={cn(
        'mt-5 flex flex-col gap-y-5',
        'pl-[calc(var(--branch-offset)+2.1875rem)]',
        '[--branch-offset:1.3125rem] sm:[--branch-offset:4.4375rem]',
      )}
    >
      {replies.map((reply, index) => (
        <ThreadNode
          key={reply.id}
          isLast={index === lastIndex}
          kind='comment'
          nested={<CommentReplies comment={reply} />}
        >
          <ThreadComment comment={reply} />
        </ThreadNode>
      ))}
      {!!hiddenCount && (
        <ThreadNode isLast kind='toggle'>
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
