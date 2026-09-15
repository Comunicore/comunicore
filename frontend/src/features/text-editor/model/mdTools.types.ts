import { ReactNode } from 'react';

import { Ctx } from './ctx.types';

export type ToolsName =
  | 'Heading'
  | 'Bold'
  | 'Italic'
  | 'Through'
  | 'Code'
  | 'Quote'
  | 'Link'
  | 'List'
  | 'Image'
  | 'Order list';

export interface MdTools {
  label: ReactNode;
  title: ToolsName;
  toolFn: (ctx: Ctx) => void;
}
