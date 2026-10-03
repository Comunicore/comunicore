'use client';

import { useEffect, useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { LuEllipsis, LuFileText, LuRedo2, LuUndo2 } from 'react-icons/lu';

import { CreateThreadTypes } from '../../model/create-thread.schema';
import { useEditorTools } from '../../model/useEditorTools';

import {
  ErrorMessage,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/shared/ui';

const TOOLBAR_BUTTON_WIDTH = 32;
const TOOLBAR_GAP = 16;

export function MarkdownArea() {
  const {
    register,
    formState: { errors },
  } = useFormContext<CreateThreadTypes>();

  const { ref: registerRef, ...restRegister } = register('description');

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const toolbarRef = useRef<HTMLDivElement | null>(null);
  const staticActionsRef = useRef<HTMLDivElement | null>(null);
  const { divideTools, redo, undo } = useEditorTools(
    textareaRef,
    toolbarRef,
    TOOLBAR_BUTTON_WIDTH,
    TOOLBAR_GAP,
  );
  const [{ visibleTools, hiddenTools }, setTools] = useState(() =>
    divideTools(),
  );

  const divideToolsRef = useRef(divideTools);
  useEffect(() => {
    divideToolsRef.current = divideTools;
  }, [divideTools]);

  useEffect(() => {
    const container = toolbarRef.current;
    if (!container) return;

    let timeoutId: NodeJS.Timeout;

    const handleResize = () => {
      clearTimeout(timeoutId);

      timeoutId = setTimeout(() => {
        const staticWidth =
          staticActionsRef.current?.getBoundingClientRect().width || 0;
        setTools(divideTools(staticWidth));
      }, 50);
    };

    handleResize();

    const observer = new ResizeObserver(handleResize);
    observer.observe(container);

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, [divideTools]);

  return (
    <div className='grid gap-y-3.75'>
      <h2 className='font-bold text-white'>4. Текст треда</h2>
      <div
        ref={toolbarRef}
        className='border-gray-9e/10 flex flex-col rounded-[0.625rem] border'
      >
        <div className='border-b-gray-9e/10 flex items-center border-b'>
          <ul className='border-r-gray-9e/10 flex items-center gap-x-4 border-r px-2.5 py-2.5'>
            {visibleTools.map(({ command, icon: Icon, label, name }) => (
              <li key={name} title={label}>
                <button
                  onClick={command}
                  aria-label={label}
                  title={label}
                  type='button'
                  className='flex items-center'
                >
                  <Icon
                    aria-hidden
                    size={TOOLBAR_BUTTON_WIDTH / 2}
                    className='min-h-4 min-w-4'
                  />
                </button>
              </li>
            ))}

            {hiddenTools.length > 0 && (
              <li>
                <Select
                  value=''
                  options={hiddenTools.map(({ label, name }) => ({
                    label,
                    value: name,
                  }))}
                  onChange={(toolName) => {
                    const selectedTool = hiddenTools.find(
                      (t) => t.name === toolName,
                    );
                    if (selectedTool) {
                      selectedTool.command();
                    }
                  }}
                >
                  <SelectTrigger
                    chevronOff={true}
                    className='flex items-center border-0 p-0'
                  >
                    <LuEllipsis
                      size={TOOLBAR_BUTTON_WIDTH / 2}
                      className='min-h-4 min-w-4'
                    />
                  </SelectTrigger>

                  <SelectContent data-select-content className='-left-25 w-fit'>
                    {hiddenTools.map((tool) => {
                      const Icon = tool.icon;
                      return (
                        <SelectItem key={tool.name} value={tool.name}>
                          <div className='flex items-center gap-x-2'>
                            <Icon size={16} className='min-h-4 min-w-4' />
                            <span>{tool.label}</span>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </li>
            )}
          </ul>
          <div className='flex gap-x-1 px-2.5' ref={staticActionsRef}>
            <button
              type='button'
              className='flex items-center'
              aria-label={'Отменить'}
              onClick={undo}
              title='Отменить'
            >
              <LuUndo2 aria-hidden size={20} className='min-h-5 min-w-5' />
            </button>
            <button
              type='button'
              title='Повторить'
              aria-label={'Повторить'}
              className='flex items-center'
              onClick={redo}
            >
              <LuRedo2 aria-hidden size={20} className='min-h-5 min-w-5' />
            </button>
          </div>
        </div>
        <div className='relative z-10'>
          <textarea
            {...restRegister}
            ref={(e) => {
              registerRef(e);
              textareaRef.current = e;
            }}
            className='h-55 w-full max-w-full resize-y p-2.5'
            placeholder='Напишите ваш тред здесь...'
          />
        </div>
        <div className='text-gray-9e border-t-gray-9e/10 flex items-center gap-x-2.5 border-t p-2.5'>
          <LuFileText aria-hidden size={20} className='min-h-5 min-w-5' />
          <p>
            <span className='font-bold'>Markdown</span> поддерживается
          </p>
        </div>
      </div>
      {errors.description?.message && (
        <ErrorMessage error={errors.description.message} />
      )}
    </div>
  );
}
