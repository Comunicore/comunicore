import { usePathname, useSearchParams } from 'next/navigation';

/**
 * Возвращает функцию, которая меняет query-параметры в URL БЕЗ запроса на сервер
 * (через `window.history.pushState`). Next.js 14.1+ синхронизирует это с
 * `useSearchParams()`, поэтому компоненты, читающие параметры, перерисуются,
 * а данные подтянет React Query на клиенте.
 *
 * Использовать для фильтров, сортировки, тегов, пагинации и поиска:
 * там, где данные грузятся на клиенте и серверу перерисовываться не нужно.
 *
 * НЕ использовать:
 * - для перехода на другую страницу: для этого `Link` или `router.push`;
 * - если от параметров зависит серверный рендер (`generateMetadata`,
 *   серверные редиректы, серверные компоненты, читающие `searchParams`):
 *   они не обновятся до перезагрузки, тут нужен `router.push`;
 * - в серверных компонентах (хук работает только на клиенте).
 *
 * Значение `null` удаляет параметр из URL.
 * При смене фильтров не забывай сбрасывать страницу: `{ page: null }`.
 *
 * @example
 * const setParams = useSetDynamicParams();
 * setParams({ tag: 'react', page: null });
 */
export function useSetDynamicParams() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null) params.delete(key);
      else params.set(key, value);
    });
    const qs = params.toString();
    window.history.pushState(null, '', qs ? `${pathname}?${qs}` : pathname);
  };
}
