import { cn } from '../lib/classNames';

interface QueryErrorProps {
  error?: string | null;
  title: string;
  description: string;
  icon?: React.ReactNode;
  className?: string;
}

export function QueryError({
  error,
  title,
  description,
  icon,
  className,
}: QueryErrorProps) {
  const finalTitle = error ? `${title} ${error}` : title;
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-y-2 py-12 text-center',
        className,
      )}
    >
      {icon && <div className='mb-2 text-gray-400'>{icon}</div>}
      <p className='font-medium text-gray-300'>{finalTitle}</p>
      {description && <p className='text-sm text-gray-500'>{description}</p>}
    </div>
  );
}
