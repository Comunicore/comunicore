import { useMemo } from 'react';

import { cn } from '../lib/classNames';
import { md } from '../lib/markdown/parser';
import { sanitize } from '../lib/markdown/sanitize';

const defaultPreviewStyles = cn(
  'max-w-none prose prose-invert',
  // Headings
  '**:[h1]:text-4xl mb-5',
  '**:[h2]:text-3xl mb-4',
  '**:[h3]:text-2xl mb-3',
  // Elements
  '**:[hr]:my-3',
  '**:[ul]:list-disc **:[ul]:pl-8',
  '**:[ol]:list-decimal **:[ol]:pl-8',
  '**:[blockquote]:bg-purple-9d/40 **:[blockquote]:p-2 **:[blockquote]:rounded-lg **:[blockquote]:border-l-5 **:[blockquote]:border-purple-9d',
  '**:[a]:text-purple-9d **:[a]:underline',
  // Table
  '**:[table]:border-gray-9e **:[table]:border-3 **:[table]:rounded-sm',
  '**:[thead]:bg-gray-9e/20 **:[thead]:text-white **:[thead]:font-bold **:[thead]:border-b-3 **:[thead]:border-gray-9e',
  '**:[tr]:not-last:border-b-3 **:[tr]:border-gray-9e',
  '**:[td]:not-last:border-r-3 **:[td]:border-gray-9e **:[td]:p-2',
  // Code block
  '**:[pre]:rounded-lg **:[pre]:border-1 **:[pre]:border-transparent **:[pre]:overflow-hidden',
);

interface StyledPostHtmlProps {
  markdown?: string;
}

export function StyledPostHtml({ markdown }: StyledPostHtmlProps) {
  const parsedMarkdown = useMemo(
    () => sanitize(md.render(markdown || '')),
    [markdown],
  );

  return (
    <div
      className={defaultPreviewStyles}
      dangerouslySetInnerHTML={{ __html: parsedMarkdown }}
    />
  );
}
