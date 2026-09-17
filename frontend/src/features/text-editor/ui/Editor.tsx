'use client';

import { RefObject, useCallback } from 'react';
import { SubmitHandler, UseFormReturn } from 'react-hook-form';
import clsx from 'clsx';

import { renderHtml } from '../model/html-render';
import { MarkDownSchema } from '../model/markdown.schema';
import { MdEditor } from '../model/MdEditor';
import { useEditorDraft } from '../model/useEditorDraft';
import { useEditorKeyBoard } from '../model/useEditorKeyBoard';
import { useMedia } from '../model/useMedia';

interface Props {
  form: UseFormReturn<MarkDownSchema>;
  markdownFieldRef: RefObject<HTMLTextAreaElement | null>;
}

export function Editor({ form, markdownFieldRef }: Props) {
  const { register, reset, handleSubmit } = form;

  const {
    handleDragLeave,
    handleDragOver,
    handleDrop,
    handlePaste,
    isDragging,
    isUploading,
  } = useMedia((url, alt) => {
    if (!markdownFieldRef.current) return;
    MdEditor.addImageOnDrop(url, alt, {
      getValues: form.getValues,
      setValue: form.setValue,
      textarea: markdownFieldRef.current,
    });
  });

  const { clearDraft } = useEditorDraft(form);
  const { onKeyDown } = useEditorKeyBoard(form);

  const { ref, ...mdRegister } = register('markdown');

  const onSubmit: SubmitHandler<MarkDownSchema> = useCallback(
    async (data) => {
      const html = renderHtml(data.markdown);

      try {
        await new Promise((res) => setTimeout(res, 1000));
        console.log(html);
        reset({ markdown: '' });
        clearDraft();
      } catch (error) {
        console.error(error);
      }
    },
    [reset, clearDraft],
  );

  const setRefs = (element: HTMLTextAreaElement | null) => {
    ref(element);
    markdownFieldRef.current = element;
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      id='text-editor-form'
      className='relative grid h-full gap-y-4'
    >
      <textarea
        id='markdown-editor'
        className={clsx(
          'h-full resize-none rounded-lg p-4 duration-200',
          isDragging && 'outline-5 outline-gray-300',
        )}
        {...mdRegister}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onKeyDown={onKeyDown}
        onPaste={handlePaste}
        ref={(element) => setRefs(element)}
        aria-label='Text Editor'
        placeholder='Describe text...'
      />
      {isUploading && (
        <div className='pointer-events-none absolute inset-0 flex items-center justify-center bg-white/50'>
          <span>Загрузка картинки...</span>
        </div>
      )}
    </form>
  );
}
