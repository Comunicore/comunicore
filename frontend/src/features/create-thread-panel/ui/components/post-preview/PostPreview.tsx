import { useFormContext } from 'react-hook-form';
import { LuX } from 'react-icons/lu';
import Image from 'next/image';

import { CreateThreadTypes } from '../../../model/schemas/create-thread.schema';

import { Tag, Tile } from '@/shared/ui';

export function PostPreview() {
  const { watch, setValue } = useFormContext<CreateThreadTypes>();

  const [title, description, tags, chapter, baseUrls] = watch([
    'title',
    'description',
    'tags',
    'chapter.name',
    'fileUrl',
  ]);

  const fileUrls = baseUrls || ['/preview.jpg'];

  const removeImage = (url: string) => {
    const updatedFileUrls = fileUrls.filter((fileUrl) => fileUrl !== url);
    setValue('fileUrl', updatedFileUrls);
  };

  return (
    <div className='grid gap-y-5'>
      <p className='text-xl font-bold'>
        Тема: <span className='text-purple-9d'>{chapter}</span>
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

        <div dangerouslySetInnerHTML={{ __html: description || '' }} />
        <div className=''>
          {fileUrls?.map((url) => (
            <div
              key={url}
              className='relative size-30 overflow-hidden rounded-xl object-contain'
            >
              <Image src={url} alt='preview image' fill />
              <button
                type='button'
                onClick={() => removeImage(url)}
                title='Remove image'
                aria-label='Remove image'
                className='absolute top-2 right-2'
              >
                <LuX role='img' size={20} aria-hidden />
              </button>
            </div>
          ))}
        </div>
      </Tile>
    </div>
  );
}
