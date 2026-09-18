'use client';

import { useRef, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { MarkDownSchema, markdownSchema } from '../model/markdown.schema';
import { EditorMode } from '../model/mode.types';

import { Editor } from './Editor';
import { ModeSwitcher } from './ModeSwitcher';
import { Preview } from './Preview';
import { Toolbar } from './Toolbar';

import { cn } from '@/shared/lib/classNames';
import { Button } from '@/shared/ui';

const defaultValues = {
  markdown: '',
};

const EDITOR_MODE = {
  edit: 'hidden',
  preview: 'block',
} satisfies Record<EditorMode, string>;

export function TextEditor() {
  const [mode, setActiveMode] = useState<EditorMode>('edit');
  const form = useForm<MarkDownSchema>({
    resolver: zodResolver(markdownSchema),
    mode: 'onChange',
    defaultValues,
  });

  const {
    control,
    formState: { isValid },
    getValues,
    setValue,
  } = form;

  const markdown = useWatch({
    control: control,
    name: 'markdown',
  });

  const markdownFieldRef = useRef<HTMLTextAreaElement>(null);

  return (
    <div className='flex h-full flex-col gap-y-2'>
      <div className='flex min-h-0 flex-1 flex-col gap-y-2 overflow-y-hidden'>
        <div className='bg-blue-16 grid grid-cols-[auto_1fr] items-center rounded-md'>
          <ModeSwitcher mode={mode} setMode={setActiveMode} />
          <Toolbar
            mode={mode}
            getValues={getValues}
            setValue={setValue}
            markdownFieldRef={markdownFieldRef}
          />
        </div>
        <div className='relative flex flex-1 flex-col overflow-hidden rounded-lg bg-white'>
          <div className={cn('h-full', mode === 'edit' ? 'block' : 'hidden')}>
            <Editor form={form} markdownFieldRef={markdownFieldRef} />
          </div>
          <div
            className={cn(
              'grid h-full grid-rows-[minmax(1rem,10rem)] overflow-y-auto p-4',
              EDITOR_MODE[mode],
            )}
          >
            <Preview markdown={markdown ?? ''} />
          </div>
        </div>
      </div>
      <Button
        form='text-editor-form'
        disabled={!isValid}
        type='submit'
        className='w-full'
      >
        Apply
      </Button>
    </div>
  );
}
