'use client';

import { useCallback, useRef, useState } from 'react';

import { PostComment } from '../model/post-comment.types';

import { CommentList } from './CommentList';

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
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleReply = useCallback((comment: PostComment) => {
    const reference = createCommentReference(comment.id, comment.author.name);

    setDraft((current) => {
      const separator = current && !current.endsWith(' ') ? ' ' : '';
      return `${current}${separator}${reference} `;
    });

    inputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    inputRef.current?.focus({ preventScroll: true });
  }, []);

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
          className='text-2xl leading-normal font-bold sm:text-3xl'
        >
          Комментарии ({commentsCount})
        </h2>

        {comments.length > 0 ? (
          <CommentList comments={comments} onReply={handleReply} />
        ) : (
          <p className='text-gray-9e'>Комментариев пока нет. Будьте первым!</p>
        )}
      </section>
    </>
  );
}
