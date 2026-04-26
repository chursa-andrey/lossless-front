import { z } from 'zod';
import type { TFunction } from 'i18next';

export function createRegSchema(t: TFunction) {
  return z.object({
    email: z
      .string()
      .trim()
      .min(1, t('auth.reg.validation.emailRequired'))
      .max(320, t('auth.reg.validation.emailMax'))
      .email(t('auth.reg.validation.emailInvalid')),
    password: z
      .string()
      .min(1, t('auth.reg.validation.passwordRequired'))
      .min(8, t('auth.reg.validation.passwordMin'))
      .max(128, t('auth.reg.validation.passwordMax')),
  });
}

export type RegFormValues = z.infer<ReturnType<typeof createRegSchema>>;
