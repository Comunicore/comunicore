import { ProfileChapterList } from './ProfileChapterList';

import {
  ProfileAchivements,
  ProfileUserInfo,
  type User,
} from '@/entities/user';

import { cn } from '@/shared/lib/classNames';

export function ProfileSidebar(props: { user: User }) {
  const { createdAt, lastActivity, role, location, webSite, achievements } =
    props.user;
  return (
    <div
      className={cn(
        'flex flex-col gap-2.5 *:w-full',
        'sm:flex-row',
        'max-xl:order-2',
        'xl:max-w-100 xl:flex-col xl:gap-3.75',
        '2xl:max-w-136',
      )}
    >
      <ProfileChapterList className='hidden xl:block' />
      <ProfileUserInfo
        role={role}
        createdAt={createdAt}
        lastActivity={lastActivity}
        webSite={webSite}
        location={location}
      />
      <ProfileAchivements achievements={achievements} />
    </div>
  );
}
