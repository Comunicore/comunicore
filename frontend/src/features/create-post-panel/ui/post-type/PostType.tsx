import { useFormContext, useWatch } from 'react-hook-form';
import { BsQuestionLg } from 'react-icons/bs';
import { IconType } from 'react-icons/lib';
import { LuFileText, LuMessageCircle } from 'react-icons/lu';

import {
  CreatePostTypes,
  PostTypeOption,
} from '../../model/create-post.schema';

import { cn } from '@/shared/lib/classNames';
import { Label } from '@/shared/ui';

interface PostTypeOptions {
  id: PostTypeOption;
  title: string;
  description: string;
  icon: IconType;
}

const optionsType: PostTypeOptions[] = [
  {
    id: 'discussion',
    title: 'Обсуждение',
    description: 'Обсуждение темы или любого вопроса',
    icon: LuMessageCircle,
  },
  {
    id: 'question',
    title: 'Вопрос',
    description: 'Задайте вопрос сообществу',
    icon: BsQuestionLg,
  },
  {
    id: 'guide',
    title: 'Гайд / Статья',
    description: 'Поделитесь полезной информацией',
    icon: LuFileText,
  },
];

export function PostType() {
  const { register, control } = useFormContext<CreatePostTypes>();

  const selectedType = useWatch({
    control,
    name: 'type',
  });

  return (
    <fieldset>
      <legend className='mb-3.75 font-bold text-white'>2. Тип поста</legend>
      <div className='flex flex-col gap-5 sm:flex-row'>
        {optionsType.map(({ icon: Icon, description, id, title }) => {
          const isChecked = selectedType === id;

          return (
            <Label key={id} className='max-md:w-full'>
              <input
                type='radio'
                className='peer sr-only'
                value={id}
                {...register('type')}
                checked={isChecked}
              />
              <div
                className={cn(
                  'border-gray-9e/10 bg-dark-1b/50 grid h-full grid-cols-1 gap-3 rounded-[0.625rem] border px-3 py-4 duration-200',
                  'peer-focus-visible:ring-offset-dark-1b peer-focus-visible:ring-2 peer-focus-visible:ring-white peer-focus-visible:ring-offset-2',
                  'md:grid-cols-[auto_1fr] md:gap-5 md:px-5 md:py-7.5',
                  isChecked && 'border-purple-86 bg-purple-67/10 border',
                )}
              >
                <div
                  className={cn(
                    'bg-gray-9e/10 row-span-2 h-fit w-fit rounded-[0.625rem] p-2.5',
                    isChecked && 'bg-purple-86/10 text-purple-86',
                  )}
                >
                  <Icon aria-hidden size={30} className='min-w-7.5' />
                </div>
                <span
                  className={cn(
                    isChecked ? 'text-pink-d5' : 'text-white',
                    'max-sm:text-sm',
                  )}
                >
                  {title}
                </span>
                <div
                  className={cn(
                    'hidden text-lg leading-5.5',
                    'md:block',
                    'max-2xl:col-span-2',
                  )}
                >
                  <span>{description}</span>
                </div>
              </div>
            </Label>
          );
        })}
      </div>
    </fieldset>
  );
}
