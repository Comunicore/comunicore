import {
  cloneElement,
  forwardRef,
  InputHTMLAttributes,
  isValidElement,
  ReactElement,
  ReactNode,
} from 'react';

import { cn } from '../lib/classNames';

type InputColor = 'transparent' | 'bordered' | 'ghost';

type InputSize = 'sm' | 'md' | 'lg';
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  icon?: ReactNode;
  inputSize?: InputSize;
  inputColor?: InputColor;
  actionIcon?: ReactNode;
  onActionIconClick?: () => void;
}

const colorStyles: Record<InputColor, string> = {
  transparent: '',
  ghost:
    'bg-dark-1b border border-gray-9e/10 bg-transparent outline-none text-gray-9e placeholder:text-gray-9e',
  bordered:
    'bg-dark-1b border border-gray-9e/10 bg-dark-1b  outline-none text-gray-9e placeholder:text-gray-9e',
};
const sizeStyles: Record<InputSize, string> = {
  sm: '',
  md: 'px-4 py-2.5 rounded-[10px]',
  lg: 'px-5 py-2.5 text-lg rounded-[10px] leading-1',
};

export const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const {
    className,
    icon,
    actionIcon,
    onActionIconClick,
    inputSize = 'md',
    inputColor = 'bordered',
    ...rest
  } = props;

  const renderIcon = (icon: ReactNode) => {
    if (isValidElement(icon)) {
      return cloneElement(icon as ReactElement<{ size?: number }>, {
        size: 20, // Стандартный размер по умолчанию
        ...(icon.props as object),
      });
    }
    return icon;
  };

  const commonClassName = cn(
    'flex items-center gap-x-2.5 w-full',
    colorStyles[inputColor],
    sizeStyles[inputSize],
    className,
  );

  return (
    <div className={commonClassName}>
      {icon && <div className='text-gray-9e shrink-0'>{renderIcon(icon)}</div>}
      <input
        className={cn(
          'text-light placeholder:text-light w-full min-w-0 flex-1 bg-transparent text-[16px] outline-none',
        )}
        ref={ref}
        id={rest.name}
        {...rest}
      />
      {actionIcon && (
        <button
          type='button'
          onClick={onActionIconClick}
          className='text-gray-9e hover:text-light ml-2.5 shrink-0 cursor-pointer transition-colors focus:outline-none'
        >
          {renderIcon(actionIcon)}
        </button>
      )}
    </div>
  );
});

Input.displayName = 'Input';
