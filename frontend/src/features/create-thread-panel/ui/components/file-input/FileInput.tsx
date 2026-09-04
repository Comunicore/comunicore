import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { LuUpload } from 'react-icons/lu';

import { useUploadMedia } from '../../../model/hooks/useUploadMedia';
import { CreateThreadTypes } from '../../../model/schemas/create-thread.schema';

import { cn } from '@/shared/lib/classNames';
import { ErrorMessage } from '@/shared/ui';

export function FileInput() {
  const {
    formState: { errors },
  } = useFormContext<CreateThreadTypes>();
  const [isDragActive, setIsDragActive] = useState(false);

  const { handleFileChange, isUploading, handleDragOver, handleDrop } =
    useUploadMedia<CreateThreadTypes>({ fieldName: 'fileUrl' });

  return (
    <div className='grid gap-y-3.75'>
      <h2 className='font-bold text-white'>
        6. Прикрепить файлы{' '}
        <span className='text-gray-9e text-base font-light'>
          {'(необязательно)'}
        </span>
      </h2>
      <div className='grid gap-y-2.5'>
        <label
          className='block cursor-pointer'
          onDragOver={(e) => {
            handleDragOver(e);
            setIsDragActive(true);
          }}
          onDragLeave={() => setIsDragActive(false)}
          onDrop={(e) => {
            setIsDragActive(false);
            handleDrop(e);
          }}
        >
          <input
            type='file'
            className='peer sr-only z-50'
            onChange={handleFileChange}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            multiple
            disabled={isUploading}
            accept='image/*,.pdf,.doc,.docx'
          />

          <div
            className={cn(
              'border-gray-9e/20 bg-dark-1b/5 flex h-30 w-full items-center justify-center gap-x-2.5 rounded-[0.625rem] border border-dashed px-5 transition-all select-none',
              'hover:border-gray-9e/40 hover:bg-white/5',
              'peer-focus-visible:ring-offset-dark-1b peer-focus-visible:ring-2 peer-focus-visible:ring-white peer-focus-visible:ring-offset-2',
              isDragActive && 'bg-white/10 ring-2 ring-white',
            )}
          >
            <LuUpload size={26} className='text-gray-9e min-w-6.5' />

            <p className='text-gray-9e font-md max-w-61 text-lg leading-5.5'>
              Перетащите файлы сюда или нажмите для выбора
            </p>
          </div>
        </label>
        {errors.fileUrl?.message && (
          <ErrorMessage error={errors.fileUrl.message} />
        )}

        <p className='text-gray-9e'>
          Поддерживаемые изображения, код, документы (до 5 мб)
        </p>
      </div>
    </div>
  );
}
