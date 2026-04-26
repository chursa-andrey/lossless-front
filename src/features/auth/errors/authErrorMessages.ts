import { ApiClientError } from '@/features/auth/api/apiClient';
import { SocialAuthProviderError } from '@/features/auth/api/socialAuthProvider';
import i18n from '@/i18n';

export function getEmailAuthErrorMessage(error: unknown) {
  if (!(error instanceof ApiClientError)) {
    return i18n.t('auth.errors.continueGeneric');
  }

  if (error.code === 'NETWORK_ERROR' || error.status === 0) {
    return i18n.t('auth.errors.network');
  }

  if (error.status === 401) {
    return i18n.t('auth.errors.invalidCredentials');
  }

  if (error.status === 409 && error.code === 'PASSWORD_LOGIN_NOT_AVAILABLE') {
    return i18n.t('auth.errors.passwordLoginNotAvailable');
  }

  if (error.status === 400 || error.status === 422) {
    return i18n.t('auth.errors.invalidAuthPayload');
  }

  return i18n.t('auth.errors.continueGeneric');
}

export function getSocialAuthErrorMessage(error: unknown) {
  if (error instanceof SocialAuthProviderError) {
    switch (error.code) {
      case 'PROVIDER_CANCELLED':
        return i18n.t('auth.errors.socialCancelled');
      case 'PROVIDER_NOT_CONFIGURED':
        return i18n.t('auth.errors.socialNotConfigured');
      case 'PROVIDER_UNAVAILABLE':
        return i18n.t('auth.errors.socialUnavailable');
      case 'PROVIDER_TOKEN_MISSING':
      case 'PROVIDER_FAILED':
      default:
        return i18n.t('auth.errors.socialTokenMissing');
    }
  }

  if (!(error instanceof ApiClientError)) {
    return i18n.t('auth.errors.socialGeneric');
  }

  if (error.code === 'NETWORK_ERROR' || error.status === 0) {
    return i18n.t('auth.errors.network');
  }

  if (error.code === 'INVALID_SOCIAL_TOKEN' || error.status === 401) {
    return i18n.t('auth.errors.invalidSocialToken');
  }

  if (error.code === 'SOCIAL_EMAIL_REQUIRED') {
    return i18n.t('auth.errors.socialEmailRequired');
  }

  if (error.code === 'SOCIAL_EMAIL_NOT_VERIFIED') {
    return i18n.t('auth.errors.socialEmailNotVerified');
  }

  if (error.code === 'SOCIAL_AUTH_MISCONFIGURED') {
    return i18n.t('auth.errors.socialMisconfigured');
  }

  return i18n.t('auth.errors.socialGeneric');
}
