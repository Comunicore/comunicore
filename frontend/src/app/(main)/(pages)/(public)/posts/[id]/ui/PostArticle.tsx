import Link from 'next/link';

import { PostDetailsData } from '../model/post-details.types';

import { PostContent } from '@/entities/post';
import { RoleBadge, UserAvatar } from '@/entities/user';

import { AppRouter } from '@/shared/config/app-router';

type PostArticleProps = Pick<
  PostDetailsData,
  'title' | 'content' | 'category' | 'author'
>;

export default function PostArticle({
  title,
  content,
  category,
  author,
}: PostArticleProps) {
  return (
    <article className='flex flex-col gap-y-3'>
      <p className='font-(family-name:--font-inter) text-lg font-bold sm:text-xl'>
        Пост из категории: {category.name}
      </p>

      <div className='flex flex-col gap-y-5'>
        <h1 className='text-2xl leading-normal font-bold sm:text-4xl'>
          {title}
        </h1>

        <PostContent
          content={content}
          header={
            <div className='flex items-center gap-x-3'>
              <UserAvatar user={author} size='lg' />
              <div className='flex min-w-0 flex-col gap-y-2.5'>
                <div className='flex flex-wrap items-start gap-1.5'>
                  <Link
                    href={AppRouter.user.getRoute(author.id)}
                    className='hover:text-purple-86 text-2xl leading-normal font-semibold'
                  >
                    {author.name}
                  </Link>
                  <RoleBadge role={author.role} />
                </div>
                <p className='leading-normal'>ранг: {author.title}</p>
              </div>
            </div>
          }
        />
      </div>
    </article>
  );
}
