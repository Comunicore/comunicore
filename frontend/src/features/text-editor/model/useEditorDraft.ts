'use client';

import { useCallback, useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';

import { MarkDownSchema } from './markdown.schema';

const draftInterval = 10000; // 10 sek
const STORAGE_KEY = 'Md-draft';

export const useEditorDraft = (form: UseFormReturn<MarkDownSchema>) => {
  const { getValues, setValue } = form;

  useEffect(() => {
    const md = localStorage.getItem(STORAGE_KEY);
    if (md) setValue('markdown', md);

    let lastValue = md || '';

    const storageInterval = setInterval(() => {
      const currentValue = getValues('markdown');
      if (currentValue !== lastValue) {
        localStorage.setItem(STORAGE_KEY, currentValue);
        lastValue = currentValue;
      }
    }, draftInterval);

    return () => clearInterval(storageInterval);
  }, [getValues, setValue]);

  const clearDraft = useCallback(
    () => localStorage.removeItem(STORAGE_KEY),
    [],
  );

  return { clearDraft };
};
