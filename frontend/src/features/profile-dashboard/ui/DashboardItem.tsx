import { memo } from 'react';
import Link from 'next/link';

import { DashboardItemTypes } from '../model/dashboard-item.types';

import { AppRouter } from '@/shared/config/app-router';
import { cn } from '@/shared/lib/classNames';
import { formatInt } from '@/shared/lib/helpers/formatInt';
import { formatTimeAgo } from '@/shared/lib/helpers/formatTimeAgo';
import { Tag } from '@/shared/ui';

interface DashboardItemProps extends DashboardItemTypes {
  href: string;
}

export const DashboardItem = memo(
  ({
    id,
    messageId,
    answers,
    chapter,
    title,
    updatedAt,
    views,
    message,
    href,
  }: DashboardItemProps) => {
    const hasMessage = !!message && !!messageId;
    return (
      <li
        className={cn(
          'flex flex-col gap-7.5',
          'max-sm:not-last:border-b-gray-9e/10 max-sm:not-last:border-b max-sm:not-last:pb-7.5',
          'sm:flex-row sm:items-center sm:justify-between',
        )}
      >
        <div className='relative flex flex-col gap-y-2.5'>
          <h4 className='2xl:text-lg'>
            <Link href={href} className='hover:underline'>
              {hasMessage && 'Trad:'} {title}
            </Link>
          </h4>
          {hasMessage && (
            <p className='max-lg:hidden'>
              <Link
                href={`${AppRouter.post.getRoute(id)}?message=${messageId}`}
              >
                Message: {message}
              </Link>
            </p>
          )}
          <Tag className='max-2xl:text-sm'>{chapter}</Tag>
        </div>
        <div
          className={cn(
            'grid max-w-94 grid-cols-3 items-center justify-items-center gap-x-5 justify-self-end',
            'max-sm:max-w-full',
            '**:[p,time]:text-gray-9e text-center **:[p,time]:font-normal **:[span]:font-bold',
            '2xl:**:[span]:text-lg',
            'max-2xl:**:[p,time]:text-sm',
          )}
        >
          <div className='flex flex-col'>
            <span>{formatInt(answers)}</span>
            <p>ответов</p>
          </div>
          <div className='flex flex-col'>
            <span>{formatInt(views)}</span>
            <p>просмотров</p>
          </div>
          <time dateTime={updatedAt}>
            Обновлён {formatTimeAgo(updatedAt, { short: true })}
          </time>
        </div>
      </li>
    );
  },
);

DashboardItem.displayName = 'DashboardItem';
