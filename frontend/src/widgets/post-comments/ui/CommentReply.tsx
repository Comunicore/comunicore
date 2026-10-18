'use client';

import Link from 'next/link';

import { selectIsAuthenticated, useAuthStore } from '@/entities/session';

import { AppRouter } from '@/shared/config/app-router';

const replyStyles =
  'text-gray-9e hover:text-purple-86 w-fit text-sm font-medium transition-colors';

interface CommentReplyProps {
  onReply: () => void;
}

export function CommentReply({ onReply }: CommentReplyProps) {
  const isAuthenticated = useAuthStore(selectIsAuthenticated);

  if (!isAuthenticated) {
    return (
      <Link href={AppRouter.auth.login} className={replyStyles}>
        Ответить
      </Link>
    );
  }

  return (
    <button type='button' onClick={onReply} className={replyStyles}>
      Ответить
    </button>
  );
}
