type RawSearchParams = Record<string, string | string[] | undefined>;

/**
 * Преобразует объект `searchParams`, который Next.js передаёт в серверные
 * компоненты (`page.tsx`, `layout.tsx`), в `URLSearchParams`.
 *
 * Использовать ТОЛЬКО на сервере, когда нужно прогнать `searchParams` из пропсов
 * страницы через функцию, которая принимает `URLSearchParams`
 * (например, `parsePostsParams`).
 *
 * НЕ использовать:
 * - в клиентских компонентах: там уже есть `useSearchParams()`,
 *   он возвращает `URLSearchParams`;
 * - для изменения URL: для этого есть `useUpdateSearchParams`;
 * - если `searchParams` не нужно разбирать на сервере.
 *
 * @example
 * // app/posts/page.tsx (серверный компонент)
 * const sp = await searchParams;
 * const query = parsePostsParams(parseToSearchParams(sp));
 */
export const parseToSearchParams = (raw: RawSearchParams): URLSearchParams => {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(raw)) {
    if (Array.isArray(value)) {
      value.forEach((values) => params.append(key, values));
    } else if (value !== undefined) {
      params.set(key, value);
    }
  }

  return params;
};
