import { ReactNode } from 'react';

import { cn } from '../lib/classNames';

interface SkeletonProps {
  isLoading: boolean;
  children: ReactNode;
}

export const Skeleton = ({ isLoading, children }: SkeletonProps) => {
  if (!isLoading) return <>{children}</>;

  return (
    <div
      data-name='skeleton'
      className={cn(
        '**:bg-gray-ea [&_*]:color-transparent [&_*]:box-shadow-none pointer-events-none animate-pulse select-none **:border-transparent [&_img]:opacity-0 [&_svg]:opacity-0',
      )}
    >
      {children}
    </div>
  );
};

export const Bone = ({ className }: { className?: string }) => (
  <div
    aria-hidden
    className={cn('animate-pulse rounded-lg bg-white/10', className)}
  />
);
