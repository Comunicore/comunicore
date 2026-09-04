'use client';

import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { LuEye, LuPencil } from 'react-icons/lu';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  createThreadSchema,
  CreateThreadTypes,
} from '../model/schemas/create-thread.schema';

import { FileInput } from './components/file-input/FileInput';
import { MarkdownArea } from './components/markdown-area/MarkdownArea';
import { PostPreview } from './components/post-preview/PostPreview';
import { SelectCategory } from './components/select-category/SelectCategory';
import { TagsInput } from './components/tags-input/TagsInput';
import { ThreadType } from './components/thread-type/ThreadType';
import { TitleInput } from './components/title-input/TitleInput';

import { Button, Tile } from '@/shared/ui';

const defaultValues = {
  chapter: {
    id: '',
    name: '',
  },
  description: 'prosto text',
  fileUrl: undefined,
  tags: undefined,
  title: '',
  type: 'discussion',
} satisfies CreateThreadTypes;

export function CreateThreadPanel() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const methods = useForm<CreateThreadTypes>({
    resolver: zodResolver(createThreadSchema),
    defaultValues,
    mode: 'onChange',
  });

  const {
    handleSubmit,
    trigger,
    formState: { errors },
  } = methods;

  const onSubmit: SubmitHandler<CreateThreadTypes> = (data) => {
    console.log(data);
  };

  const toggleMode = async () => {
    const isValid = await trigger();
    if (!isValid) {
      console.log('Form is invalid, cannot toggle mode', errors);
      return;
    }
    const params = new URLSearchParams(searchParams);
    if (isPreview) {
      params.delete('editor-mode');
    } else {
      params.set('editor-mode', 'preview');
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const editorMode = searchParams.get('editor-mode');
  const isPreview = editorMode === 'preview';

  return (
    <FormProvider {...methods}>
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
          <div className='border-t-gray-9e/10 flex justify-end gap-x-7.5 border-t p-5'>
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
    </FormProvider>
  );
}
