import { HTMLAttributes } from 'react';
import Link from 'next/link';

import { Post } from '../model/post.types';

import { AppRouter } from '@/shared/config/app-router';
import { cn } from '@/shared/lib/classNames';
import { formatInt } from '@/shared/lib/helpers/formatInt';
import { formatTimeAgo } from '@/shared/lib/helpers/formatTimeAgo';
import { ProfileAvatar, Tag } from '@/shared/ui';

interface PostCardProps extends HTMLAttributes<HTMLElement> {
  post: Post;
}

export const PostCard = ({
  className,
  post: {
    avatarUrl,
    id,
    authorName,
    answers,
    chapter,
    title,
    views,
    createdAt,
  },
  ...restAttrs
}: PostCardProps) => (
  <article className={cn(className)} {...restAttrs}>
    <header className='flex gap-x-5 lg:items-center'>
      <ProfileAvatar
        authorName={authorName}
        avatarUrl={avatarUrl}
        width={50}
        height={50}
        className='mt-2 size-12.5 lg:mt-0'
      />
      <div className='grid gap-y-2.25'>
        <h2 className='line-clamp-2 max-w-65 text-start text-lg leading-5.5 2xl:max-w-80'>
          <Link
            href={AppRouter.post.getRoute(String(id))}
            className='focus:outline-none'
          >
            {title}
          </Link>
        </h2>
        <Tag size='lg' className='md:hidden'>
          {chapter}
        </Tag>
        <div className='text-gray-9e flex items-center gap-x-1.5'>
          <p>{authorName}</p>
          <span className='bg-gray-9e size-0.75 rounded-full' />
          <time dateTime={createdAt} suppressHydrationWarning>
            {formatTimeAgo(createdAt)}
          </time>
        </div>
        <div className='text-gray-9e flex flex-wrap gap-x-5 gap-y-1 whitespace-nowrap lg:hidden'>
          <span>{answers} ответов</span>
          <span>{formatInt(views)} просмотров</span>
        </div>
      </div>
    </header>
    <Tag
      size='lg'
      className='hidden md:inline-flex md:justify-self-center xl:px-2'
    >
      {chapter}
    </Tag>
    <span className='hidden text-lg lg:inline'>{answers}</span>
    <span className='hidden whitespace-nowrap lg:inline'>
      {formatInt(views)}
    </span>
  </article>
);
