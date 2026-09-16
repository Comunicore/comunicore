'use client';

import { Suspense } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod/dist/zod.js';

import Header from './_ui/Header';
import Hints from './_ui/Hints';

import {
  CreateThreadPanel,
  createThreadSchema,
  CreateThreadTypes,
} from '@/features/create-thread-panel';

import { Container } from '@/shared/ui';

const EDITOR_MODE_PARAM = 'editor-mode';
const PREVIEW_MODE = 'preview';

const defaultValues = {
  chapter: {
    id: '',
    name: '',
  },
  description: '',
  fileUrl: undefined,
  tags: undefined,
  title: '',
  type: 'discussion',
} satisfies CreateThreadTypes;

export default function NewThreadPage() {
  const methods = useForm<CreateThreadTypes>({
    resolver: zodResolver(createThreadSchema),
    defaultValues,
    mode: 'onChange',
  });
  return (
    <FormProvider {...methods}>
      <Suspense fallback={<div>Loading...</div>}>
        <Container>
          <section className='grid grid-cols-[1fr_23.125rem] gap-x-12.5 gap-y-10 pt-21 pb-10'>
            <Header className='col-span-2' />
            <CreateThreadPanel
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
