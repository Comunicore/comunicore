import type { Metadata } from 'next';

import { NotFoundSection } from '@/widgets/not-found-section';

/**
 * 404 внутри (main)/layout для клиентских переходов на несуществующие пути.
 *
 * Корневой not-found.tsx живёт вне (main)/layout, а неизвестный маршрут
 * отвечает 404 — и на него роутер Next реагирует полной перезагрузкой
 * страницы: хедер монтируется заново и моргает. Catch-all отвечает
 * обычной страницей, поэтому переход остаётся клиентским, а layout
 * с хедером не перемонтируется.
 *
 * В статическом экспорте собирается одна заглушка /_/ (как /posts/_/),
 * её index.txt nginx отдаёт на RSC-запросы к несуществующим путям.
 * Прямой заход на такой путь по-прежнему получает 404.html со статусом 404.
 */
const NOT_FOUND_PLACEHOLDER = '_';

export const metadata: Metadata = {
  robots: { index: false },
};

export function generateStaticParams() {
  return [{ slug: [NOT_FOUND_PLACEHOLDER] }];
}

export default function CatchAllNotFoundPage() {
  return <NotFoundSection />;
}
