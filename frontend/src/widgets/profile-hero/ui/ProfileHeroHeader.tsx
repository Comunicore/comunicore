import { User } from '@/entities/user';

import { cn } from '@/shared/lib/classNames';
import {
  DATE_FALLBACK,
  safeFormatDate,
} from '@/shared/lib/helpers/safeFormatDate';
import { Tag } from '@/shared/ui';

type ProfileHeaderProps = Pick<User, 'createdAt' | 'name' | 'role' | 'userTag'>;

export function ProfileHeroHeader(props: ProfileHeaderProps) {
  const { role, name, createdAt, userTag } = props;

  return (
    <div className='flex flex-col gap-y-2.5'>
      <header
        className={cn(
          'flex flex-col gap-y-2.5',
          'max-lg:items-center',
          'lg:flex-row lg:items-center lg:gap-x-3 lg:gap-y-0',
        )}
      >
        <h1
          className={cn(
            'text-2xl font-bold',
            'lg:text-4xl',
            'xl:text-5xl xl:leading-16',
            '2xl:text-[4rem] 2xl:leading-19.5',
          )}
        >
          {name}
        </h1>
        {role && <Tag className='whitespace-nowrap'>{role}</Tag>}
      </header>

      <div
        className={cn(
          'flex flex-col justify-between font-bold',
          'max-sm:text-[0.75rem]',
          'max-lg:text-gray-9e max-lg:text-center',
          'lg:flex-row lg:gap-x-5 lg:pr-12.5',
        )}
      >
        <span>{userTag}</span>
        <span>
          На форуме с{' '}
          {createdAt ? (
            <time dateTime={createdAt}>{safeFormatDate(createdAt)}</time>
          ) : (
            DATE_FALLBACK
          )}
        </span>
      </div>
    </div>
  );
}
