import Link from 'next/link';
import { format } from 'date-fns';

import { PostDetailsData, RelatedPost } from '../model/post-details.types';

import { CommunityRules } from '@/widgets/community-rules';

import { UserCard } from '@/entities/user';

import { AppRouter } from '@/shared/config/app-router';
import { cn } from '@/shared/lib/classNames';
import {
  ArrowRightIcon,
  CommentsIcon,
  EyeIcon,
  Tile,
  ViewAllLink,
} from '@/shared/ui';

const cardStyles = 'flex flex-col rounded-[0.625rem] px-3.75 py-5';

const formatPostDate = (date: string) =>
  format(new Date(date), "dd.MM.yyyy 'в' HH:mm");

type PostSidebarProps = Pick<
  PostDetailsData,
  | 'author'
  | 'topic'
  | 'repliesCount'
  | 'viewsCount'
  | 'createdAt'
  | 'lastReplyAt'
> & {
  relatedPosts: RelatedPost[];
};

export default function PostSidebar({
  author,
  topic,
  repliesCount,
  viewsCount,
  createdAt,
  lastReplyAt,
  relatedPosts,
}: PostSidebarProps) {
  const postInfo = [
    {
      label: 'Создан',
      value: (
        <time dateTime={createdAt} suppressHydrationWarning>
          {formatPostDate(createdAt)}
        </time>
      ),
    },
    { label: 'Тема', value: topic },
    { label: 'Ответов', value: repliesCount },
    { label: 'Просмотров', value: viewsCount },
    {
      label: 'Последний ответ',
      value: (
        <time dateTime={lastReplyAt} suppressHydrationWarning>
          {formatPostDate(lastReplyAt)}
        </time>
      ),
    },
  ];

  return (
    <aside className='flex flex-col gap-y-2.5' aria-label='Информация о посте'>
      {/* Об авторе */}
      <Tile className={cn(cardStyles, 'gap-y-3')}>
        <h2 className='text-xl leading-normal font-medium'>Об авторе</h2>
        <UserCard user={author} />
        <Link
          href={AppRouter.user.getRoute(author.id)}
          className='border-purple-67 text-purple-67 hover:bg-purple-67 hover:text-light flex h-10.75 items-center justify-center rounded-[0.3125rem] border px-4 shadow-[inset_0_-1px_1px_rgb(67_90_111/20%)] transition-colors'
        >
          Открыть профиль
        </Link>
      </Tile>

      {/* Информация о посте */}
      <Tile className={cn(cardStyles, 'gap-y-4')}>
        <h2 className='text-xl leading-normal font-medium'>
          Информация о посте
        </h2>
        <dl className='flex flex-col gap-y-5 text-lg leading-normal'>
          {postInfo.map(({ label, value }) => (
            <div key={label} className='flex justify-between gap-x-4'>
              <dt className='text-gray-9e'>{label}</dt>
              <dd className='text-right'>{value}</dd>
            </div>
          ))}
        </dl>
      </Tile>

      {/* Другие посты из тредов */}
      <Tile className={cn(cardStyles, 'gap-y-3.75')}>
        <h2 className='text-xl leading-normal font-medium'>
          Другие посты из тредов
        </h2>
        <ul className='flex flex-col gap-y-5'>
          {relatedPosts.map(({ id, title, position, commentsCount, views }) => (
            <li
              key={id}
              className='text-gray-9e flex items-center justify-between gap-x-4'
            >
              <div className='flex max-w-70 flex-col gap-y-1.25'>
                <Link
                  href={AppRouter.posts.getRoute(id)}
                  className='hover:text-light text-lg leading-normal transition-colors'
                >
                  {title}
                </Link>
                <div className='flex items-center gap-x-2.5 text-xs leading-3'>
                  <span className='flex items-center gap-x-1.25'>
                    <CommentsIcon className='text-light shrink-0' />
                    {commentsCount}
                  </span>
                  <span className='flex items-center gap-x-1.75'>
                    <EyeIcon className='text-light/95 shrink-0' />
                    {views}
                  </span>
                </div>
              </div>
              <span className='text-lg leading-normal'>#{position}</span>
            </li>
          ))}
        </ul>
        <ViewAllLink
          href={AppRouter.posts.root}
          label='Смотреть все треды'
          className='w-fit gap-2.5 text-lg leading-6.25'
        >
          <ArrowRightIcon className='shrink-0' />
        </ViewAllLink>
      </Tile>

      <CommunityRules />
    </aside>
  );
}
