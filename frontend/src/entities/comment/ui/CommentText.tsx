'use client';

import { MouseEvent, useMemo, useState } from 'react';

import {
  CommentTextPart,
  getCommentElementId,
  getPreviewParts,
  getVisibleLength,
  highlightComment,
  parseCommentText,
} from '../lib/commentReference';

const COMMENT_PREVIEW_LENGTH = 300;

function CommentReferenceLink({
  part,
}: {
  part: Extract<CommentTextPart, { type: 'reference' }>;
}) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (highlightComment(part.commentId)) {
      event.preventDefault();
    }
  };

  return (
    <a
      href={`#${getCommentElementId(part.commentId)}`}
      onClick={handleClick}
      className='text-purple-67 hover:text-purple-86 font-semibold transition-colors'
    >
      @{part.authorName}
    </a>
  );
}

function renderParts(parts: CommentTextPart[]) {
  return parts.map((part, index) =>
    part.type === 'text' ? (
      part.value
    ) : (
      <CommentReferenceLink key={index} part={part} />
    ),
  );
}

interface CommentTextProps {
  text: string;
}

export function CommentText({ text }: CommentTextProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const parts = useMemo(() => parseCommentText(text), [text]);
  const isLong = getVisibleLength(parts) > COMMENT_PREVIEW_LENGTH;
  const isCollapsed = isLong && !isExpanded;

  return (
    <p className='leading-normal whitespace-pre-line'>
      {isCollapsed ? (
        <>
          {renderParts(getPreviewParts(parts, COMMENT_PREVIEW_LENGTH))}…{' '}
          <button
            type='button'
            aria-expanded={false}
            onClick={() => setIsExpanded(true)}
            className='text-purple-67 hover:text-purple-86 font-semibold transition-colors'
          >
            ещё
          </button>
        </>
      ) : (
        renderParts(parts)
      )}
    </p>
  );
}
