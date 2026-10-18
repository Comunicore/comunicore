'use client';

import { useRef, useState } from 'react';

import { PostComment } from '../model/post-comment.types';

import { CommentItem } from './CommentItem';

import { AddCommentForm } from '@/features/add-comment';

import { createCommentReference } from '@/entities/comment';

interface PostCommentsProps {
  postId: number;
  comments: PostComment[];
  commentsCount: number;
}

export function PostComments({
  postId,
  comments,
  commentsCount,
}: PostCommentsProps) {
  const [draft, setDraft] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleReply = (comment: PostComment) => {
    const reference = createCommentReference(comment.id, comment.author.name);

    setDraft((current) => {
      const separator = current && !current.endsWith(' ') ? ' ' : '';
      return `${current}${separator}${reference} `;
    });

    inputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    inputRef.current?.focus({ preventScroll: true });
  };

  return (
    <>
      <AddCommentForm
        postId={postId}
        text={draft}
        onTextChange={setDraft}
        inputRef={inputRef}
      />

      <section
        aria-labelledby='comments-heading'
        className='flex flex-col gap-y-10'
      >
        <h2
          id='comments-heading'
          className='text-2xl leading-normal font-bold sm:text-4xl'
        >
          Комментарии ({commentsCount})
        </h2>

        {comments.length > 0 ? (
          <ul className='bg-dark-0e border-gray-9e/10 flex flex-col gap-y-5 rounded-3xl border px-4 py-5 sm:rounded-[3.125rem]'>
            {comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                onReply={handleReply}
              />
            ))}
          </ul>
        ) : (
          <p className='text-gray-9e'>Комментариев пока нет. Будьте первым!</p>
        )}
      </section>
    </>
  );
}
