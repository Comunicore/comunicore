import { HTMLAttributes } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

import { CreateThreadTypes } from '../../../model/schemas/create-thread.schema';

import { cn } from '@/shared/lib/classNames';

interface TitleCounterProps extends HTMLAttributes<HTMLSpanElement> {
  titleMaxLenght: number;
}
export function TitleCounter(props: TitleCounterProps) {
  const { className, titleMaxLenght } = props;
  const { control } = useFormContext<CreateThreadTypes>();

  const title = useWatch({
    control,
    name: 'title',
  });

  const currentLength = (title ?? '').length;
  return (
    <span
      className={cn(
        'text-gray-9e absolute top-1/2 right-0 -translate-y-1/2 px-5 text-lg',
        className,
      )}
    >
      {currentLength} / {titleMaxLenght}
    </span>
  );
}
