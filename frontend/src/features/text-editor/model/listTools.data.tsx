import { BsListOl } from 'react-icons/bs';
import { LuList } from 'react-icons/lu';

import { MdEditor } from './MdEditor';
import { MdTools } from './mdTools.types';

export const listTools: MdTools[] = [
  {
    label: <LuList />,
    title: 'List',
    toolFn: (ctx) => MdEditor.runTool(ctx, { wrapper: '-', type: 'list' }),
  },
  {
    label: <BsListOl />,
    title: 'Order list',
    toolFn: (ctx) => MdEditor.runTool(ctx, { wrapper: '1.', type: 'o-list' }),
  },
];
