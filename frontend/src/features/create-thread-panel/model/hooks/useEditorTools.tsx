import { RefObject } from 'react';
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

import { CreateThreadTypes } from '../schemas/create-thread.schema';

interface Tool {
  name: string;
  label: string;
  icon: IconType;
  command: () => void;
}

export const useEditorTools = (
  textareaRef: RefObject<HTMLTextAreaElement | null>,
): Tool[] => {
  const { setValue } = useFormContext<CreateThreadTypes>();
  const wrap = (prefix: string, suffix: string = '') => {
    const editor = textareaRef?.current;
    if (!editor) return;

    textFieldEdit.wrapSelection(editor, prefix, suffix);
    setValue('description', editor.value, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const insert = (text: string) => {
    const editor = textareaRef?.current;
    if (!editor) return;

    textFieldEdit.insert(editor, text);
    setValue('description', editor.value, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  return [
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
  ];
};
