import { RefObject, useEffect, useState } from 'react';

const UNIQUE_STOP_CLOSE_SELECTORE = '[data-select-content]';

type ModalElement = RefObject<HTMLElement | null>;

interface ModalOptions {
  autoClose?: boolean;
  initialState?: boolean;
  closeByEsc?: boolean;
  trapFocus?: boolean;
}

const FOCUSABLE_ELEMENTS = [
  'a[href]',
  'area[href]',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'button:not([disabled])',
  'iframe',
  'object',
  'embed',
  '[tabindex]:not([tabindex="-1"])',
  '[contenteditable]',
].join(', ');

export const useModal = (
  modal: ModalElement,
  burger?: ModalElement,
  options: ModalOptions = {},
) => {
  const {
    autoClose = true,
    initialState = false,
    closeByEsc = true,
    trapFocus = true,
  } = options;
  const [modalOpen, setModalOpen] = useState(initialState);

  useEffect(() => {
    if (!autoClose) return;

    const closeModal = (event: MouseEvent) => {
      if (!modalOpen) return;
      const target = event.target as HTMLElement;
      const currentModal = modal.current;
      const currentBurger = burger?.current;

      if (currentModal?.contains(target)) return;

      if (currentBurger?.contains(target)) return;
      if (target.closest(UNIQUE_STOP_CLOSE_SELECTORE)) return;

      setModalOpen(false);
    };

    document.addEventListener('click', closeModal);
    return () => document.removeEventListener('click', closeModal);
  }, [modalOpen, modal, burger, autoClose]);

  useEffect(() => {
    if (!closeByEsc || !modalOpen) return;

    const handlerEsc = (event: KeyboardEvent) => {
      const { code } = event;
      if (modalOpen && code === 'Escape') {
        setModalOpen(false);
      }
    };

    document.addEventListener('keydown', handlerEsc);

    return () => document.removeEventListener('keydown', handlerEsc);
  }, [modalOpen, closeByEsc]);

  useEffect(() => {
    if (!trapFocus || !modalOpen || !modal.current) return;

    const modalNode = modal.current;
    const previousFocusedElement = document.activeElement as HTMLElement;

    const focusableNodes = Array.from(
      modalNode.querySelectorAll<HTMLElement>(FOCUSABLE_ELEMENTS),
    );

    if (focusableNodes.length > 0) {
      focusableNodes[0].focus();
    } else {
      modalNode.focus();
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;

      const currentFocusables = Array.from(
        modalNode.querySelectorAll<HTMLElement>(FOCUSABLE_ELEMENTS),
      );

      if (currentFocusables.length === 0) {
        event.preventDefault();
        return;
      }

      const firstElement = currentFocusables[0];
      const lastElement = currentFocusables[currentFocusables.length - 1];

      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab (прямой ход)
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      previousFocusedElement?.focus?.();
    };
  }, [modalOpen, modal, trapFocus]);

  return {
    modalOpen,
    setModalOpen,
  };
};
