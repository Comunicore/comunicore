import { HTMLAttributes } from 'react';

import { cn } from '../lib/classNames';

interface Props extends HTMLAttributes<HTMLSpanElement> {
  error: string;
  className?: string;
}

export function ErrorMessage(props: Props) {
  const { error, className, ...attrs } = props;
  return (
    <span
      role='alert'
      className={cn(
        'animate-in fade-in slide-in-from-top-1 text-red-ff text-sm duration-200',
        className,
      )}
      {...attrs}
    >
      {error}
    </span>
  );
}
