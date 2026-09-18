import Image from 'next/image';
import Link from 'next/link';

import { ProfileHeroHeader } from './ProfileHeroHeader';

import { User } from '@/entities/user';

import { AppRouter } from '@/shared/config/app-router';
import { isApiUrl } from '@/shared/guards/isApiUrl.guard';
import { ProfileAvatar } from '@/shared/ui';

export function ProfileHero(props: { user: User }) {
  const {
    avatarUrl,
    createdAt,
    description,
    name,
    profileBanerUrl,
    role,
    userTag,
  } = props.user;

  const banerUrl = isApiUrl(profileBanerUrl)
    ? profileBanerUrl
    : '/profile-baner.jpg';

  return (
    <section>
      <div className='relative flex items-center justify-center overflow-hidden rounded-[1.25rem] lg:h-105 lg:p-5 xl:justify-start xl:px-10 2xl:h-112.5 2xl:px-16.25'>
        <Image
          src={banerUrl}
          alt=''
          aria-hidden
          priority
          fetchPriority='high'
          fill
          sizes='auto'
          className='absolute -z-1 object-cover max-lg:hidden'
        />

        <div className='lg:bg-dark-0e/70 flex w-full flex-col items-center gap-y-2.5 rounded-[1.25rem] lg:w-fit lg:flex-row lg:gap-0 xl:gap-x-5'>
          <div className='flex w-full flex-col items-center lg:hidden'>
            <div className='relative h-40 w-full overflow-hidden rounded-t-[1.25rem] sm:h-60 md:h-70'>
              <Image
                src={banerUrl}
                alt=''
                aria-hidden
                priority
                fetchPriority='high'
                fill
                sizes='auto'
                className='object-cover'
              />
            </div>

            <div className='relative z-10 -mt-20 size-30 sm:-mt-25 sm:size-37.5 md:-mt-35 md:size-50'>
              <ProfileAvatar
                authorName={name}
                avatarUrl={avatarUrl}
                fill
                sizes='200px'
                className='border-dark-0e bg-dark-0e border-3 object-contain'
              />
            </div>
          </div>

          <ProfileAvatar
            authorName={name}
            avatarUrl={avatarUrl}
            width={250}
            height={250}
            className='hidden lg:block lg:object-contain lg:pl-6.25'
          />

          <div className='flex flex-col gap-y-3.75 px-5 max-lg:items-center md:gap-y-7.5 lg:pt-2.5 lg:pb-5'>
            <ProfileHeroHeader
              createdAt={createdAt}
              name={name}
              role={role}
              userTag={userTag}
            />

            <p className='max-lg:text-gray-9e font-bold max-lg:text-center max-sm:text-sm md:max-w-115 xl:max-w-125'>
              {description}
            </p>

            <div className='flex flex-col gap-y-2 *:w-full max-lg:justify-center sm:flex-row sm:gap-x-2.5 sm:*:w-fit'>
              <Link
                href={AppRouter.profile.settings}
                className='border-purple-86 hover:text-purple-86 hover:border-purple-86/50 rounded-[0.3125rem] border-2 px-4 py-3.25 text-center duration-200'
              >
                Настройки
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
