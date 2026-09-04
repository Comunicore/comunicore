import { KeyboardEvent, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { LuX } from 'react-icons/lu';

import { CreateThreadTypes } from '../../../model/schemas/create-thread.schema';

import { Input, Tag } from '@/shared/ui';

export function TagsInput() {
  const { setValue, watch } = useFormContext<CreateThreadTypes>();
  const [inputValue, setInputValue] = useState('');

  const tags = watch('tags') || [];

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const trimmed = inputValue.trim().toLowerCase();

      if (trimmed && !tags.includes(trimmed)) {
        const nextTags = [...tags, trimmed];
        setValue('tags', nextTags, { shouldValidate: true, shouldDirty: true });
        setInputValue('');
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    const nextTags = tags.filter((t) => t !== tagToRemove);
    setValue('tags', nextTags, { shouldValidate: true, shouldDirty: true });
  };

  return (
    <div className='grid gap-y-3.75'>
      <h2 className='font-bold text-white'>
        5. Теги{' '}
        <span className='text-gray-9e text-base font-light'>
          {'(необязательно)'}
        </span>
      </h2>
      <div className='grid gap-y-2.5'>
        {tags.length > 0 && (
          <div className='mb-1 flex flex-wrap gap-2'>
            {tags.map((tag) => (
              <Tag key={tag} size='md'>
                #{tag}
                <button
                  type='button'
                  onClick={() => removeTag(tag)}
                  className='text-gray-9e transition-colors hover:text-white'
                >
                  <LuX size={14} />
                </button>
              </Tag>
            ))}
          </div>
        )}
        <Input
          type='text'
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          color='ghost'
          placeholder='Нажмите Enter или запятую для добавления тега'
        />
        <p className='text-gray-9e'>
          Например: react, typescript, помощь, новичок <br /> Теги помогают
          другим пользователям найти ваш тред
        </p>
      </div>
    </div>
  );
}
