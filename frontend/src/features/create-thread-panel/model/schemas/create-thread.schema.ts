import z from 'zod';

export const threadType = z.enum(['discussion', 'question', 'guide']);

export const createThreadSchema = z.object({
  chapter: z.object({
    id: z.string().trim().min(1, { message: 'Выберите раздел' }),
    name: z
      .string()
      .trim()
      .min(1, { message: 'Название раздела не может быть пустым' }),
  }),

  type: threadType,

  title: z
    .string()
    .trim()
    .min(5, { message: 'Заголовок должен содержать минимум 5 символов' })
    .max(100, { message: 'Заголовок не должен превышать 100 символов' }),

  description: z
    .string()
    .trim()
    // .min(5, { message: 'Описание должно содержать минимум 5 символов' })
    // .max(5000, { message: 'Описание не должно превышать 5000 символов' })
    .optional(),

  tags: z.array(z.string().trim()).optional(),

  fileUrl: z
    .array(
      z.string().superRefine((url) => {
        if (!url) return;
        try {
          new URL(url);
        } catch {
          throw new Error('Некорректный URL файла');
        }
      }),
    )
    .optional(),
});

export type CreateThreadTypes = z.infer<typeof createThreadSchema>;
export type ThreadTypeOption = z.infer<typeof threadType>;
