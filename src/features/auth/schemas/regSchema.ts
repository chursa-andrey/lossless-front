import { z } from 'zod';

export const regSchema = z.object({
  email: z.string().trim().min(1, 'Введите email').email('Введите валидный email'),
  password: z
    .string()
    .min(1, 'Введите пароль')
    .min(8, 'Пароль должен содержать минимум 8 символов')
    .regex(/[A-Z]/, 'Добавьте хотя бы 1 заглавную букву')
    .regex(/[0-9]/, 'Добавьте хотя бы 1 цифру'),
});

export type RegFormValues = z.infer<typeof regSchema>;
