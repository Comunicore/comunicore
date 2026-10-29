import { forwardRef, InputHTMLAttributes, ReactNode } from 'react';
import { FieldError } from 'react-hook-form';

import { cn } from '../lib/classNames';

import { ErrorMessage } from './ErrorMessage';
import { Input } from './Input';
import { Label } from './Label';

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: ReactNode;
  error?: FieldError;
  icon?: ReactNode;
  helperText?: ReactNode;
  actionIcon?: ReactNode;
  actionIconLabel?: string;
  onActionIconClick?: () => void;
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  (
    {
      className,
      label,
      error,
      icon,
      helperText,
      actionIcon,
      actionIconLabel,
      onActionIconClick,
      id,
      ...inputProps
    },
    ref,
  ) => {
    const fieldId = id ?? inputProps.name;
    const hasError = Boolean(error?.message);
    const showHelper = Boolean(helperText) && !hasError;
    const errorId = fieldId && hasError ? `${fieldId}-error` : undefined;
    const helperId = fieldId && showHelper ? `${fieldId}-helper` : undefined;

    return (
      <div className={cn('flex flex-col gap-y-2', className)}>
        {label && <Label htmlFor={fieldId}>{label}</Label>}
        <Input
          ref={ref}
          id={fieldId}
          icon={icon}
          actionIcon={actionIcon}
          actionIconLabel={actionIconLabel}
          onActionIconClick={onActionIconClick}
          aria-invalid={hasError || undefined}
          aria-describedby={errorId ?? helperId}
          {...inputProps}
        />
        {showHelper && (
          <p id={helperId} className='text-gray-9e text-sm'>
            {helperText}
          </p>
        )}
        {error?.message && <ErrorMessage id={errorId} error={error.message} />}
      </div>
    );
  },
);

FormField.displayName = 'FormField';
