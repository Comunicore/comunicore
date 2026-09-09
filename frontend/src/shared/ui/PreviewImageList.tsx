'use client';

import { HTMLAttributes, useState } from 'react';
import { IconType } from 'react-icons/lib';
import {
  LuFile,
  LuFileAudio,
  LuFileCode,
  LuFileSpreadsheet,
  LuFileText,
  LuVideo,
  LuX,
} from 'react-icons/lu';
import Image from 'next/image';

import { cn } from '../lib/classNames';

import { ImageModal } from './ImageModal';

interface PreviewImageListProps extends HTMLAttributes<HTMLDivElement> {
  urls: string[];
  onRemove?: (url: string) => void;
  imageClassName?: string;
}

type FileTypes =
  | 'image'
  | 'video'
  | 'audio'
  | 'document'
  | 'spreadsheet'
  | 'code'
  | 'file';

const extensionMap: Record<string, FileTypes> = {
  // Images
  jpg: 'image',
  jpeg: 'image',
  png: 'image',
  gif: 'image',
  webp: 'image',
  svg: 'image',
  bmp: 'image',
  // Videos
  mp4: 'video',
  webm: 'video',
  mov: 'video',
  avi: 'video',
  // Audio
  mp3: 'audio',
  wav: 'audio',
  ogg: 'audio',
  // Documents
  pdf: 'document',
  txt: 'document',
  doc: 'document',
  docx: 'document',
  rtf: 'document',
  // Spreadsheets
  xls: 'spreadsheet',
  xlsx: 'spreadsheet',
  csv: 'spreadsheet',
  // Code
  js: 'code',
  ts: 'code',
  tsx: 'code',
  jsx: 'code',
  json: 'code',
  html: 'code',
  css: 'code',
};

const fileIcons = {
  video: LuVideo,
  audio: LuFileAudio,
  document: LuFileText,
  spreadsheet: LuFileSpreadsheet,
  code: LuFileCode,
  file: LuFile,
} as const satisfies Record<Exclude<FileTypes, 'image'>, IconType>;

const getFileType = (url: string): FileTypes => {
  const cleanUrl = url.split('?')[0].split('#')[0];
  const extension = cleanUrl.split('.').pop()?.toLowerCase();

  if (!extension) return 'file';

  return extensionMap[extension] ?? 'file';
};

const FilePlaceholder = ({ url }: { url: string }) => {
  const fileType = getFileType(url);
  if (fileType === 'image') return null;

  const Icon = fileIcons[fileType] || LuFile;
  const fileName = url.split('/').pop()?.split('?')[0] || 'Файл';

  return (
    <a
      href={url}
      target='_blank'
      rel='noopener noreferrer'
      className='flex h-full w-full flex-col items-center justify-center gap-1 bg-neutral-100 p-2 text-center transition-colors hover:bg-neutral-200'
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <Icon aria-hidden className='size-5 text-neutral-600' />
      <span className='max-w-full truncate text-[10px] font-medium text-neutral-600'>
        {fileName}
      </span>
    </a>
  );
};

export function PreviewImageList(props: PreviewImageListProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { urls, className, onRemove, imageClassName, ...attrs } = props;

  if (!urls.length) return null;

  const commonImageStyles = cn(
    'relative size-30 rounded-xl overflow-hidden',
    imageClassName,
  );

  return (
    <>
      <div className={cn('flex gap-x-5', className)} {...attrs}>
        {urls.map((url) => {
          const isImage = getFileType(url) === 'image';

          return (
            <div
              key={url}
              className={commonImageStyles}
              onClick={() => isImage && setSelectedImage(url)}
            >
              {isImage ? (
                <Image
                  src={url}
                  alt='preview image'
                  fill
                  className='object-cover'
                />
              ) : (
                <FilePlaceholder url={url} />
              )}

              {!!onRemove && (
                <button
                  type='button'
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove(url);
                  }}
                  title='Remove file'
                  aria-label='Remove file'
                  className='absolute top-1 right-1 z-10 rounded-full bg-black/50 p-1 text-white transition-colors hover:bg-black/70'
                >
                  <LuX size={20} aria-hidden />
                </button>
              )}
            </div>
          );
        })}
      </div>
      <ImageModal
        onClose={() => setSelectedImage(null)}
        imageUrl={selectedImage}
      />
    </>
  );
}
