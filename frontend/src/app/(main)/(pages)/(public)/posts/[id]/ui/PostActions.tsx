import { ComponentType, SVGProps } from 'react';

import { formatInt } from '@/shared/lib/helpers/formatInt';
import { BookmarkIcon, LikeIcon, ReportIcon, ShareIcon } from '@/shared/ui';

interface PostActionsProps {
  likesCount: number;
}

interface PostAction {
  id: string;
  label: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  ariaLabel?: string;
}

// TODO: вынести кнопки в features, когда появится API
export default function PostActions({ likesCount }: PostActionsProps) {
  const actions: PostAction[] = [
    {
      id: 'like',
      label: formatInt(likesCount),
      ariaLabel: `Нравится: ${likesCount}`,
      Icon: LikeIcon,
    },
    { id: 'save', label: 'Сохранить', Icon: BookmarkIcon },
    { id: 'share', label: 'Поделиться', Icon: ShareIcon },
    { id: 'report', label: 'Пожаловаться', Icon: ReportIcon },
  ];

  return (
    <ul className='flex flex-wrap items-end gap-2.5 sm:gap-5'>
      {actions.map(({ id, label, ariaLabel, Icon }) => (
        <li key={id}>
          <button
            type='button'
            aria-label={ariaLabel}
            className='bg-light/5 text-gray-9e hover:text-light flex items-center gap-x-1.25 rounded-[0.625rem] px-2.5 py-1.25 text-lg leading-normal transition-colors'
          >
            <Icon className='shrink-0' />
            {label}
          </button>
        </li>
      ))}
    </ul>
  );
}
