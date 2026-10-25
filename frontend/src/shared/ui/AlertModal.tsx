'use client';

import { forwardRef, useId } from 'react';
import { LuX } from 'react-icons/lu';

import { Button } from './Button';
import { Tile } from './Tile';

interface AlertModalProps {
  isOpen: boolean;
  title?: string;
  message: string;
  onClose: () => void;
  onConfirm: () => void;
}

export const AlertModal = forwardRef<HTMLDivElement, AlertModalProps>(
  ({ isOpen, title = 'Внимание', message, onClose, onConfirm }, ref) => {
    const baseId = useId();
    const titleId = `${baseId}-title`;
    const messageId = `${baseId}-message`;

    if (!isOpen) return null;

    return (
      <div
        ref={ref}
        role='dialog'
        aria-modal='true'
        aria-labelledby={titleId}
        aria-describedby={messageId}
        tabIndex={-1}
        className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm duration-200 outline-none'
        onClick={onClose}
      >
        <Tile
          className='relative flex w-full max-w-sm flex-col gap-y-5 shadow-xl transition-all duration-200'
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type='button'
            onClick={onClose}
            aria-label='Закрыть'
            className='text-purple-67 focus-visible:outline-purple-86 absolute top-4 right-4 rounded-full p-1 transition-colors hover:bg-neutral-100 hover:text-neutral-600 focus-visible:outline-2 focus-visible:outline-offset-2'
          >
            <LuX size={18} aria-hidden />
          </button>

          <div className='flex items-center gap-3'>
            <h3 id={titleId} className='text-lg font-semibold text-white'>
              {title}
            </h3>
          </div>

          <p id={messageId} className='text-sm leading-relaxed text-white'>
            {message}
          </p>

          <div className='flex justify-end'>
            <Button
              type='button'
              onClick={() => {
                onClose();
                onConfirm();
              }}
              className='w-full'
            >
              Понятно
            </Button>
          </div>
        </Tile>
      </div>
    );
  },
);

AlertModal.displayName = 'AlertModal';
