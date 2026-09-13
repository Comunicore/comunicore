import { User } from '../../model/types/user.types';

import { cn } from '@/shared/lib/classNames';
import {
  DATE_FALLBACK,
  safeFormatDate,
} from '@/shared/lib/helpers/safeFormatDate';
import { Tile } from '@/shared/ui';

type ProfileUserInfoProps = Pick<
  User,
  'role' | 'createdAt' | 'lastActivity' | 'webSite' | 'location'
>;

export function ProfileUserInfo({
  createdAt,
  lastActivity,
  role,
  location,
  webSite,
}: ProfileUserInfoProps) {
  const locationExist = !!(location?.city && location.country);
  return (
    <Tile
      className={cn(
        'flex flex-col gap-y-7.5',
        // children styles
        '**:[h4]:text-gray-9e',
        '**:[p,a,time]:font-bold',
        '*:[div]:flex *:[div]:flex-col *:[div]:gap-y-2.5',
      )}
    >
      <h3 className='text-lg font-bold'>Инфо</h3>

      {role && (
        <div>
          <h4>Роль</h4>
          <p>{role}</p>
        </div>
      )}

      <div>
        <h4>На форуме с </h4>
        {createdAt ? (
          <time dateTime={createdAt}>{safeFormatDate(createdAt)}</time>
        ) : (
          <p>{DATE_FALLBACK}</p>
        )}
      </div>

      <div>
        <h4>Последняя активность</h4>
        {lastActivity ? (
          <time dateTime={lastActivity}>{safeFormatDate(lastActivity)}</time>
        ) : (
          <p>{DATE_FALLBACK}</p>
        )}
      </div>

      {webSite && (
        <div>
          <h4>Веб сайт</h4>
          <a
            href={webSite}
            target='_blank'
            rel='noreferrer noopener'
            className='hover:underline'
          >
            {webSite}
          </a>
        </div>
      )}

      {locationExist && (
        <div>
          <h4>Локация</h4>
          <p className='capitalize'>{`${location.city}, ${location.country}`}</p>
        </div>
      )}
    </Tile>
  );
}
