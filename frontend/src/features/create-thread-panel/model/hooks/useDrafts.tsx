'use client';

import { useCallback, useEffect, useRef } from 'react';
import { UseFormReturn } from 'react-hook-form';

import { CreateThreadTypes } from '../schemas/create-thread.schema';

const DRAFT_KEY = 'communicore_thread_draft';
const DEBOUNCE_DELAY = 800;

export const useDrafts = (
  methods: UseFormReturn<CreateThreadTypes>,
  isActive: boolean = true,
) => {
  const { getValues, reset, watch } = methods;
  const isAutoSaveActive = useRef(isActive);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const clearAutoSaveTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const hasFormContent = (values: Partial<CreateThreadTypes>) =>
    Object.values(values).some((val) => Boolean(val));

  const saveDraft = useCallback(() => {
    if (!isAutoSaveActive.current || typeof window === 'undefined') return;

    const values = getValues();
    if (hasFormContent(values)) {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(values));
    }
  }, [getValues]);

  useEffect(() => {
    const subscription = watch(() => {
      clearAutoSaveTimer();

      timerRef.current = setTimeout(() => {
        saveDraft();
      }, DEBOUNCE_DELAY);
    });

    return () => {
      subscription.unsubscribe();
      clearAutoSaveTimer();
    };
  }, [watch, saveDraft, clearAutoSaveTimer]);

  const loadDraft = useCallback(() => {
    if (typeof window === 'undefined') return;

    const draft = localStorage.getItem(DRAFT_KEY);
    if (draft) {
      try {
        const parsedDraft = JSON.parse(draft) as CreateThreadTypes;
        reset(parsedDraft);
      } catch (e) {
        console.error('Ошибка парсинга черновика:', e);
        localStorage.removeItem(DRAFT_KEY);
      }
    }
  }, [reset]);

  const deleteDraft = useCallback(() => {
    if (typeof window === 'undefined') return;

    isAutoSaveActive.current = false;
    localStorage.removeItem(DRAFT_KEY);
  }, []);

  return {
    saveDraft,
    deleteDraft,
    loadDraft,
  };
};
