import { UserPreview } from '../model/user-preview.types';

import { cn } from '@/shared/lib/classNames';
import { ProfileAvatar } from '@/shared/ui';

type AvatarSize = 'md' | 'lg' | 'xl';

const sizeStyles: Record<AvatarSize, { px: number; className: string }> = {
  md: { px: 70, className: 'size-17.5' },
  lg: { px: 90, className: 'size-22.5' },
  xl: { px: 120, className: 'size-30' },
};

interface UserAvatarProps {
  user: Pick<UserPreview, 'name' | 'avatarUrl'>;
  size?: AvatarSize;
  className?: string;
}

export function UserAvatar({ user, size = 'md', className }: UserAvatarProps) {
  const { px, className: sizeClassName } = sizeStyles[size];

  return (
    <ProfileAvatar
      authorName={user.name}
      avatarUrl={user.avatarUrl}
      width={px}
      height={px}
      className={cn('shrink-0', sizeClassName, className)}
    />
  );
}
