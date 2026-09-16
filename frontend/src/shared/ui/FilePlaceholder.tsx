import { MouseEvent } from 'react';
import { IconType } from 'react-icons/lib';
import {
  LuFile,
  LuFileAudio,
  LuFileCode,
  LuFileSpreadsheet,
  LuFileText,
  LuVideo,
} from 'react-icons/lu';

import { getFileType } from '../lib/helpers/getFileTypes';
import { FileTypes } from '../types/file.types';

const fileIcons = {
  video: LuVideo,
  audio: LuFileAudio,
  document: LuFileText,
  spreadsheet: LuFileSpreadsheet,
  code: LuFileCode,
  file: LuFile,
} as const satisfies Record<Exclude<FileTypes, 'image'>, IconType>;
interface FilePlaceholderProps {
  url: string;
  onConfirmOpen: (url: string) => void;
}

export const FilePlaceholder = ({
  url,
  onConfirmOpen,
}: FilePlaceholderProps) => {
  const fileType = getFileType(url);
  if (fileType === 'image') return null;

  const Icon = fileIcons[fileType] || LuFile;
  const fileName = url.split('/').pop()?.split('?')[0] || 'Файл';

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onConfirmOpen(url);
  };

  return (
    <a
      href={url}
      target='_blank'
      rel='noopener noreferrer'
      className='flex h-full w-full flex-col items-center justify-center gap-1 bg-neutral-100 p-2 text-center transition-colors hover:bg-neutral-200'
      onClick={handleClick}
    >
      <Icon aria-hidden className='size-5 text-neutral-600' />
      <span className='max-w-full truncate text-[10px] font-medium text-neutral-600'>
        {fileName}
      </span>
    </a>
  );
};
