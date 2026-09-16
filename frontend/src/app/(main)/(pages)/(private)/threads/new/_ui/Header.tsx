import { HTMLAttributes } from 'react';
import { BsArrowLeft } from 'react-icons/bs';
import Link from 'next/link';

import { AppRouter } from '@/shared/config/app-router';

export default function Header(props: HTMLAttributes<HTMLHeadElement>) {
  return (
    <header {...props}>
      <Link
        href={AppRouter.threads.root}
        className='text-purple-86 flex w-full items-center gap-x-2.5 py-5 text-lg font-bold'
      >
        <span>
          <BsArrowLeft size={24} aria-hidden />
        </span>
        Перейти на форум
      </Link>
      <div className='flex flex-col gap-y-2.5'>
        <h1 className='text-5xl'>Создать новый тред</h1>
        <p className='text-gray-9e'>
          Поделитесь своей идеей, задайте вопрос или начните обсуждение.
        </p>
      </div>
    </header>
  );
}
