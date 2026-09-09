'use client';

import {
  HTMLAttributes,
  KeyboardEvent,
  MouseEvent,
  useRef,
  useState,
} from 'react';
import { LuX } from 'react-icons/lu';
import Image from 'next/image';

import { useModal } from '../../../hooks/useModal';
import { cn } from '../../../lib/classNames';
import { getFileType } from '../../../lib/helpers/getFileTypes';
import { AlertModal } from '../../AlertModal';
import { FilePlaceholder } from '../../FilePlaceholder';
import { ImageModal } from '../../ImageModal';

interface PreviewImageListProps extends HTMLAttributes<HTMLDivElement> {
  urls: string[];
  onRemove?: (url: string) => void;
  imageClassName?: string;
}

export function PreviewImageList(props: PreviewImageListProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [pendingFileUrl, setPendingFileUrl] = useState<string | null>(null);

  const { urls, className, onRemove, imageClassName, ...attrs } = props;

  const alertModalRef = useRef<HTMLDivElement | null>(null);
  const imageModalRef = useRef<HTMLDivElement | null>(null);

  // modals ref
  const { modalOpen: alertModalOpen, setModalOpen: setAlertModalOpen } =
    useModal(alertModalRef);
  const { modalOpen: imageModalOpen, setModalOpen: setImageModalOpen } =
    useModal(imageModalRef);

  if (!urls.length) return null;

  const commonImageStyles = cn(
    'relative size-30 rounded-xl overflow-hidden',
    imageClassName,
  );
  const handleOpenImage = (url: string) => {
    setSelectedImage(url);
    setImageModalOpen(true);
  };

  const handleCloseImage = () => {
    setSelectedImage(null);
    setImageModalOpen(false);
  };

  const handleOpenAlert = (fileUrl: string) => {
    setPendingFileUrl(fileUrl);
    setAlertModalOpen(true);
  };

  const handleCloseAlert = () => {
    setPendingFileUrl(null);
    setAlertModalOpen(false);
  };

  const handleProceedToExternalFile = () => {
    if (pendingFileUrl) {
      window.open(pendingFileUrl, '_blank', 'noopener,noreferrer');
      handleCloseAlert();
    }
  };

  return (
    <>
      <div className={cn('flex gap-x-5', className)} {...attrs}>
        {urls.map((url) => {
          const isImage = getFileType(url) === 'image';

          const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
            if (e.target !== e.currentTarget) return;

            if (isImage && (e.key === 'Enter' || e.key === ' ')) {
              e.preventDefault();
              e.stopPropagation();
              handleOpenImage(url);
            }
          };

          const handleRemove = (e: MouseEvent<HTMLButtonElement>) => {
            e.preventDefault();
            e.stopPropagation();
            onRemove?.(url);
          };

          return (
            <div
              key={url}
              tabIndex={isImage ? 0 : undefined}
              role={isImage ? 'button' : undefined}
              className={commonImageStyles}
              onKeyDown={handleKeyDown}
              onClick={() => {
                if (!isImage) return;
                handleOpenImage(url);
              }}
            >
              {isImage ? (
                <Image
                  src={url}
                  alt='preview image'
                  fill
                  sizes='(max-width: 768px) 100vw, 120px'
                  className='cursor-pointer object-cover'
                />
              ) : (
                <FilePlaceholder url={url} onConfirmOpen={handleOpenAlert} />
              )}

              {!!onRemove && (
                <button
                  type='button'
                  onClick={handleRemove}
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
        ref={imageModalRef}
        onClose={handleCloseImage}
        isOpen={imageModalOpen}
        imageUrl={selectedImage}
      />

      <AlertModal
        ref={alertModalRef}
        isOpen={alertModalOpen}
        title='Внимание! Внешний файл'
        message='Вы скачиваете или открываете сторонний файл. Переход по неизвестным ссылкам может быть небезопасен. Продолжить?'
        onClose={handleCloseAlert}
        onConfirm={handleProceedToExternalFile}
      />
    </>
  );
}
