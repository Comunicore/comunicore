import { useFormContext, useWatch } from 'react-hook-form';

import { CreateThreadTypes } from '../../../model/schemas/create-thread.schema';

import { PreviewImageList, Tag, Tile } from '@/shared/ui';
import { StyledPostHtml } from '@/shared/ui/StyledPostHtml';

export function PostPreview() {
  const { control, setValue } = useFormContext<CreateThreadTypes>();

  const formValues = useWatch({ control });
  const { chapter, description, fileUrl: baseUrls, tags, title } = formValues;

  const chapterName = chapter?.name || 'Без темы';

  const fileUrls = baseUrls || [];

  const removeImage = (url: string) => {
    const updatedFileUrls = fileUrls.filter((fileUrl) => fileUrl !== url);
    setValue('fileUrl', updatedFileUrls);
  };

  return (
    <div className='grid gap-y-5'>
      <p className='text-xl font-bold'>
        Тема: <span className='text-purple-9d'>{chapterName}</span>
      </p>
      <h2 className='text-4xl font-bold'>{title}</h2>
      <Tile className='grid gap-y-5'>
        {tags && (
          <ul className='flex flex-wrap gap-x-2.5'>
            {tags.map((tag) => (
              <li key={tag}>
                <Tag color='purple' size='md'>
                  {tag}
                </Tag>
              </li>
            ))}
          </ul>
        )}

        <StyledPostHtml markdown={description} />
        <PreviewImageList
          imageClassName='w-full h-50'
          className='max-h-150 flex-col gap-y-5'
          urls={fileUrls}
          onRemove={removeImage}
        />
      </Tile>
    </div>
  );
}
