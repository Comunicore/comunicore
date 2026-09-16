'use client';

import { SubmitHandler, useForm } from 'react-hook-form';
import { LuUser } from 'react-icons/lu';
import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';

import { useLogin } from '../../model/hooks/useLogin';
import {
  loginFormSchema,
  type LoginFormTypes,
} from '../../model/schemas/login-form.schema';

import { AppRouter } from '@/shared/config/app-router';
import { getErrorMessage } from '@/shared/lib/helpers/getErrorMessage';
import {
  Button,
  Checkbox,
  ErrorMessage,
  FormField,
  Label,
  PasswordInput,
} from '@/shared/ui';

const defaultValues = {
  login: '',
  password: '',
};

export function LoginForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LoginFormTypes>({
    resolver: zodResolver(loginFormSchema),
    defaultValues,
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
  });

  const { mutate: loginMutate, isPending, error: serverError } = useLogin();

  const onSubmit: SubmitHandler<LoginFormTypes> = (data) => {
    loginMutate(
      { body: data },
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
          id='user-login-email'
          label='Email или имя пользователя'
          placeholder='Введите имя пользователя'
          icon={<LuUser size={20} />}
          {...register('login')}
          error={errors.login}
          disabled={isPending}
        />
        <PasswordInput
          id='user-login-password'
          label='Пароль'
          placeholder='Введите ваш пароль'
          {...register('password')}
          error={errors.password}
          disabled={isPending}
        />
      </section>

      <section className='flex justify-between gap-x-2'>
        <Label htmlFor='remember-login' className='flex items-center gap-x-2.5'>
          <Checkbox id='remember-login' size={24} />
          <p className='text-sm font-normal'>Запомнить меня</p>
        </Label>
        <Link
          href={AppRouter.recovery.password}
          className='text-purple-86 text-sm'
        >
          Забыли пароль?
        </Link>
      </section>

      {serverError && (
        <ErrorMessage
          className='text-center'
          error={getErrorMessage(serverError)}
        />
      )}

      <Button type='submit' disabled={isPending} className='w-full'>
        {isPending ? 'Загрузка...' : 'Войти'}
      </Button>

      {serverError && <ErrorMessage error={getErrorMessage(serverError)} />}
    </form>
  );
}
