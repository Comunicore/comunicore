import {
  cloneElement,
  ComponentPropsWithRef,
  isValidElement,
  ReactElement,
  ReactNode,
} from 'react';

import { cn } from '../lib/classNames';

type InputColor = 'transparent' | 'bordered' | 'ghost';

type InputSize = 'sm' | 'md' | 'lg';

interface BaseProps {
  className?: string;
  icon?: ReactNode;
  inputSize?: InputSize;
  inputColor?: InputColor;
  actionIcon?: ReactNode;
  actionIconLabel?: string;
  onActionIconClick?: () => void;
}

type InputFieldProps = BaseProps &
  ComponentPropsWithRef<'input'> & { isTextarea?: false };

type TextareaProps = ComponentPropsWithRef<'textarea'> & { maxRows?: number };

type TextareaFieldProps = BaseProps & TextareaProps & { isTextarea: true };

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

const fieldStyles =
  'text-light placeholder:text-light w-full min-w-0 flex-1 bg-transparent text-[16px] outline-none';

const renderIcon = (icon: ReactNode) => {
  if (isValidElement(icon)) {
    return cloneElement(icon as ReactElement<{ size?: number }>, {
      size: 20,
      ...(icon.props as object),
    });
  }
  return icon;
};

export function Input(props: InputFieldProps): ReactElement;
export function Input(props: TextareaFieldProps): ReactElement;
export function Input(props: InputFieldProps | TextareaFieldProps) {
  const {
    className,
    icon,
    actionIcon,
    actionIconLabel,
    onActionIconClick,
    inputSize = 'md',
    inputColor = 'bordered',
    isTextarea,
    ...fieldProps
  } = props;

  const commonClassName = cn(
    'flex gap-x-2.5 w-full',
    isTextarea ? 'items-end' : 'items-center',
    colorStyles[inputColor],
    sizeStyles[inputSize],
    className,
  );

  const iconAlignment = isTextarea ? 'mb-0.5' : '';

  const renderTextarea = () => {
    const {
      rows = 1,
      maxRows = 20,
      style,
      ...textareaProps
    } = fieldProps as TextareaProps;

    return (
      <textarea
        className={cn(
          fieldStyles,
          'field-sizing-content resize-none leading-normal',
        )}
        id={textareaProps.name}
        rows={rows}
        style={{
          minHeight: `${rows}lh`,
          maxHeight: `${Math.max(rows, maxRows)}lh`,
          ...style,
        }}
        {...textareaProps}
      />
    );
  };

  return (
    <div className={commonClassName}>
      {icon && (
        <div className={cn('text-gray-9e shrink-0', iconAlignment)} aria-hidden>
          {renderIcon(icon)}
        </div>
      )}
      {isTextarea ? (
        renderTextarea()
      ) : (
        <input
          className={fieldStyles}
          id={fieldProps.name}
          {...(fieldProps as ComponentPropsWithRef<'input'>)}
        />
      )}
      {actionIcon && (
        <button
          type='button'
          onClick={onActionIconClick}
          aria-label={actionIconLabel}
          className={cn(
            'text-gray-9e hover:text-light focus-visible:outline-purple-86 ml-2.5 shrink-0 cursor-pointer rounded-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2',
            iconAlignment,
          )}
        >
          {renderIcon(actionIcon)}
        </button>
      )}
    </div>
  );
}
