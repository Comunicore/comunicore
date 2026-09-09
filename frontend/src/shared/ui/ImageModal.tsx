'use client';

import { useEffect } from 'react';
import { LuX } from 'react-icons/lu';
import Image from 'next/image';

interface ImageModalProps {
  imageUrl: string | null;
  onClose: () => void;
}

export function ImageModal({ imageUrl, onClose }: ImageModalProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (imageUrl) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [imageUrl, onClose]);

  if (!imageUrl) return null;

  return (
    <div
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
}
