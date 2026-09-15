import { BsTypeBold, BsTypeItalic, BsTypeStrikethrough } from 'react-icons/bs';
import {
  LuHeading,
  LuImage,
  LuLink,
  LuSquareCode,
  LuTextQuote,
} from 'react-icons/lu';

import { MdEditor } from './MdEditor';
import { MdTools } from './mdTools.types';

export const baseTools: MdTools[] = [
  {
    label: <LuHeading />,
    title: 'Heading',
    toolFn: (ctx) => MdEditor.runTool(ctx, { wrapper: '###', type: 'heading' }),
  },
  {
    label: <BsTypeBold />,
    title: 'Bold',
    toolFn: (ctx) => MdEditor.runTool(ctx, { wrapper: '**', type: 'wrap' }),
  },
  {
    label: <BsTypeItalic />,
    title: 'Italic',
    toolFn: (ctx) => MdEditor.runTool(ctx, { wrapper: '_', type: 'wrap' }),
  },
  {
    label: <BsTypeStrikethrough />,
    title: 'Through',
    toolFn: (ctx) => MdEditor.runTool(ctx, { wrapper: '~~', type: 'wrap' }),
  },
  {
    label: <LuSquareCode />,
    title: 'Code',
    toolFn: (ctx) => MdEditor.runTool(ctx, { wrapper: '`', type: 'code' }),
  },
  {
    label: <LuTextQuote />,
    title: 'Quote',
    toolFn: (ctx) => MdEditor.runTool(ctx, { wrapper: '>', type: 'quote' }),
  },
  {
    label: <LuLink />,
    title: 'Link',
    toolFn: (ctx) => MdEditor.runTool(ctx, { wrapper: '()[]', type: 'url' }),
  },
  {
    label: <LuImage />,
    title: 'Image',
    toolFn: (ctx) => MdEditor.runTool(ctx, { wrapper: '![]()', type: 'image' }),
  },
];
