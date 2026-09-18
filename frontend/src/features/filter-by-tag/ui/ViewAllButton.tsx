import type { ButtonHTMLAttributes } from 'react';
import { BsArrowRight } from 'react-icons/bs';

import { cn } from '@/shared/lib/classNames';

type ViewAllButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export function ViewAllButton(props: ViewAllButtonProps) {
  const { className, ...restAttrs } = props;

  return (
    <button
      type='button'
      className={cn(
        'text-purple-67 flex items-center gap-x-2.5 text-lg font-bold whitespace-nowrap xl:px-5',
        className,
      )}
      onClick={() => console.log('Here must be logic which show all tags')}
      {...restAttrs}
    >
      <span>Смотреть все теги</span>
      <BsArrowRight size={24} className='min-w-6' />
    </button>
  );
}
