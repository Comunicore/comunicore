import { Controller, useFormContext } from 'react-hook-form';

import { CreatePostTypes } from '../../model/create-post.schema';
import { mockCategories } from '../../model/mock-categories';

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
  } = useFormContext<CreatePostTypes>();

  const normalizeCategories = mockCategories.map(({ label, id }) => ({
    label,
    value: id,
  }));

  return (
    <div className='grid gap-y-3.75'>
      <h2 className='font-bold text-white'>1. Выберите категорию</h2>
      <div className='grid gap-y-2.5'>
        <Label>
          <Controller
            name='category'
            control={control}
            render={({ field }) => (
              <Select
                options={normalizeCategories}
                value={field.value.id}
                onChange={(selectedId) => {
                  const selectedCategory = mockCategories.find(
                    (category) => category.id === selectedId,
                  );

                  if (selectedCategory) {
                    field.onChange({
                      id: selectedCategory.id,
                      name: selectedCategory.label,
                    });
                  }
                }}
              >
                <SelectTrigger className='*:last:text-purple-86 text-white max-sm:text-sm'>
                  <SelectValue />
                </SelectTrigger>

                <SelectContent data-select-content>
                  {normalizeCategories.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </Label>

        {errors.category?.id && (
          <ErrorMessage
            error={errors.category.id.message || 'Выберите категорию'}
          />
        )}

        <p className='text-gray-9e max-sm:text-sm'>
          Поделитесь своей идеей, задайте вопрос или начните обсуждение.
        </p>
      </div>
    </div>
  );
}
