import {
  LuBot,
  LuCode,
  LuCpu,
  LuMessageSquare,
  LuPalette,
  LuShield,
} from 'react-icons/lu';
// data from server

export const mockChapters = [
  {
    id: 'programming',
    label: 'Программирование',
    icon: LuCode,
  },
  {
    id: 'design',
    label: 'Дизайн',
    icon: LuPalette,
  },
  {
    id: 'hardware',
    label: 'Железо и ПК',
    icon: LuCpu,
  },
  {
    id: 'ai-dev',
    label: 'Искусственный интеллект',
    icon: LuBot,
  },
  {
    id: 'cybersecurity',
    label: 'Безопасность',
    icon: LuShield,
  },
  {
    id: 'offtopic',
    label: 'Флудилка / Общение',
    icon: LuMessageSquare,
  },
];
