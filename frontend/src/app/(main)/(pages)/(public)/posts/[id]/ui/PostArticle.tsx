import Link from 'next/link';

import { PostDetailsData } from '../model/post-details.types';

import { PostContent } from '@/entities/post';

import { AppRouter } from '@/shared/config/app-router';
import { Tile } from '@/shared/ui';

type PostArticleProps = Pick<PostDetailsData, 'title' | 'content' | 'category'>;

export default function PostArticle({
  title,
  content,
  category,
}: PostArticleProps) {
  return (
    <article className='flex flex-col gap-y-3'>
      <p className='font-(family-name:--font-inter) text-lg font-bold sm:text-xl'>
        Пост из категории:{' '}
        <Link
          href={AppRouter.posts.root}
          className='text-pink-86 hover:underline'
        >
          {category.name}
        </Link>
      </p>

      <div className='flex flex-col gap-y-5'>
        <h1 className='text-2xl leading-normal font-bold sm:text-4xl'>
          {title}
        </h1>

        <Tile color='solid' radius='md' size='xs'>
          <PostContent content={content} />
        </Tile>
      </div>
    </article>
  );
}
