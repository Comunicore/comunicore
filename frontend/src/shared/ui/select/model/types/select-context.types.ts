import { RefObject } from 'react';

export interface SelectContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  close: () => void;
  value: string | number;
  onChange: (value: string | number) => void;
  selectedValueLabel: string;
  listboxId: string;
  triggerId: string;
  triggerRef: RefObject<HTMLButtonElement | null>;
}
