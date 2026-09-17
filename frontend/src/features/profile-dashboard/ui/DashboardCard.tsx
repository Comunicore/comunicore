import Link from 'next/link';

import { DashboardItemTypes } from '../model/dashboard-item.types';

import { DashboardItem } from './DashboardItem';

import { Tile } from '@/shared/ui';

interface DashboardCardProps {
  href: string;
  title: string;
  items: DashboardItemTypes[];
}
export function DashboardCard(props: DashboardCardProps) {
  const { href, title, items } = props;
  return (
    <Tile size='lg' className='flex flex-col gap-y-7.5'>
      <div className='flex flex-wrap justify-between gap-x-10'>
        <h3 className='text-lg font-bold'>{title}</h3>
        <Link href={href} className='text-purple-86 text-lg'>
          Смотреть все
        </Link>
      </div>
      <ul className='flex flex-col gap-y-7.5'>
        {items.map((item) => {
          const itemHref = `${href}/${item.id}`;
          return <DashboardItem key={item.id} {...item} href={itemHref} />;
        })}
      </ul>
    </Tile>
  );
}
