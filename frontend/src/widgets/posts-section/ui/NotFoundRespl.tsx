import { HTMLAttributes } from 'react';
import Image from 'next/image';

import notfoundresp from '@/shared/assets/images/not-found-resp.png';
import { AppRouter } from '@/shared/config/app-router';
import { cn } from '@/shared/lib/classNames';
import { Button, Tile } from '@/shared/ui';

export function NotFoundResp(
  props: Omit<HTMLAttributes<HTMLDivElement>, 'color'>,
) {
  const { className, ...restAttrs } = props;
  return (
    <Tile
      color='bordered'
      size='compact'
      className={cn('relative flex h-100 flex-col gap-y-5', className)}
      {...restAttrs}
    >
      <Image
        src={notfoundresp}
        alt='decor'
        className='pointer-events-none absolute right-0.5 bottom-0 -z-1 opacity-50'
      />
      <h2 className='text-lg font-bold'>Не нашли ответа?</h2>
      <p className='text-gray-9e'>
        Задайте свой пвопрос сообществу прямо сейчас
      </p>
      <Button
        size='lg'
        href={AppRouter.posts.new}
        className='w-full 2xl:ml-auto 2xl:w-fit'
      >
        Создать новый пост
      </Button>
    </Tile>
  );
}
