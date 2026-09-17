'use client';

import { RefObject, useRef } from 'react';

import { MarkdownGetValue, MarkdownSetValue } from '../model/ctx.types';
import { EditorMode } from '../model/mode.types';
import { toolsGroup } from '../model/toolsGroup';

import { useModal } from '@/shared/hooks/useModal';
import { cn } from '@/shared/lib/classNames';

interface Props {
  mode: EditorMode;
  getValues: MarkdownGetValue;
  setValue: MarkdownSetValue;
  markdownFieldRef: RefObject<HTMLTextAreaElement | null>;
}

const TOOL_BAR_ID = 'tool-bar';

export function Toolbar(props: Props) {
  const { mode, getValues, setValue, markdownFieldRef } = props;
  const burgerMenuRef = useRef<HTMLButtonElement>(null);
  const toolBarRef = useRef<HTMLUListElement>(null);
  const { modalOpen } = useModal(toolBarRef, burgerMenuRef, {
    autoClose: false,
  });

  return (
    <div
      className={cn(
        'relative flex items-center justify-end px-3 text-white',
        mode === 'preview' && 'hidden',
      )}
    >
      <ul
        id={TOOL_BAR_ID}
        ref={toolBarRef}
        className={cn(
          'absolute top-6 right-4 z-10 flex w-30 flex-col overflow-hidden rounded-lg bg-neutral-600 shadow-lg transition-all duration-200 ease-out',
          !modalOpen && 'pointer-events-none origin-top scale-y-0 opacity-0',
          'lg:pointer-events-auto lg:static lg:top-0 lg:right-0 lg:w-full lg:scale-100 lg:flex-row lg:justify-end lg:overflow-auto lg:rounded-none lg:bg-transparent lg:py-0 lg:opacity-100 lg:shadow-none',
        )}
      >
        {toolsGroup.flat().map(({ label, title, toolFn }) => (
          <li
            key={title}
            className={cn(
              'flex items-center duration-200 not-last:border-b not-last:border-b-neutral-700 hover:bg-neutral-800',
              'lg:hover:bg-blue-20 lg:size-8 lg:justify-center lg:rounded-sm lg:not-last:border-b-0',
            )}
          >
            <button
              type='button'
              title={title}
              onClick={() =>
                toolFn({
                  getValues,
                  setValue,
                  textarea: markdownFieldRef.current,
                })
              }
              className={cn(
                'flex w-full items-center gap-x-2 px-4 py-2',
                'lg:size-8/10 lg:justify-center lg:gap-0 lg:p-0',
              )}
            >
              {label}
              <span className='text-sm leading-[100%] whitespace-nowrap lg:hidden'>
                {title}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
