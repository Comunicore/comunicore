import Image from 'next/image';
import Link from 'next/link';

import { UserAchievement } from '../model/user.types';

import { AppRouter } from '@/shared/config/app-router';
import { isApiUrl } from '@/shared/guards/isApiUrl.guard';
import { cn } from '@/shared/lib/classNames';
import { Tile } from '@/shared/ui';

export function ProfileAchivements(props: { achievements: UserAchievement[] }) {
  const { achievements } = props;
  const validAchievements = achievements.filter((achiv) =>
    isApiUrl(achiv.imageUrl),
  );

  if (validAchievements.length === 0) return null;

  return (
    <Tile className='flex flex-col gap-y-7.5'>
      <h3 className='text-lg font-bold'>
        <Link href={AppRouter.achivements.root}>Достижения</Link>
      </h3>
      <ul className={cn('flex flex-wrap gap-x-7.5 gap-y-4')}>
        {validAchievements.map(({ imageUrl, name, id }) => (
          <li key={id}>
            <Link href={AppRouter.achivements.getRoute(id)}>
              <Image
                src={imageUrl}
                alt={name}
                width={100}
                height={100}
                priority={false}
              />
            </Link>
          </li>
        ))}
      </ul>
    </Tile>
  );
}
