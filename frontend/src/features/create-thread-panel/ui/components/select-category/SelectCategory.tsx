import { Controller, useFormContext } from 'react-hook-form';

import { mockChapters } from '../../../model/data/mock-chapters';
import { CreateThreadTypes } from '../../../model/schemas/create-thread.schema';

import {
  ErrorMessage,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui';

export function SelectCategory() {
  const {
    control,
    formState: { errors },
  } = useFormContext<CreateThreadTypes>();

  const normalizeChapters = mockChapters.map(({ label, id }) => ({
    label,
    value: id,
  }));

  return (
    <div className='grid gap-y-3.75'>
      <h2 className='font-bold text-white'>1. Выберите раздел</h2>
      <div className='grid gap-y-2.5'>
        <Label>
          <Controller
            name='chapter'
            control={control}
            render={({ field }) => (
              <Select
                options={normalizeChapters}
                value={field.value.id}
                onChange={(selectedId) => {
                  const selectedChapter = mockChapters.find(
                    (chapter) => chapter.id === selectedId,
                  );

                  if (selectedChapter) {
                    field.onChange({
                      id: selectedChapter.id,
                      name: selectedChapter.label,
                    });
                  }
                }}
              >
                <SelectTrigger className='*:last:text-purple-86 text-white'>
                  <SelectValue />
                </SelectTrigger>

                <SelectContent data-select-content>
                  {normalizeChapters.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </Label>

        {errors.chapter?.id && (
          <ErrorMessage
            error={errors.chapter.id.message || 'Выберите раздел'}
          />
        )}

        <p className='text-gray-9e'>
          Поделитесь своей идеей, задайте вопрос или начните обсуждение.
        </p>
      </div>
    </div>
  );
}
