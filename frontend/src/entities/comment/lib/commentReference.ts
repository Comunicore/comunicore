const REFERENCE_PATTERN = /\[@([^\]]+)\]\(#comment-(\d+)\)/g;

export type CommentTextPart =
  | { type: 'text'; value: string }
  | { type: 'reference'; authorName: string; commentId: string };

export const getCommentElementId = (commentId: string) =>
  `comment-${commentId}`;

export const createCommentReference = (commentId: string, authorName: string) =>
  `[@${authorName.replace(/[[\]]/g, '')}](#${getCommentElementId(commentId)})`;

export const parseCommentText = (text: string): CommentTextPart[] => {
  const parts: CommentTextPart[] = [];
  let lastIndex = 0;

  for (const match of text.matchAll(REFERENCE_PATTERN)) {
    if (match.index > lastIndex) {
      parts.push({ type: 'text', value: text.slice(lastIndex, match.index) });
    }
    parts.push({
      type: 'reference',
      authorName: match[1],
      commentId: match[2],
    });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push({ type: 'text', value: text.slice(lastIndex) });
  }

  return parts;
};

const getPartLength = (part: CommentTextPart) =>
  part.type === 'text' ? part.value.length : part.authorName.length + 1;

export const getVisibleLength = (parts: CommentTextPart[]) =>
  parts.reduce((sum, part) => sum + getPartLength(part), 0);

export const getPreviewParts = (
  parts: CommentTextPart[],
  limit: number,
): CommentTextPart[] => {
  const preview: CommentTextPart[] = [];
  let used = 0;

  for (const part of parts) {
    const length = getPartLength(part);

    if (used + length <= limit) {
      preview.push(part);
      used += length;
      continue;
    }

    if (part.type === 'text') {
      const cut = part.value.slice(0, limit - used);
      const lastSpace = cut.lastIndexOf(' ');
      preview.push({
        type: 'text',
        value: (lastSpace > 0 ? cut.slice(0, lastSpace) : cut).trimEnd(),
      });
    }
    break;
  }

  return preview;
};

export const highlightComment = (commentId: string) => {
  const element = document.getElementById(getCommentElementId(commentId));
  if (!element) return false;

  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)',
  ).matches;

  element.scrollIntoView({
    behavior: prefersReducedMotion ? 'auto' : 'smooth',
    block: 'center',
  });
  element.animate(
    [
      { backgroundColor: 'rgb(103 42 226 / 25%)' },
      { backgroundColor: 'rgb(103 42 226 / 0%)' },
    ],
    { duration: 1800, easing: 'ease-out' },
  );

  return true;
};
