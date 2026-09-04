'use client';

import { useController, useFormContext } from 'react-hook-form';
import { LuFileText, LuRedo2, LuUndo2 } from 'react-icons/lu';

import { getTools } from '../../../model/editor/editor.tools';
import { CreateThreadTypes } from '../../../model/schemas/create-thread.schema';

import { ErrorMessage } from '@/shared/ui';

export function MarkdownArea() {
  const { control } = useFormContext<CreateThreadTypes>();

  const {
    fieldState: { error },
  } = useController({
    name: 'description',
    control,
  });

  const tools = getTools();

  return (
    <div className='grid gap-y-3.75'>
      <h2 className='font-bold text-white'>4. Текст треда</h2>
      <div className='border-gray-9e/10 before:bg-dark-1b/80 pointer-events-none relative flex flex-col rounded-[0.625rem] border before:absolute before:inset-0 before:z-10 before:content-[""]'>
        <p className='text-gray-9e absolute inset-0 z-10 flex items-center justify-center text-lg font-light'>
          Раздел в разработке...
        </p>
        <div className='border-b-gray-9e/10 flex items-center border-b'>
          <ul className='border-r-gray-9e/10 flex items-center gap-x-4 border-r px-2.5 py-2.5'>
            {tools.map(({ command, icon: Icon, label, name }) => (
              <li key={name} title={label} className=' '>
                <button
                  onClick={command}
                  aria-label={label}
                  title={label}
                  type='button'
                  className='flex items-center'
                >
                  <Icon aria-hidden size={15} className='min-h-4 min-w-4' />
                </button>
              </li>
            ))}
          </ul>
          <div className='flex gap-x-1 px-2.5'>
            <button
              type='button'
              className='flex items-center'
              aria-label={'Отменить'}
              title='Отменить'
            >
              <LuUndo2 aria-hidden size={20} className='min-h-5 min-w-5' />
            </button>
            <button
              type='button'
              title='Повторить'
              aria-label={'Повторить'}
              className='flex items-center'
            >
              <LuRedo2 aria-hidden size={20} className='min-h-5 min-w-5' />
            </button>
          </div>
        </div>
        <div className='h-55 w-full p-2.5'>
          <p className='text-gray-9e'>Напишите ваш тред здесь...</p>
        </div>
        <div className='text-gray-9e border-t-gray-9e/10 flex items-center gap-x-2.5 border-t p-2.5'>
          <LuFileText aria-hidden size={20} className='min-h-5 min-w-5' />
          <p>
            <span className='font-bold'>Markdown</span> поддерживается
          </p>
        </div>
      </div>
      {error?.message && <ErrorMessage error={error.message} />}
    </div>
  );
}
