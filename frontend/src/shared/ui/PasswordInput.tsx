'use client';

import { InputHTMLAttributes, memo, useState } from 'react';
import { FieldError } from 'react-hook-form';
import { LuEye, LuEyeOff, LuLockKeyhole } from 'react-icons/lu';

import { FormField } from './FormField';

interface PasswordInputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: FieldError;
  helperText?: string;
  label?: string;
}

export const PasswordInput = memo((props: PasswordInputProps) => {
  const { error, placeholder, helperText, id, label, ...rest } = props;
  const [showPassword, setShowPassword] = useState(false);

  return (
    <FormField
      id={id || 'user-password'}
      label={label}
      type={showPassword ? 'text' : 'password'}
      placeholder={placeholder}
      helperText={helperText}
      icon={<LuLockKeyhole />}
      actionIcon={showPassword ? <LuEyeOff /> : <LuEye />}
      onActionIconClick={() => setShowPassword((prev) => !prev)}
      {...rest}
      error={error}
    />
  );
});

PasswordInput.displayName = 'PasswordInput';
