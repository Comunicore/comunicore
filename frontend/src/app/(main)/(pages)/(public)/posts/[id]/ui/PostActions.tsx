import { IconType } from 'react-icons';
import {
  LuBookmark,
  LuOctagonAlert,
  LuShare2,
  LuThumbsUp,
} from 'react-icons/lu';

import { formatInt } from '@/shared/lib/helpers/formatInt';

interface PostActionsProps {
  likesCount: number;
}

interface PostAction {
  id: string;
  label: string;
  Icon: IconType;
  ariaLabel?: string;
}

// TODO: вынести кнопки в features, когда появится API
export default function PostActions({ likesCount }: PostActionsProps) {
  const actions: PostAction[] = [
    {
      id: 'like',
      label: formatInt(likesCount),
      ariaLabel: `Нравится: ${likesCount}`,
      Icon: LuThumbsUp,
    },
    { id: 'save', label: 'Сохранить', Icon: LuBookmark },
    { id: 'share', label: 'Поделиться', Icon: LuShare2 },
    { id: 'report', label: 'Пожаловаться', Icon: LuOctagonAlert },
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
            <Icon size={24} className='shrink-0' aria-hidden='true' />
            {label}
          </button>
        </li>
      ))}
    </ul>
  );
}
