'use client';

import { MouseEvent, useLayoutEffect, useMemo, useRef, useState } from 'react';

import {
  CommentTextPart,
  getCommentElementId,
  getPreviewParts,
  getVisibleLength,
  highlightComment,
  parseCommentText,
} from '../lib/commentReference';

const COMMENT_PREVIEW_LENGTH = 300;
const TOGGLE_ANIMATION_MS = 300;

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
  const textRef = useRef<HTMLParagraphElement>(null);
  const startHeightRef = useRef<number | null>(null);
  const parts = useMemo(() => parseCommentText(text), [text]);
  const isLong = getVisibleLength(parts) > COMMENT_PREVIEW_LENGTH;
  const isCollapsed = isLong && !isExpanded;

  useLayoutEffect(() => {
    const element = textRef.current;
    const startHeight = startHeightRef.current;
    startHeightRef.current = null;

    if (!element || startHeight === null) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const animation = element.animate(
      [{ height: `${startHeight}px` }, { height: `${element.offsetHeight}px` }],
      { duration: TOGGLE_ANIMATION_MS, easing: 'ease-in-out' },
    );

    element.style.overflow = 'hidden';
    animation.onfinish = () => {
      element.style.overflow = '';
    };
    animation.oncancel = animation.onfinish;
  }, [isExpanded]);

  const handleToggle = () => {
    startHeightRef.current = textRef.current?.offsetHeight ?? null;
    setIsExpanded((expanded) => !expanded);
  };

  return (
    <p ref={textRef} className='leading-normal whitespace-pre-line'>
      {isCollapsed ? (
        <>{renderParts(getPreviewParts(parts, COMMENT_PREVIEW_LENGTH))}…</>
      ) : (
        renderParts(parts)
      )}
      {isLong && (
        <>
          {' '}
          <button
            type='button'
            aria-expanded={isExpanded}
            onClick={handleToggle}
            className='text-purple-67 hover:text-purple-86 font-semibold transition-colors'
          >
            {isExpanded ? 'свернуть' : 'показать'}
          </button>
        </>
      )}
    </p>
  );
}
