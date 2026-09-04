'use client';

import {
  ButtonHTMLAttributes,
  HTMLAttributes,
  LiHTMLAttributes,
  useRef,
} from 'react';
import { LuCheck, LuChevronDown } from 'react-icons/lu';

import { useModal } from '../../../hooks/useModal';
import { cn } from '../../../lib/classNames';
import { SelectContext } from '../model/context/select-context';
import { useSelect } from '../model/hooks/useSelect';

import { SelectContainerProps, SelectItemProps } from './Select-props';

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
  const { modalOpen, setModalOpen } = useModal(selectRef);

  const selectedOption = options.find((opt) => opt.value === value);
  const selectedValueLabel = selectedOption ? selectedOption.label : '';

  return (
    <SelectContext.Provider
      value={{
        isOpen: modalOpen,
        setIsOpen: setModalOpen,
        value,
        onChange: (val) => onChange(val as T),
        selectedValueLabel,
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
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) => {
  const { isOpen, setIsOpen } = useSelect();

  return (
    <button
      type='button'
      className={cn(
        'border-gray-9e/10 text-gray-9e inline-flex w-full items-center justify-between rounded-[0.625rem] border px-5 py-2.5 text-lg font-medium transition-colors select-none hover:bg-white/5',
        className,
      )}
      onClick={() => setIsOpen(!isOpen)}
      aria-haspopup='listbox'
      aria-expanded={isOpen}
      {...props}
    >
      {children}
      <LuChevronDown
        size={16}
        className={cn(
          'min-w-4 transition-transform duration-200',
          isOpen ? 'rotate-180' : '',
        )}
      />
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
  ...props
}: HTMLAttributes<HTMLUListElement>) => {
  const { isOpen } = useSelect();

  if (!isOpen) return null;

  return (
    <ul
      inert={!isOpen ? true : undefined}
      className={cn(
        'border-gray-9e/10 absolute z-50 mt-2 max-h-60 w-full list-none overflow-auto rounded-[0.625rem] border bg-[#16161a] p-1 shadow-xl',
        className,
      )}
      role='listbox'
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
  const { value: currentValue, onChange, setIsOpen } = useSelect();
  const isSelected = currentValue === itemValue;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onChange(itemValue);
      setTimeout(() => setIsOpen(false), 0);
    }
  };

  return (
    <li
      className={cn(
        'flex cursor-pointer items-center justify-between rounded-md px-4 py-2 text-base text-gray-300 transition-colors select-none hover:bg-white/5',
        isSelected ? 'bg-white/5 font-medium text-white' : '',
        className,
      )}
      role='option'
      aria-selected={isSelected}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onClick={() => {
        onChange(itemValue);
        setTimeout(() => setIsOpen(false), 0);
      }}
      {...props}
    >
      <span>{children}</span>
      {isSelected && <LuCheck role='img' size={20} className='text-green-81' />}
    </li>
  );
};
