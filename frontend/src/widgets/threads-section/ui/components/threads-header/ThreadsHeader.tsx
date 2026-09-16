'use client';

import { LuChevronDown } from 'react-icons/lu';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { filterTags } from '../../../model/data/tags-data';

import { AppRouter } from '@/shared/config/app-router';
import { Button } from '@/shared/ui';

const CHAPTER_QUERY_KEY = 'chapter';

export function ThreadsHeader() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const currentCategory = searchParams.get(CHAPTER_QUERY_KEY) || 'all';

  const handleFilterChange = (id: string) => {
    const params = new URLSearchParams(searchParams.toString());
    switch (id) {
      case currentCategory:
        return;
      case 'all':
        params.delete(CHAPTER_QUERY_KEY);
        break;
      default:
        params.set(CHAPTER_QUERY_KEY, id);
    }
    router.replace(`${pathname}?${params.toString()}`);
  };
  return (
    <header className='grid gap-y-5 md:gap-y-7.5'>
      <div className='flex flex-col justify-between gap-y-3 xl:flex-row xl:items-center xl:gap-y-0'>
        <div className='grid max-w-130.5 gap-y-2 md:gap-y-3.25'>
          <h1 className='text-4xl md:text-5xl'>Все треды</h1>
          <p className='text-gray-9e text-sm md:text-base'>
            Читайте обсуждения, делитесь опытом и находите ответы на
            интересующие вас вопросы.
          </p>
        </div>
        <Button
          size='lg'
          color='purple'
          href={AppRouter.threads.new}
          className='w-full max-w-120 whitespace-nowrap xl:w-fit'
        >
          Создать новый тред
        </Button>
      </div>
      <ul className='flex flex-wrap gap-4.25'>
        {filterTags.map(({ icon, label, id }, index) => {
          const Icon = icon;
          const tagActive = currentCategory === id;
          return (
            <li key={label + index}>
              <Button
                size='min-sm'
                className='flex items-center gap-x-2.5 whitespace-nowrap'
                color={tagActive ? 'purple' : 'bordered'}
                onClick={() => handleFilterChange(id)}
              >
                <Icon size={20} aria-hidden className='min-w-5' />
                <span>{label}</span>
              </Button>
            </li>
          );
        })}
        <li>
          <Button size='min-sm' color='bordered' className='flex gap-x-1.25'>
            <span>Ещё</span>
            <LuChevronDown size={20} aria-hidden className='min-w-5' />
          </Button>
        </li>
      </ul>
    </header>
  );
}
