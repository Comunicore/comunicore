'use client';

import { memo } from 'react';
import Link from 'next/link';

import { PostComment } from '../model/post-comment.types';

import { CommentCard } from '@/entities/comment';
import { selectIsAuthenticated, useAuthStore } from '@/entities/session';
import { RoleBadge, UserAvatar } from '@/entities/user';

import { AppRouter } from '@/shared/config/app-router';

const replyStyles =
  'text-gray-9e hover:text-purple-86 w-fit text-sm font-medium transition-colors';

interface CommentListProps {
  comments: PostComment[];
  onReply: (comment: PostComment) => void;
}

export const CommentList = memo(({ comments, onReply }: CommentListProps) => {
  const isAuthenticated = useAuthStore(selectIsAuthenticated);

  const renderActions = (comment: PostComment) => {
    if (comment.isPending) {
      return <span className='text-gray-9e text-sm'>Отправляется…</span>;
    }

    if (!isAuthenticated) {
      return (
        <Link href={AppRouter.auth.login} className={replyStyles}>
          Ответить
        </Link>
      );
    }

    return (
      <button
        type='button'
        onClick={() => onReply(comment)}
        className={replyStyles}
      >
        Ответить
      </button>
    );
  };

  return (
    <ul className='flex flex-col gap-y-5'>
      {comments.map((comment) => {
        const { id, author, text, isPending } = comment;
        const profileHref = AppRouter.user.getRoute(author.id);

        return (
          <li key={id}>
            <CommentCard
              commentId={id}
              className={isPending ? 'opacity-60' : undefined}
              avatar={
                <Link
                  href={profileHref}
                  className='shrink-0 transition-opacity hover:opacity-80'
                >
                  <UserAvatar user={author} />
                </Link>
              }
              author={
                <>
                  <Link
                    href={profileHref}
                    className='hover:text-purple-86 text-xl leading-normal font-semibold sm:text-2xl'
                  >
                    {author.name}
                  </Link>
                  <RoleBadge role={author.role} />
                </>
              }
              text={text}
              actions={renderActions(comment)}
            />
          </li>
        );
      })}
    </ul>
  );
});

CommentList.displayName = 'comment-list';
