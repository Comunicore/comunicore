'use client';

import { ProfileHero } from '@/widgets/profile-hero';
import { ProfileChapterList, ProfileSidebar } from '@/widgets/profile-sidebar';
import { ProfileStats } from '@/widgets/profile-stats';

import { ProfileDashboard } from '@/features/profile-dashboard';

import { useUser } from '@/entities/user';

import { cn } from '@/shared/lib/classNames';
import { getErrorMessage } from '@/shared/lib/helpers/getErrorMessage';
import { Container } from '@/shared/ui';

export default function Profile() {
  const { user, error } = useUser();

  if (error) {
    return (
      <Container className='flex items-center justify-center py-24'>
        <div>{getErrorMessage(error)}</div>
      </Container>
    );
  }

  const userData = user?.user;

  if (!userData) {
    return null;
  }

  return (
    <Container className='flex flex-col gap-y-12.5 py-12.5'>
      <ProfileHero user={userData} />
      <ProfileStats
        bookMarks={userData.bookMarks}
        likes={userData.likes}
        rank={userData.rank}
        postsQuantity={userData.postsQuantity}
        recivedLikes={userData.recivedLikes}
      />
      <section
        className={cn(
          'grid grid-cols-1 grid-rows-[auto_1fr_auto] gap-y-5',
          'xl:grid-cols-[auto_1fr] xl:gap-x-2.5',
        )}
      >
        <ProfileSidebar user={userData} />
        <ProfileChapterList className='xl:hidden' />

        <ProfileDashboard userId={userData.id} />
      </section>
    </Container>
  );
}
