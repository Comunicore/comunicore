'use client';

import { FormEvent, Ref, useState } from 'react';
import Link from 'next/link';

import { useAddComment } from '../model/useAddComment';

import { selectIsAuthenticated, useAuthStore } from '@/entities/session';
import { mapUserToMessageAuthor, useUser } from '@/entities/user';

import { AppRouter } from '@/shared/config/app-router';

const fieldStyles =
  'border-gray-9e placeholder:text-gray-9e focus:border-purple-67 h-12.5 w-full rounded-[0.625rem] border bg-transparent px-2.5 text-lg font-medium outline-none';

interface AddCommentFormProps {
  postId: number;
  text: string;
  onTextChange: (text: string) => void;
  inputRef?: Ref<HTMLInputElement>;
}

export function AddCommentForm({
  postId,
  text,
  onTextChange,
  inputRef,
}: AddCommentFormProps) {
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const { user } = useUser({ enabled: isAuthenticated });
  const currentUser = user?.user ?? null;
  const author = currentUser ? mapUserToMessageAuthor(currentUser) : null;

  const { mutate } = useAddComment(postId, author);
  const [hasError, setHasError] = useState(false);

  if (!isAuthenticated) {
    return (
      <Link
        href={AppRouter.auth.login}
        className='text-gray-9e hover:text-purple-86'
      >
        Войдите, чтобы оставить комментарий
      </Link>
    );
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const contentMd = text.trim();
    if (!contentMd) return;

    onTextChange('');
    setHasError(false);

    mutate(
      { path: { postId }, body: { contentMd } },
      {
        onError: () => {
          onTextChange(contentMd);
          setHasError(true);
        },
      },
    );
  };

  return (
    <form
      id='add-comment'
      onSubmit={handleSubmit}
      className='flex scroll-mt-28 flex-col gap-y-2'
    >
      <label htmlFor='post-comment' className='sr-only'>
        Комментарий
      </label>
      <input
        ref={inputRef}
        id='post-comment'
        name='comment'
        type='text'
        value={text}
        onChange={(event) => onTextChange(event.target.value)}
        placeholder='Введите комментарий'
        autoComplete='off'
        className={fieldStyles}
      />
      {hasError && (
        <p role='alert' className='text-red-ff text-sm'>
          Не удалось отправить комментарий. Попробуйте ещё раз.
        </p>
      )}
    </form>
  );
}
