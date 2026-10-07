import { useFormContext, useWatch } from 'react-hook-form';

import { CreatePostTypes } from '../../model/create-post.schema';

import { PreviewImageList, Tag, Tile } from '@/shared/ui';
import { StyledPostHtml } from '@/shared/ui/StyledPostHtml';

export function PostPreview() {
  const { control, setValue } = useFormContext<CreatePostTypes>();

  const formValues = useWatch({ control });
  const { category, description, fileUrl: baseUrls, tags, title } = formValues;

  const categoryName = category?.name || 'Без категории';

  const fileUrls = baseUrls || [];

  const removeImage = (url: string) => {
    const updatedFileUrls = fileUrls.filter((fileUrl) => fileUrl !== url);
    setValue('fileUrl', updatedFileUrls);
  };

  return (
    <div className='grid gap-y-5'>
      <p className='text-lg font-bold lg:text-xl'>
        Категория: <span className='text-purple-9d'>{categoryName}</span>
      </p>
      <h2 className='text-xl font-bold break-all lg:text-4xl'>{title}</h2>
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
          imageClassName='size-50'
          urls={fileUrls}
          onRemove={removeImage}
        />
      </Tile>
    </div>
  );
}
