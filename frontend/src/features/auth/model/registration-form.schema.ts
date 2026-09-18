import * as z from 'zod';

import { passwordSchema } from '@/shared/lib/schemas/password.schema';

export const registrationFormSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, { message: 'Введите имя' })
      .max(50, { message: 'Имя слишком длинное' }),
    email: z
      .string()
      .trim()
      .toLowerCase()
      .min(1, { message: 'Введите почту' })
      .email({ message: 'Неверный формат почты' }),
    password: passwordSchema,
    confirmPassword: z.string().min(1, { message: 'Подтвердите пароль' }),
    birthDate: z.string().optional().or(z.literal('')),
    policy: z.boolean().refine((val) => val, {
      message: 'Условия должны быть приняты',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Пароли не совпадают',
    path: ['confirmPassword'],
  });

export type RegistrationFormTypes = z.infer<typeof registrationFormSchema>;
