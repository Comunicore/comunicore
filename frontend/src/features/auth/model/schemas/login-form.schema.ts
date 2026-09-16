import { z } from 'zod';

const emailSchema = z.email('Введите корректный email').toLowerCase();

const usernameSchema = z
  .string()
  .trim()
  .min(3, 'Имя пользователя должно быть от 3 символов')
  .max(255, 'Слишком длинное значение')
  .toLowerCase();

export const loginFormSchema = z.object({
  login: z.union([emailSchema, usernameSchema], {
    error: () => ({
      message: 'Введите имя пользователя или корректный email',
    }),
  }),
  password: z.string().trim().min(1, 'Введите пароль'),
});

export type LoginFormTypes = z.infer<typeof loginFormSchema>;
