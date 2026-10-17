import { cn } from '@/shared/lib/classNames';

interface PostContentProps {
  content: string;
  className?: string;
}

export function PostContent({ content, className }: PostContentProps) {
  return (
    <div
      className={cn(
        'font-(family-name:--font-inter) text-base leading-normal whitespace-pre-line sm:text-xl',
        className,
      )}
    >
      {content}
    </div>
  );
}
