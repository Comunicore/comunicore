'use client';

import { useState } from 'react';

const COMMENT_PREVIEW_LENGTH = 300;

const getPreview = (text: string) => {
  const cut = text.slice(0, COMMENT_PREVIEW_LENGTH);
  const lastSpace = cut.lastIndexOf(' ');

  return (lastSpace > 0 ? cut.slice(0, lastSpace) : cut).trimEnd();
};

interface CommentTextProps {
  text: string;
}

export function CommentText({ text }: CommentTextProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isLong = text.length > COMMENT_PREVIEW_LENGTH;
  const isCollapsed = isLong && !isExpanded;

  return (
    <p className='leading-normal whitespace-pre-line'>
      {isCollapsed ? `${getPreview(text)}… ` : text}
      {isCollapsed && (
        <button
          type='button'
          aria-expanded={false}
          onClick={() => setIsExpanded(true)}
          className='text-purple-67 hover:text-purple-86 font-semibold transition-colors'
        >
          ещё
        </button>
      )}
    </p>
  );
}
