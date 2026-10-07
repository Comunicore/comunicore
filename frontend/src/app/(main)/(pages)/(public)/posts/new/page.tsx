'use client';

import { Suspense } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod/dist/zod.js';

import Header from './ui/Header';
import Hints from './ui/Hints';

import { EditorFormTracker } from '@/widgets/editor-form-tracker';

import {
  CreatePostPanel,
  createPostSchema,
  CreatePostTypes,
} from '@/features/create-post-panel';

import { cn } from '@/shared/lib/classNames';
import { Container } from '@/shared/ui';

const EDITOR_MODE_PARAM = 'editor-mode';
const PREVIEW_MODE = 'preview';

const defaultValues = {
  category: {
    id: '',
    name: '',
  },
  description: '',
  fileUrl: undefined,
  tags: undefined,
  title: '',
  type: 'discussion',
} satisfies CreatePostTypes;

export default function NewPostPage() {
  const methods = useForm<CreatePostTypes>({
    resolver: zodResolver(createPostSchema),
    defaultValues,
    mode: 'onChange',
  });
  return (
    <FormProvider {...methods}>
      <Suspense fallback={<div>Loading...</div>}>
        <Container>
          <section
            className={cn(
              'relative grid gap-y-5 pt-15 pb-5',
              'sm:gap-y-10 sm:pt-21 sm:pb-10',
              '2xl:grid-cols-[1fr_23.125rem] 2xl:gap-x-12.5',
            )}
          >
            <Header className='2xl:col-span-2' />
            <EditorFormTracker
              className='order-3 md:hidden'
              editorModeParam={EDITOR_MODE_PARAM}
              previewMode={PREVIEW_MODE}
            />
            <CreatePostPanel
              editorModeParam={EDITOR_MODE_PARAM}
              previewMode={PREVIEW_MODE}
              formDefaultValues={defaultValues}
            />
            <Hints
              editorModeParam={EDITOR_MODE_PARAM}
              previewMode={PREVIEW_MODE}
            />
          </section>
        </Container>
      </Suspense>
    </FormProvider>
  );
}
