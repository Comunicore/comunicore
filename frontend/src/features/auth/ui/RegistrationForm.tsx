'use client';

import { useRef, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import {
  LuCalendar,
  LuCircleUser,
  LuEye,
  LuEyeOff,
  LuLockKeyhole,
  LuMail,
} from 'react-icons/lu';
import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  registrationFormSchema,
  RegistrationFormTypes,
} from '../model/registration-form.schema';
import { useRegistration } from '../model/useRegistration';

import { AppRouter } from '@/shared/config/app-router';
import { getErrorMessage } from '@/shared/lib/helpers/getErrorMessage';
import { Button, Checkbox, ErrorMessage, FormField, Label } from '@/shared/ui';

const defaultValues = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  policy: false,
  birthDate: '',
};

export function RegistrationForm() {
  // Стейты для переключения видимости паролей
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RegistrationFormTypes>({
    resolver: zodResolver(registrationFormSchema),
    mode: 'onSubmit',
    defaultValues,
  });

  const dateInputRef = useRef<HTMLInputElement | null>(null);
  const { ref: birthDateRef, ...birthDateRest } = register('birthDate');

  const { mutate: registrationMutate, error, isPending } = useRegistration();

  const onSubmit: SubmitHandler<RegistrationFormTypes> = (data) => {
    const { confirmPassword: _, ...payload } = data; // ConfirmPassword не будет отправляться на сервер в payload
    void _; // Чтобы линтер не ругался на неиспользумую переменную.

    registrationMutate(
      { body: payload },
      {
        onSuccess: () => {
          reset(defaultValues);
        },
      },
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-y-7'>
      <section className='flex flex-col gap-y-5'>
        <FormField
          id='user-name'
          label='Имя пользователя'
          placeholder='Введите имя пользователя'
          helperText='От 3 до 40 символов. Только буквы, цифры и подчёркивания'
          icon={<LuCircleUser />}
          {...register('name')}
          error={errors.name}
        />
        <FormField
          id='user-email'
          label='Email'
          type='email'
          placeholder='Введите ваш email'
          icon={<LuMail />}
          {...register('email')}
          error={errors.email}
        />
        <FormField
          id='user-password'
          label='Пароль'
          type={showPassword ? 'text' : 'password'}
          placeholder='Введите ваш пароль'
          helperText='Минимум 8 символов, большие буквы и цифры'
          icon={<LuLockKeyhole />}
          actionIcon={showPassword ? <LuEyeOff /> : <LuEye />}
          onActionIconClick={() => setShowPassword((prev) => !prev)}
          {...register('password')}
          error={errors.password}
        />
        <FormField
          id='user-password-again'
          label='Повторите пароль'
          type={showConfirmPassword ? 'text' : 'password'}
          placeholder='Повторите ваш пароль'
          icon={<LuLockKeyhole />}
          actionIcon={showConfirmPassword ? <LuEyeOff /> : <LuEye />}
          onActionIconClick={() => setShowConfirmPassword((prev) => !prev)}
          {...register('confirmPassword')}
          error={errors.confirmPassword}
        />
        <FormField
          id='user-date'
          label='Дата рождения (необязательно)'
          placeholder='ДД.ММ.ГГГГ'
          type='date'
          actionIcon={<LuCalendar />}
          ref={(event) => {
            birthDateRef(event);
            dateInputRef.current = event;
          }}
          onActionIconClick={() => {
            dateInputRef.current?.showPicker?.();
          }}
          {...birthDateRest}
        />
      </section>

      <section className='flex flex-col gap-y-2'>
        <Label
          htmlFor='use-condition-agreement'
          className='flex items-center gap-x-2.5'
        >
          <Checkbox
            id='use-condition-agreement'
            size={24}
            {...register('policy')}
          />
          <p className='text-[12px] font-normal'>
            Я принимаю{' '}
            <Link href={AppRouter.policy.privacy} className='text-purple-86'>
              Пользовательское соглашение
            </Link>
            <br />и{' '}
            <Link
              href={AppRouter.policy.userAgreement}
              className='text-purple-86'
            >
              Политику конфиденциальности
            </Link>
          </p>
        </Label>
        {errors.policy?.message && (
          <ErrorMessage error={errors.policy.message} />
        )}
      </section>

      {error && (
        <ErrorMessage error={getErrorMessage(error)} className='text-center' />
      )}

      <Button type='submit' disabled={isPending} className='w-full'>
        {isPending ? 'Загрузка...' : 'Зарегистрироваться'}
      </Button>
    </form>
  );
}
