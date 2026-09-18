'use client';

import { ButtonHTMLAttributes, RefObject } from 'react';

import { cn } from '@/shared/lib/classNames';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  ref?: RefObject<HTMLButtonElement | null>;
  controls: string;
}

export function Burger(props: Props) {
  const { isOpen, setIsOpen, className, controls, ref, ...attrs } = props;

  return (
    <button
      type='button'
      onClick={() => setIsOpen(!isOpen)}
      aria-label='Menu'
      aria-expanded={isOpen}
      aria-controls={controls}
      ref={ref}
      {...attrs}
      className={cn(
        'relative flex size-4 h-7.5 w-10 flex-col justify-center gap-y-1 **:duration-200',
        'before:absolute before:top-1/2 before:left-1/2 before:size-7 before:-translate-1/2 before:content-[""]',
        className,
        isOpen &&
          '**:relative **:first:top-1 **:first:rotate-45 **:nth-2:bottom-1 **:nth-2:rotate-135 **:nth-[n+3]:hidden',
        '**:bg-purple-67 **:h-1.25 **:last:relative **:last:-right-5 **:last:w-2/4',
        'before:absolute before:inset-0 before:size-12.5 before:content-[""]',
      )}
    >
      <span className='h-0.5 w-full rounded-lg bg-white' />
      <span className='h-0.5 w-full rounded-lg bg-white' />
      <span className='h-0.5 w-full rounded-lg bg-white' />
    </button>
  );
}
