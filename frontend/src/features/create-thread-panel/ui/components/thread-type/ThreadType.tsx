import { useFormContext, useWatch } from 'react-hook-form';
import { BsQuestionLg } from 'react-icons/bs';
import { IconType } from 'react-icons/lib';
import { LuFileText, LuMessageCircle } from 'react-icons/lu';

import {
  CreateThreadTypes,
  ThreadTypeOption,
} from '../../../model/schemas/create-thread.schema';

import { cn } from '@/shared/lib/classNames';
import { Label } from '@/shared/ui';

interface ThreadTypeOptions {
  id: ThreadTypeOption;
  title: string;
  description: string;
  icon: IconType;
}

const optionsType: ThreadTypeOptions[] = [
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

export function ThreadType() {
  const { register, control } = useFormContext<CreateThreadTypes>();

  const selectedType = useWatch({
    control,
    name: 'type',
  });

  return (
    <fieldset>
      <legend className='mb-3.75 font-bold text-white'>2. Тип треда</legend>
      <div className='flex items-center gap-x-5'>
        {optionsType.map(({ icon: Icon, description, id, title }) => {
          const isChecked = selectedType === id;

          return (
            <Label key={id}>
              <input
                type='radio'
                className='peer sr-only'
                value={id}
                {...register('type')}
                checked={isChecked}
              />
              <div
                className={cn(
                  'border-gray-9e/10 bg-dark-1b/50 flex items-start gap-x-5 rounded-[0.625rem] border px-5 py-7.5 duration-200',
                  'peer-focus-visible:ring-offset-dark-1b peer-focus-visible:ring-2 peer-focus-visible:ring-white peer-focus-visible:ring-offset-2',
                  isChecked && 'border-purple-86 bg-purple-67/10 border',
                )}
              >
                <div
                  className={cn(
                    'bg-gray-9e/10 rounded-[0.625rem] p-2.5',
                    isChecked && 'bg-purple-86/10 text-purple-86',
                  )}
                >
                  <Icon aria-hidden size={30} className='min-w-7.5' />
                </div>
                <div className='flex flex-col gap-y-2.5 text-lg leading-5.5'>
                  <span
                    className={cn(isChecked ? 'text-pink-d5' : 'text-white')}
                  >
                    {title}
                  </span>
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
