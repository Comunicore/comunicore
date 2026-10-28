'use client';

import { usePathname, useSearchParams } from 'next/navigation';

type Value = string | number | boolean | string[] | null | undefined;

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
 * Правила значений:
 * - `null`, `undefined`, `''`, `false` и пустой массив удаляют параметр из URL;
 * - числа и `true` записываются как строки (`page: 2` -> `?page=2`);
 * - массив записывается одной строкой через запятую (`['a', 'b']` -> `a,b`).
 *
 * Параметры, которые не переданы в `updates`, остаются как были.
 * При смене фильтров сбрасывай страницу: `{ page: undefined }`.
 *
 * @example
 * const setParams = useUpdateSearchParams();
 * setParams({ tag: 'react', page: undefined });
 */
export function useUpdateSearchParams() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (updates: Record<string, Value>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      const empty =
        value == null ||
        value === '' ||
        value === false ||
        (Array.isArray(value) && !value.length);
      if (empty) params.delete(key);
      else params.set(key, String(value));
    });

    const qs = params.toString();
    window.history.pushState(null, '', qs ? `${pathname}?${qs}` : pathname);
  };
}
