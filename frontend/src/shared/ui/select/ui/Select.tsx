'use client';

import {
  ButtonHTMLAttributes,
  HTMLAttributes,
  KeyboardEvent,
  LiHTMLAttributes,
  useEffect,
  useId,
  useRef,
} from 'react';
import { LuCheck, LuChevronDown } from 'react-icons/lu';

import { useModal } from '../../../hooks/useModal';
import { cn } from '../../../lib/classNames';
import { SelectContext } from '../model/context/select-context';
import { useSelect } from '../model/hooks/useSelect';

import { SelectContainerProps, SelectItemProps } from './Select-props';

const getOptions = (list: HTMLElement | null) =>
  list ? Array.from(list.querySelectorAll<HTMLElement>('[role="option"]')) : [];

export const Select = <T extends string | number>({
  children,
  value,
  onChange,
  options,
  name,
  className = '',
  ...restAttrs
}: SelectContainerProps<T>) => {
  const selectRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const baseId = useId();
  const { modalOpen, setModalOpen } = useModal(selectRef, undefined, {
    trapFocus: false,
  });

  const selectedOption = options.find((opt) => opt.value === value);
  const selectedValueLabel = selectedOption ? selectedOption.label : '';

  const close = () => {
    setModalOpen(false);
    triggerRef.current?.focus();
  };

  return (
    <SelectContext.Provider
      value={{
        isOpen: modalOpen,
        setIsOpen: setModalOpen,
        close,
        value,
        onChange: (val) => onChange(val as T),
        selectedValueLabel,
        listboxId: `${baseId}-listbox`,
        triggerId: `${baseId}-trigger`,
        triggerRef,
      }}
    >
      <div
        className={cn('flex flex-col gap-1.5', className)}
        ref={selectRef}
        {...restAttrs}
      >
        <div className='relative w-full'>
          {name && <input type='hidden' name={name} value={value} />}
          {children}
        </div>
      </div>
    </SelectContext.Provider>
  );
};

export const SelectTrigger = ({
  children,
  className = '',
  chevronOff = false,
  onKeyDown,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { chevronOff?: boolean }) => {
  const { isOpen, setIsOpen, listboxId, triggerId, triggerRef } = useSelect();

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      setIsOpen(true);
    }
    onKeyDown?.(event);
  };

  return (
    <button
      ref={triggerRef}
      id={triggerId}
      type='button'
      className={cn(
        'border-gray-9e/10 text-gray-9e focus-visible:outline-purple-86 inline-flex w-full items-center justify-between rounded-[0.625rem] border px-5 py-2.5 text-lg font-medium transition-colors select-none hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-offset-2',
        className,
      )}
      onClick={() => setIsOpen(!isOpen)}
      onKeyDown={handleKeyDown}
      aria-haspopup='listbox'
      aria-expanded={isOpen}
      aria-controls={isOpen ? listboxId : undefined}
      {...props}
    >
      {children}
      {!chevronOff && (
        <LuChevronDown
          size={16}
          aria-hidden
          className={cn(
            'min-w-4 transition-transform duration-200',
            isOpen ? 'rotate-180' : '',
          )}
        />
      )}
    </button>
  );
};

export const SelectValue = ({
  placeholder = 'Выберите...',
}: {
  placeholder?: string;
}) => {
  const { selectedValueLabel } = useSelect();
  return (
    <span className='pointer-events-none truncate'>
      {selectedValueLabel || placeholder}
    </span>
  );
};

export const SelectContent = ({
  children,
  className = '',
  onKeyDown,
  ...props
}: HTMLAttributes<HTMLUListElement>) => {
  const { isOpen, close, listboxId, triggerId } = useSelect();
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const options = getOptions(listRef.current);
    const selected = options.find(
      (option) => option.getAttribute('aria-selected') === 'true',
    );
    (selected ?? options[0])?.focus();
  }, [isOpen]);

  const handleKeyDown = (event: KeyboardEvent<HTMLUListElement>) => {
    const options = getOptions(event.currentTarget);
    const activeIndex = options.indexOf(document.activeElement as HTMLElement);

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        options[Math.min(activeIndex + 1, options.length - 1)]?.focus();
        break;
      case 'ArrowUp':
        event.preventDefault();
        options[Math.max(activeIndex - 1, 0)]?.focus();
        break;
      case 'Home':
        event.preventDefault();
        options[0]?.focus();
        break;
      case 'End':
        event.preventDefault();
        options[options.length - 1]?.focus();
        break;
      case 'Escape':
        event.preventDefault();
        close();
        break;
      case 'Tab':
        close();
        break;
    }
    onKeyDown?.(event);
  };

  if (!isOpen) return null;

  return (
    <ul
      ref={listRef}
      id={listboxId}
      className={cn(
        'border-gray-9e/10 absolute z-50 mt-2 max-h-60 w-full list-none overflow-auto rounded-[0.625rem] border bg-[#16161a] p-1 shadow-xl',
        className,
      )}
      role='listbox'
      aria-labelledby={triggerId}
      onKeyDown={handleKeyDown}
      {...props}
    >
      {children}
    </ul>
  );
};

export const SelectItem = <T extends string | number>({
  children,
  value: itemValue,
  className = '',
  ...props
}: SelectItemProps<T> & LiHTMLAttributes<HTMLLIElement>) => {
  const { value: currentValue, onChange, close } = useSelect();
  const isSelected = currentValue === itemValue;

  const select = () => {
    close();
    onChange(itemValue);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLLIElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      select();
    }
  };

  return (
    <li
      className={cn(
        'focus-visible:outline-purple-86 flex cursor-pointer items-center justify-between rounded-md px-4 py-2 text-base text-gray-300 transition-colors select-none hover:bg-white/5 focus-visible:outline-2 focus-visible:-outline-offset-2',
        isSelected ? 'bg-white/5 font-medium text-white' : '',
        className,
      )}
      role='option'
      aria-selected={isSelected}
      tabIndex={-1}
      onKeyDown={handleKeyDown}
      onClick={select}
      {...props}
    >
      <span>{children}</span>
      {isSelected && (
        <LuCheck aria-hidden size={20} className='text-green-81' />
      )}
    </li>
  );
};
