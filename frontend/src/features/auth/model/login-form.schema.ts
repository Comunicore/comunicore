import { z } from 'zod';

export const loginFormSchema = z.object({
  login: z
    .string()
    .trim()
    .min(1, 'Заполните поле')
    .max(255, 'Слишком длинное значение')
    .refine(
      (value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        return emailRegex.test(value) || value.length >= 3;
      },
      {
        message: 'Введите имя пользователя или корректный email',
      },
    )
    .transform((value) => value.toLowerCase()),
  password: z.string().trim().min(1, 'Введите пароль'),
});

export type LoginFormTypes = z.infer<typeof loginFormSchema>;
