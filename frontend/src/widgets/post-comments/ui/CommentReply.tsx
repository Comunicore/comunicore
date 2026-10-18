'use client';

import { FormEvent, KeyboardEvent, useState } from 'react';

import { Button } from '@/shared/ui';

interface CommentReplyProps {
  commentId: string;
  authorName: string;
}

export function CommentReply({ commentId, authorName }: CommentReplyProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [text, setText] = useState('');

  const close = () => {
    setIsOpen(false);
    setText('');
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    close();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLFormElement>) => {
    if (event.key === 'Escape') close();
  };

  if (!isOpen) {
    return (
      <button
        type='button'
        onClick={() => setIsOpen(true)}
        className='text-gray-9e hover:text-purple-86 w-fit text-sm font-medium transition-colors'
      >
        Ответить
      </button>
    );
  }

  const fieldId = `reply-${commentId}`;

  return (
    <form
      onSubmit={handleSubmit}
      onKeyDown={handleKeyDown}
      className='flex flex-col gap-y-2.5'
    >
      <label htmlFor={fieldId} className='sr-only'>
        Ответ для {authorName}
      </label>
      <textarea
        id={fieldId}
        name='reply'
        rows={3}
        autoFocus
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder={`Ответ для ${authorName}`}
        className='border-gray-9e placeholder:text-gray-9e focus:border-purple-67 w-full resize-y rounded-[0.625rem] border bg-transparent px-2.5 py-2 outline-none'
      />
      <div className='flex justify-end gap-x-2.5'>
        <Button color='transparent' size='sm' onClick={close}>
          Отмена
        </Button>
        <Button
          type='submit'
          size='sm'
          disabled={!text.trim()}
          className='disabled:pointer-events-none disabled:opacity-50'
        >
          Ответить
        </Button>
      </div>
    </form>
  );
}
