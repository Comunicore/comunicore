import { UserPreview } from '../model/user-preview.types';

import { RoleBadge } from './RoleBadge';
import { UserAvatar } from './UserAvatar';

import { cn } from '@/shared/lib/classNames';

interface UserCardProps {
  user: UserPreview;
  className?: string;
}

export function UserCard({ user, className }: UserCardProps) {
  return (
    <div className={cn('flex items-center gap-x-1.5 px-2.5', className)}>
      <UserAvatar user={user} size='xl' />
      <div className='flex min-w-0 flex-col items-start gap-y-px'>
        <p className='text-2xl leading-normal font-semibold'>{user.name}</p>
        <RoleBadge role={user.role} />
      </div>
    </div>
  );
}
