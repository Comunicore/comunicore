import { UserRole } from '../model/user-preview.types';

import { cn } from '@/shared/lib/classNames';
import { Tag } from '@/shared/ui';

const roleConfig: Record<UserRole, { label: string; className: string }> = {
  superAdmin: {
    label: 'Сверх Администратор',
    className: 'bg-red-ff/40 text-light',
  },
  moderator: {
    label: 'Модератор',
    className: 'bg-purple-86 text-light',
  },
  member: {
    label: 'Участник',
    className: 'bg-blue-3e/20 text-blue-3e',
  },
  rude: {
    label: 'Невоспитанный',
    className: 'bg-gray-9e/10 text-light',
  },
};

interface RoleBadgeProps {
  role: UserRole;
  className?: string;
}

export function RoleBadge({ role, className }: RoleBadgeProps) {
  const { label, className: roleClassName } = roleConfig[role];

  return (
    <Tag
      className={cn(
        'shrink-0 px-2.5 font-normal whitespace-nowrap shadow-[inset_0_-1px_1px_rgb(67_90_111/20%)]',
        roleClassName,
        className,
      )}
    >
      {label}
    </Tag>
  );
}
