import { RefObject, useCallback, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { IconType } from 'react-icons/lib';
import {
  LuBold,
  LuCaseSensitive,
  LuCodeXml,
  LuHeading,
  LuImage,
  LuItalic,
  LuLink,
  LuList,
  LuListOrdered,
  LuMinus,
  LuQuote,
  LuSmile,
  LuStrikethrough,
  LuUnderline,
} from 'react-icons/lu';
import textFieldEdit from 'text-field-edit';

import { CreatePostTypes } from './create-post.schema';

interface Tool {
  name: string;
  label: string;
  icon: IconType;
  command: () => void;
}

export const useEditorTools = (
  textareaRef: RefObject<HTMLTextAreaElement | null>,
  toolbarRef?: RefObject<HTMLElement | null>,
  buttonWidth: number = 16,
  gap: number = 8,
) => {
  const { setValue } = useFormContext<CreatePostTypes>();

  // utils function
  const wrap = useCallback(
    (prefix: string, suffix: string = '') => {
      const editor = textareaRef?.current;
      if (!editor) return;

      textFieldEdit.wrapSelection(editor, prefix, suffix);
      setValue('description', editor.value, {
        shouldValidate: true,
        shouldDirty: true,
      });
    },
    [textareaRef, setValue],
  );

  const insert = useCallback(
    (text: string) => {
      const editor = textareaRef?.current;
      if (!editor) return;

      textFieldEdit.insert(editor, text);
      setValue('description', editor.value, {
        shouldValidate: true,
        shouldDirty: true,
      });
    },
    [setValue, textareaRef],
  );

  const undo = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.focus();
    document.execCommand('undo');

    setValue('description', textarea.value, {
      shouldValidate: true,
      shouldDirty: true,
    });
  }, [textareaRef, setValue]);

  const redo = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.focus();
    document.execCommand('redo');

    setValue('description', textarea.value, {
      shouldValidate: true,
      shouldDirty: true,
    });
  }, [textareaRef, setValue]);

  const allTools: Tool[] = useMemo(
    () => [
      {
        name: 'bold',
        label: 'Жирный',
        icon: LuBold,
        command: () => wrap('**', '**'),
      },
      {
        name: 'italic',
        label: 'Курсив',
        icon: LuItalic,
        command: () => wrap('*', '*'),
      },
      {
        name: 'underline',
        label: 'Подчёркнутый',
        icon: LuUnderline,
        command: () => wrap('__', '__'),
      },
      {
        name: 'strike',
        label: 'Зачёркнутый',
        icon: LuStrikethrough,
        command: () => wrap('~~', '~~'),
      },
      {
        name: 'heading',
        label: 'Заголовок H3',
        icon: LuHeading,
        command: () => wrap('### ', ''),
      },
      {
        name: 'codeBlock',
        label: 'Блок кода',
        icon: LuCodeXml,
        command: () => wrap('```\n', '```\n'),
      },
      {
        name: 'inlineCode',
        label: 'Инлайн код',
        icon: LuCaseSensitive,
        command: () => wrap('`', '`'),
      },
      {
        name: 'blockquote',
        label: 'Цитата',
        icon: LuQuote,
        command: () => wrap('> ', ''),
      },
      {
        name: 'bulletList',
        label: 'Маркированный список',
        icon: LuList,
        command: () => wrap('- ', ''),
      },
      {
        name: 'orderedList',
        label: 'Нумерованный список',
        icon: LuListOrdered,
        command: () => wrap('1. ', ''),
      },
      {
        name: 'horizontalRule',
        label: 'Разделитель',
        icon: LuMinus,
        command: () => insert('\n---\n'),
      },
      {
        name: 'link',
        label: 'Вставить ссылку',
        icon: LuLink,
        command: () => wrap('[', '](https://)'),
      },
      {
        name: 'image',
        label: 'Вставить картинку',
        icon: LuImage,
        command: () => wrap('![alt](', ')'),
      },
      {
        name: 'emoji',
        label: 'Эмодзи',
        icon: LuSmile,
        command: () => insert(':-)\n'),
      },
    ],
    [wrap, insert],
  );

  const divideTools = useCallback(
    (staticWidth = 0) => {
      const container = toolbarRef?.current;
      if (!container) return { visibleTools: allTools, hiddenTools: [] };

      const containerWidth = container.getBoundingClientRect().width;
      const containerPadding = 20;

      const firstButton = container.querySelector('ul > li');
      const actualButtonWidth = firstButton
        ? firstButton.getBoundingClientRect().width
        : buttonWidth;

      const availableWidth =
        containerWidth - staticWidth - containerPadding - 8;

      const itemFullWidth = actualButtonWidth + gap;

      const maxPossible = Math.floor((availableWidth + gap) / itemFullWidth);

      if (maxPossible >= allTools.length) {
        return { visibleTools: allTools, hiddenTools: [] };
      }

      const moreButtonWidth = 28 + gap;
      const availableWidthWithMore = availableWidth - moreButtonWidth;

      const visibleCount = Math.max(
        1,
        Math.floor((availableWidthWithMore + gap) / itemFullWidth),
      );

      return {
        visibleTools: allTools.slice(0, visibleCount),
        hiddenTools: allTools.slice(visibleCount),
      };
    },
    [toolbarRef, buttonWidth, gap, allTools],
  );

  return {
    undo,
    redo,
    allTools,
    divideTools,
  };
};
