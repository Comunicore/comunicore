'use client';

import { FormEvent, Ref, useRef, useState } from 'react';
import { LuSend } from 'react-icons/lu';
import Link from 'next/link';

import { useAddComment } from '../model/useAddComment';

import { selectIsAuthenticated, useAuthStore } from '@/entities/session';
import { mapUserToMessageAuthor, useUser } from '@/entities/user';

import { AppRouter } from '@/shared/config/app-router';
import { Input } from '@/shared/ui';

interface AddCommentFormProps {
  postId: number;
  text: string;
  onTextChange: (text: string) => void;
  inputRef?: Ref<HTMLTextAreaElement>;
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
  const formRef = useRef<HTMLFormElement>(null);

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
      ref={formRef}
      id='add-comment'
      onSubmit={handleSubmit}
      className='flex scroll-mt-28 flex-col gap-y-2'
    >
      <label htmlFor='post-comment' className='sr-only'>
        Комментарий
      </label>
      <Input
        isTextarea
        ref={inputRef}
        id='post-comment'
        name='comment'
        value={text}
        onChange={(event) => onTextChange(event.target.value)}
        placeholder='Введите комментарий'
        autoComplete='off'
        inputColor='ghost'
        inputSize='lg'
        actionIcon={<LuSend />}
        actionIconLabel='Отправить комментарий'
        onActionIconClick={() => formRef.current?.requestSubmit()}
      />
      {hasError && (
        <p role='alert' className='text-red-ff text-sm'>
          Не удалось отправить комментарий. Попробуйте ещё раз.
        </p>
      )}
    </form>
  );
}
