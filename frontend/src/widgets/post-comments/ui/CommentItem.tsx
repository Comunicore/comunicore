import Link from 'next/link';

import { PostComment } from '../model/post-comment.types';

import { CommentReply } from './CommentReply';

import { CommentCard } from '@/entities/comment';
import { RoleBadge, UserAvatar } from '@/entities/user';

import { AppRouter } from '@/shared/config/app-router';

interface CommentItemProps {
  comment: PostComment;
  onReply: (comment: PostComment) => void;
}

export function CommentItem({ comment, onReply }: CommentItemProps) {
  const { id, author, text, isPending } = comment;

  return (
    <li>
      <CommentCard
        commentId={id}
        className={isPending ? 'opacity-60' : undefined}
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
        actions={
          isPending ? (
            <span className='text-gray-9e text-sm'>Отправляется…</span>
          ) : (
            <CommentReply onReply={() => onReply(comment)} />
          )
        }
      />
    </li>
  );
}
