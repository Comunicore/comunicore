'use client';

import { forwardRef, useEffect } from 'react';
import { LuX } from 'react-icons/lu';
import Image from 'next/image';

interface ImageModalProps {
  imageUrl: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ImageModal = forwardRef<HTMLDivElement, ImageModalProps>(
  ({ imageUrl, onClose, isOpen }, ref) => {
    const modalOpen = isOpen && !!imageUrl;
    useEffect(() => {
      if (modalOpen) {
        document.body.style.overflow = 'hidden';
      }

      return () => {
        document.body.style.overflow = 'unset';
      };
    }, [modalOpen]);

    if (!modalOpen || !imageUrl) return null;

    return (
      <div
        ref={ref}
        className='fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm transition-opacity duration-200'
        onClick={onClose}
      >
        <div className='relative flex h-full max-h-[85vh] w-full max-w-5xl items-center justify-center'>
          <button
            type='button'
            onClick={onClose}
            aria-label='Close modal'
            className='absolute -top-12 right-0 rounded-full p-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white'
          >
            <LuX size={28} />
          </button>
          <div
            className='relative h-full w-full'
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={imageUrl}
              alt='Full preview'
              fill
              className='object-contain select-none'
              unoptimized
            />
          </div>
        </div>
      </div>
    );
  },
);

ImageModal.displayName = 'ImageModal';
