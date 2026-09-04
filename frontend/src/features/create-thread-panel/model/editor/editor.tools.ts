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

interface Tool {
  name: string;
  label: string;
  icon: IconType;
  command: () => void;
}

export const getTools = (): Tool[] => [
  {
    name: 'bold',
    label: 'Жирный',
    icon: LuBold,
    command: () => {},
  },
  {
    name: 'italic',
    label: 'Курсив',
    icon: LuItalic,
    command: () => {},
  },
  {
    name: 'underline',
    label: 'Подчёркнутый',
    icon: LuUnderline,
    command: () => {},
  },
  {
    name: 'strike',
    label: 'Зачёркнутый',
    icon: LuStrikethrough,
    command: () => {},
  },
  {
    name: 'heading1',
    label: 'Заголовок H1',
    icon: LuHeading,
    command: () => {},
  },
  {
    name: 'heading2',
    label: 'Заголовок H2',
    icon: LuHeading,
    command: () => {},
  },
  {
    name: 'codeBlock',
    label: 'Блок кода',
    icon: LuCodeXml,
    command: () => {},
  },
  {
    name: 'inlineCode',
    label: 'Инлайн код',
    icon: LuCaseSensitive,
    command: () => {},
  },
  {
    name: 'blockquote',
    label: 'Цитата',
    icon: LuQuote,
    command: () => {},
  },
  {
    name: 'bulletList',
    label: 'Маркированный список',
    icon: LuList,
    command: () => {},
  },
  {
    name: 'orderedList',
    label: 'Нумерованный список',
    icon: LuListOrdered,
    command: () => {},
  },
  {
    name: 'horizontalRule',
    label: 'Разделитель',
    icon: LuMinus,
    command: () => {},
  },
  {
    name: 'link',
    label: 'Вставить ссылку',
    icon: LuLink,
    command: () => {},
  },
  {
    name: 'image',
    label: 'Вставить картинку',
    icon: LuImage,
    command: () => {},
  },
  {
    name: 'emoji',
    label: 'Эмодзи',
    icon: LuSmile,
    command: () => {},
  },
];
