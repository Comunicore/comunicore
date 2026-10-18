'use client';

import { useState } from 'react';
import { IconType } from 'react-icons';
import {
  LuBookmark,
  LuOctagonAlert,
  LuShare2,
  LuThumbsUp,
} from 'react-icons/lu';

import { cn } from '@/shared/lib/classNames';
import { formatInt } from '@/shared/lib/helpers/formatInt';

const buttonStyles =
  'bg-light/5 text-gray-9e hover:text-light flex items-center gap-x-1.25 rounded-[0.625rem] px-2.5 py-1.25 text-lg leading-normal transition-colors';

const activeStyles = 'text-purple-86 hover:text-purple-86';

interface PostActionsProps {
  likesCount: number;
}

interface PostAction {
  id: string;
  label: string;
  Icon: IconType;
}

const actions: PostAction[] = [
  { id: 'share', label: 'Поделиться', Icon: LuShare2 },
  { id: 'report', label: 'Пожаловаться', Icon: LuOctagonAlert },
];

export default function PostActions({ likesCount }: PostActionsProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const count = likesCount + (isLiked ? 1 : 0);

  return (
    <ul className='flex flex-wrap items-end gap-2.5 sm:gap-5'>
      <li>
        <button
          type='button'
          aria-pressed={isLiked}
          aria-label={`Нравится: ${count}`}
          onClick={() => setIsLiked((liked) => !liked)}
          className={cn(buttonStyles, isLiked && activeStyles)}
        >
          <LuThumbsUp size={24} className='shrink-0' aria-hidden='true' />
          {formatInt(count)}
        </button>
      </li>
      <li>
        <button
          type='button'
          aria-pressed={isSaved}
          onClick={() => setIsSaved((saved) => !saved)}
          className={cn(buttonStyles, isSaved && activeStyles)}
        >
          <LuBookmark
            size={24}
            fill={isSaved ? 'currentColor' : 'none'}
            className='shrink-0'
            aria-hidden='true'
          />
          {isSaved ? 'Сохранено' : 'Сохранить'}
        </button>
      </li>
      {actions.map(({ id, label, Icon }) => (
        <li key={id}>
          <button type='button' className={buttonStyles}>
            <Icon size={24} className='shrink-0' aria-hidden='true' />
            {label}
          </button>
        </li>
      ))}
    </ul>
  );
}
