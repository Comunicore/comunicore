'use client';

import { useEffect } from 'react';
import { SubmitHandler, useFormContext } from 'react-hook-form';
import { LuEye, LuPencil } from 'react-icons/lu';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { useDrafts } from '../model/hooks/useDrafts';
import { CreateThreadTypes } from '../model/schemas/create-thread.schema';

import { FileInput } from './components/file-input/FileInput';
import { MarkdownArea } from './components/markdown-area/MarkdownArea';
import { PostPreview } from './components/post-preview/PostPreview';
import { SelectCategory } from './components/select-category/SelectCategory';
import { TagsInput } from './components/tags-input/TagsInput';
import { ThreadType } from './components/thread-type/ThreadType';
import { TitleInput } from './components/title-input/TitleInput';

import { AppRouter } from '@/shared/config/app-router';
import { Button, Tile } from '@/shared/ui';

interface CreateThreadPanelProps {
  editorModeParam: string;
  previewMode: string;
  formDefaultValues: CreateThreadTypes;
}

export function CreateThreadPanel(props: CreateThreadPanelProps) {
  const { editorModeParam, previewMode, formDefaultValues } = props;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const methods = useFormContext<CreateThreadTypes>();

  const editorMode = searchParams.get(editorModeParam);
  const isPreview = editorMode === previewMode;

  const {
    handleSubmit,
    trigger,
    formState: { errors },
  } = methods;

  const { deleteDraft, loadDraft } = useDrafts(methods, !isPreview);

  useEffect(() => {
    loadDraft();
  }, [loadDraft]);

  const onSubmit: SubmitHandler<CreateThreadTypes> = (data) => {
    deleteDraft();
    methods.reset(formDefaultValues);
    console.log(data);
    router.push(AppRouter.threads.root);
  };

  const toggleMode = async () => {
    const isValid = await trigger();
    if (!isValid) {
      console.log('Form is invalid, cannot toggle mode', errors);
      return;
    }
    const params = new URLSearchParams(searchParams);
    if (isPreview) {
      params.delete(editorModeParam);
    } else {
      params.set(editorModeParam, previewMode);
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Tile className='flex flex-col gap-y-13.5' size='xl' color='ghost'>
        {isPreview ? (
          <PostPreview />
        ) : (
          <>
            <SelectCategory />
            <ThreadType />
            <TitleInput />
            <MarkdownArea />
            <TagsInput />
            <FileInput />
          </>
        )}

        {/* Buttons */}
        <div className='border-t-gray-9e/10 grid grid-cols-[1fr_auto_auto] grid-rows-1 justify-end gap-x-7.5 border-t p-5'>
          <Button
            type='button'
            color='purple'
            hoverStyle='purple'
            onClick={() => {
              methods.reset(formDefaultValues);
              deleteDraft();

              if (isPreview) {
                const params = new URLSearchParams(searchParams);
                params.delete(editorModeParam);
                router.push(`${pathname}?${params.toString()}`, {
                  scroll: false,
                });
              }
            }}
            size='max-lg'
            className='justify-self-start'
          >
            Очистить
          </Button>
          <Button
            type='button'
            color='transparent'
            className='flex gap-x-2.5'
            onClick={toggleMode}
          >
            {isPreview ? (
              <>
                <LuPencil size={24} className='max-w-6' />
                Редактировать
              </>
            ) : (
              <>
                <LuEye size={24} className='max-w-6' />
                Предпросмотр
              </>
            )}
          </Button>
          <Button
            type='submit'
            color='purple'
            hoverStyle='purple'
            size='max-lg'
          >
            Опубликовать тред
          </Button>
        </div>
      </Tile>
    </form>
  );
}
