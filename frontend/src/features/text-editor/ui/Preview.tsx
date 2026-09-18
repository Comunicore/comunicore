'use client';

import { MouseEvent, useMemo } from 'react';

import { renderHtml } from '@/shared/lib/markdown';

import styles from './preview.module.css';

export function Preview({ markdown }: { markdown: string }) {
  const html = useMemo(() => renderHtml(markdown), [markdown]);

  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    const link = (e.target as HTMLElement).closest('a');

    if (link) {
      const url = link.getAttribute('href'); // Берем атрибут у самой ссылки

      // Проверка на якоря (внутренние ссылки #header не должны вызывать конфирм)
      if (!url || url.startsWith('#')) return;

      const confirmLeave = window.confirm(
        `Вы переходите на внешний сайт:\n${url}\nПродолжить?`,
      );

      if (!confirmLeave) {
        e.preventDefault();
      }
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`wrap-break-word ${styles['preview-content']}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
