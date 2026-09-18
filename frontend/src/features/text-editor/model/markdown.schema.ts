import z from 'zod';

export const markdownSchema = z.object({
  markdown: z.string().min(1, { message: 'Содержимое не может быть пустым.' }),
});

export type MarkDownSchema = z.infer<typeof markdownSchema>;
