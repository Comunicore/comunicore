import { BsGrid3X2GapFill } from 'react-icons/bs';
import { LuCodeXml, LuCpu, LuPalette, LuRocket } from 'react-icons/lu';

export const filterTags = [
  {
    id: 'all',
    icon: BsGrid3X2GapFill,
    label: 'Все разделы',
  },
  {
    id: 'programming',
    icon: LuCodeXml,
    label: 'Программирование',
  },
  {
    id: 'tech',
    icon: LuCpu,
    label: 'Технологии',
  },
  {
    id: 'design',
    icon: LuPalette,
    label: 'Дизайн',
  },
  {
    id: 'productivity',
    icon: LuRocket,
    label: 'Продуктивность',
  },
] as const;
