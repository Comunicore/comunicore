'use client';

import { useState } from 'react';
import { useWatch } from 'react-hook-form';
import { LuCircleCheck, LuCircleX } from 'react-icons/lu';
import { useSearchParams } from 'next/navigation';

import { CreateThreadTypes } from '@/features/create-thread-panel';

import { Tile } from '@/shared/ui/Tile';

interface EditorFormTrackerProps {
  editorModeParam: string;
  previewMode: string;
}

export function EditorFormTracker({
  editorModeParam,
  previewMode,
}: EditorFormTrackerProps) {
  const searchParams = useSearchParams();
  const formValues = useWatch<CreateThreadTypes>();
  const [hasPreviewed, setHasPreviewed] = useState(false);

  const isPreviewMode = searchParams.get(editorModeParam) === previewMode;

  if (isPreviewMode && !hasPreviewed) {
    setHasPreviewed(true);
  }

  const isValidText = (text?: string, minLength: number = 5): boolean => {
    if (!text) return false;

    const trimmed = text.trim();
    const hasTooManySpaces = /\s{3,}/.test(text);

    return trimmed.length >= minLength && !hasTooManySpaces;
  };

  const rules = [
    {
      id: 'title',
      label: 'Придумайте понятный заголовок',
      isCompleted: isValidText(formValues.title, 5),
    },
    {
      id: 'chapter',
      label: 'Выберите правильный раздел',
      isCompleted: Boolean(formValues.chapter?.id),
    },
    {
      id: 'description',
      label: 'Опишите тему подробно',
      isCompleted: isValidText(formValues.description, 30),
    },
    {
      id: 'tags',
      label: 'Используйте теги',
      isCompleted: Boolean(formValues.tags && formValues.tags.length > 0),
    },
    {
      id: 'preview',
      label: 'Проверьте текст перед публикацией',
      isCompleted: hasPreviewed,
    },
  ];

  return (
    <Tile size='sm' className='grid gap-y-5'>
      <h2>Советы по оформлению</h2>
      <ul className='flex flex-col gap-y-3.75'>
        {rules.map((rule) => (
          <li key={rule.id} className='flex items-center gap-x-2.5'>
            {rule.isCompleted ? (
              <LuCircleCheck
                role='log'
                aria-label='Completed'
                size={21}
                className='text-green-00 min-h-5 min-w-5'
              />
            ) : (
              <LuCircleX
                role='log'
                aria-label='Incomplete'
                size={21}
                className='text-red-ff min-h-5 min-w-5'
              />
            )}
            <p className='text-gray-9e text-base leading-4 whitespace-nowrap'>
              {rule.label}
            </p>
          </li>
        ))}
      </ul>
    </Tile>
  );
}
