import { useCallback, useState } from 'react';
import type { UseFormClearErrors, UseFormSetError } from 'react-hook-form';

import { getSocialAuthInput } from '@/features/auth/api/socialAuthProvider';
import {
  getEmailAuthErrorMessage,
  getSocialAuthErrorMessage,
} from '@/features/auth/errors/authErrorMessages';
import { useAuthStore } from '@/features/auth/store/authStore';
import type { SocialProvider } from '@/features/auth/types/auth';
import type { RegFormValues } from '@/features/auth/schemas/regSchema';

type UseRegScreenAuthParams = {
  clearErrors: UseFormClearErrors<RegFormValues>;
  setError: UseFormSetError<RegFormValues>;
  isSubmitting: boolean;
};

export function useRegScreenAuth({
  clearErrors,
  setError,
  isSubmitting,
}: UseRegScreenAuthParams) {
  const continueWithEmail = useAuthStore(state => state.continueWithEmail);
  const socialLogin = useAuthStore(state => state.socialLogin);
  const [socialSubmittingProvider, setSocialSubmittingProvider] = useState<SocialProvider | null>(null);

  const onSubmit = useCallback(
    async (data: RegFormValues) => {
      clearErrors('root');

      try {
        await continueWithEmail(data);
      } catch (error) {
        setError('root', {
          type: 'server',
          message: getEmailAuthErrorMessage(error),
        });
      }
    },
    [clearErrors, continueWithEmail, setError],
  );

  const handleSocialLogin = useCallback(
    async (provider: SocialProvider) => {
      clearErrors('root');
      setSocialSubmittingProvider(provider);

      try {
        const socialAuthInput = await getSocialAuthInput(provider);
        await socialLogin(socialAuthInput);
      } catch (error) {
        setError('root', {
          type: 'server',
          message: getSocialAuthErrorMessage(error),
        });
      } finally {
        setSocialSubmittingProvider(null);
      }
    },
    [clearErrors, setError, socialLogin],
  );

  return {
    handleSocialLogin,
    isAuthSubmitting: isSubmitting || socialSubmittingProvider !== null,
    onSubmit,
    socialSubmittingProvider,
  };
}
