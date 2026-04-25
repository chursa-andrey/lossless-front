import { apiRequest, jsonRequestInit, withAuthHeaders } from '@/features/auth/api/apiClient';
import type {
  AuthResponse,
  AuthUser,
  ContinueWithEmailInput,
  SocialAuthInput,
  TokenPairResponse,
} from '@/features/auth/types/auth';

export const authApi = {
  continueWithEmail(payload: ContinueWithEmailInput) {
    return apiRequest<AuthResponse>(
      '/api/v1/auth/continue',
      jsonRequestInit(payload, {
        method: 'POST',
      }),
    );
  },

  socialLogin({ provider, providerToken, displayName }: SocialAuthInput) {
    return apiRequest<AuthResponse>(
      `/api/v1/auth/social/${provider}`,
      jsonRequestInit(
        {
          providerToken,
          displayName,
        },
        {
          method: 'POST',
        },
      ),
    );
  },

  refresh(refreshToken: string) {
    return apiRequest<TokenPairResponse>(
      '/api/v1/auth/refresh',
      jsonRequestInit(
        {
          refreshToken,
        },
        {
          method: 'POST',
        },
      ),
    );
  },

  logout(refreshToken: string) {
    return apiRequest<void>(
      '/api/v1/auth/logout',
      jsonRequestInit(
        {
          refreshToken,
        },
        {
          method: 'POST',
        },
      ),
    );
  },

  getCurrentUser(accessToken: string) {
    return apiRequest<AuthUser>('/api/v1/me', withAuthHeaders(accessToken));
  },
};
