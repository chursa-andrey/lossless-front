import { z } from 'zod';

export const regSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Введите email')
    .max(320, 'Email должен содержать не больше 320 символов')
    .email('Введите валидный email'),
  password: z
    .string()
    .min(1, 'Введите пароль')
    .min(8, 'Пароль должен содержать минимум 8 символов')
    .max(128, 'Пароль должен содержать не больше 128 символов'),
});

export type RegFormValues = z.infer<typeof regSchema>;
