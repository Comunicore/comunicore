import Link from 'next/link';

import { PostDetailsData } from '../model/post-details.types';

import { RankBadge } from './RankBadge';
import { UserAvatar } from './UserAvatar';

import { AppRouter } from '@/shared/config/app-router';
import { cn } from '@/shared/lib/classNames';

type PostArticleProps = Pick<
  PostDetailsData,
  'title' | 'content' | 'thread' | 'author'
>;

export function PostArticle({
  title,
  content,
  thread,
  author,
}: PostArticleProps) {
  return (
    <article className='flex flex-col gap-y-3'>
      <p className='font-(family-name:--font-inter) text-lg font-bold sm:text-xl'>
        Пост из треда:{' '}
        <Link
          href={AppRouter.posts.getRoute(thread.id)}
          className='hover:text-purple-86'
        >
          {thread.title}
        </Link>
      </p>

      <div className='flex flex-col gap-y-5'>
        <h1 className='text-2xl leading-normal font-bold sm:text-4xl'>
          {title}
        </h1>

        <div className='bg-dark-1b flex flex-col gap-y-5 rounded-[0.625rem] p-2.5'>
          <header className='flex items-center gap-x-3'>
            <UserAvatar author={author} size='lg' />
            <div className='flex min-w-0 flex-col gap-y-2.5'>
              <div className='flex flex-wrap items-start gap-1.5'>
                <Link
                  href={AppRouter.user.getRoute(author.id)}
                  className='hover:text-purple-86 text-2xl leading-normal font-semibold'
                >
                  {author.name}
                </Link>
                <RankBadge rank={author.rank} />
              </div>
              <p className='leading-normal'>ранг: {author.title}</p>
            </div>
          </header>

          <div
            className={cn(
              'font-(family-name:--font-inter) text-base leading-normal whitespace-pre-line',
              'sm:text-xl',
            )}
          >
            {content}
          </div>
        </div>
      </div>
    </article>
  );
}
