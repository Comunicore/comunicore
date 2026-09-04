import { useFormContext } from 'react-hook-form';

import { CreateThreadTypes } from '../../../model/schemas/create-thread.schema';

import { TitleCounter } from './TitleCounter';

import { ErrorMessage, Input } from '@/shared/ui';

const TITLE_MAX_LENGHT = 100;
const TITLE_MIN_LENGHT = 5;

export function TitleInput() {
  const {
    register,
    formState: { errors },
  } = useFormContext<CreateThreadTypes>();
  return (
    <div className='grid gap-y-3.75'>
      <h2 className='font-bold text-white'>3. Заголовок</h2>
      <div className='grid gap-y-2.5'>
        <div className='relative'>
          <Input
            type='text'
            color='ghost'
            inputSize='lg'
            maxLength={TITLE_MAX_LENGHT}
            minLength={TITLE_MIN_LENGHT}
            {...register('title')}
            className='w-full pr-30'
            placeholder='Введите заголовок вашего треда'
          />
          <TitleCounter titleMaxLenght={TITLE_MAX_LENGHT} />
        </div>
        {errors.title?.message && <ErrorMessage error={errors.title.message} />}
        <p className='text-gray-9e'>
          Короткий, но понятный заголовок может привлечь внимание.
        </p>
      </div>
    </div>
  );
}
