'use client';

import { useCallback, useEffect, useRef } from 'react';
import { UseFormReturn } from 'react-hook-form';

import { CreateThreadTypes } from '../schemas/create-thread.schema';

const SAVE_INTERVAL = 1000 * 10; // 10 seconds
const DRAFT_KEY = 'communicore_thread_draft';

export const useDrafts = (
  methods: UseFormReturn<CreateThreadTypes>,
  isActive: boolean = true,
) => {
  const {
    getValues,
    reset,
    formState: { isDirty },
  } = methods;
  const isAutoSaveActive = useRef(isActive);

  const saveDraft = useCallback(() => {
    if (!isAutoSaveActive.current || !isDirty || typeof window === 'undefined')
      return;
    const values = getValues();
    const hasContent = Object.values(values).some((val) => Boolean(val));
    if (hasContent) {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(values));
    }
  }, [getValues, isDirty]);

  useEffect(() => {
    const interval = setInterval(() => {
      saveDraft();
    }, SAVE_INTERVAL);

    return () => clearInterval(interval);
  }, [saveDraft]);

  const loadDraft = useCallback(() => {
    if (typeof window === 'undefined') return;

    const draft = localStorage.getItem(DRAFT_KEY);
    if (draft) {
      try {
        const parsedDraft = JSON.parse(draft) as CreateThreadTypes;
        reset(parsedDraft);
      } catch (e) {
        console.error('Ошибка парсинга черновика:', e);
      }
    }
  }, [reset]);

  const deleteDraft = useCallback(() => {
    if (typeof window === 'undefined') return;

    isAutoSaveActive.current = false;
    localStorage.removeItem(DRAFT_KEY);
  }, []);

  return {
    deleteDraft,
    loadDraft,
  };
};
