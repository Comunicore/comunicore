import z from 'zod';

export const postType = z.enum(['discussion', 'question', 'guide']);

export const createPostSchema = z.object({
  category: z.object({
    id: z.string().trim().min(1, { message: 'Выберите категорию' }),
    name: z
      .string()
      .trim()
      .min(1, { message: 'Название категории не может быть пустым' }),
  }),

  type: postType,

  title: z
    .string()
    .trim()
    .min(5, { message: 'Заголовок должен содержать минимум 5 символов' })
    .max(100, { message: 'Заголовок не должен превышать 100 символов' }),

  description: z
    .string()
    .trim()
    .min(5, { message: 'Описание должно содержать минимум 5 символов' })
    .max(5000, { message: 'Описание не должно превышать 5000 символов' })
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

export type CreatePostTypes = z.infer<typeof createPostSchema>;
export type PostTypeOption = z.infer<typeof postType>;
