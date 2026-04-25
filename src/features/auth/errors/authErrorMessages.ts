import { ApiClientError } from '@/features/auth/api/apiClient';
import { SocialAuthProviderError } from '@/features/auth/api/socialAuthProvider';

export function getEmailAuthErrorMessage(error: unknown) {
  if (!(error instanceof ApiClientError)) {
    return 'Не удалось продолжить. Попробуйте ещё раз.';
  }

  if (error.code === 'NETWORK_ERROR' || error.status === 0) {
    return 'Не удалось связаться с сервером. Проверьте подключение и попробуйте ещё раз.';
  }

  if (error.status === 401) {
    return 'Неверный email или пароль.';
  }

  if (error.status === 409 && error.code === 'PASSWORD_LOGIN_NOT_AVAILABLE') {
    return 'Для этого аккаунта вход по паролю недоступен. Используйте вход через соцсети.';
  }

  if (error.status === 400 || error.status === 422) {
    return 'Проверьте email и пароль. Возможно, данные не соответствуют требованиям.';
  }

  return 'Не удалось продолжить. Попробуйте ещё раз.';
}

export function getSocialAuthErrorMessage(error: unknown) {
  if (error instanceof SocialAuthProviderError) {
    switch (error.code) {
      case 'PROVIDER_CANCELLED':
        return 'Вход через соцсеть отменён.';
      case 'PROVIDER_NOT_CONFIGURED':
        return 'Вход через эту соцсеть пока не настроен.';
      case 'PROVIDER_UNAVAILABLE':
        return 'Вход через эту соцсеть недоступен на этом устройстве.';
      case 'PROVIDER_TOKEN_MISSING':
      case 'PROVIDER_FAILED':
      default:
        return 'Не удалось получить токен провайдера. Попробуйте ещё раз.';
    }
  }

  if (!(error instanceof ApiClientError)) {
    return 'Не удалось войти через соцсеть. Попробуйте ещё раз.';
  }

  if (error.code === 'NETWORK_ERROR' || error.status === 0) {
    return 'Не удалось связаться с сервером. Проверьте подключение и попробуйте ещё раз.';
  }

  if (error.code === 'INVALID_SOCIAL_TOKEN' || error.status === 401) {
    return 'Токен соцсети не прошёл проверку. Попробуйте войти ещё раз.';
  }

  if (error.code === 'SOCIAL_EMAIL_REQUIRED') {
    return 'Провайдер не передал email. Разрешите доступ к email и попробуйте ещё раз.';
  }

  if (error.code === 'SOCIAL_EMAIL_NOT_VERIFIED') {
    return 'Email не подтверждён провайдером, поэтому мы не можем безопасно связать аккаунт.';
  }

  if (error.code === 'SOCIAL_AUTH_MISCONFIGURED') {
    return 'Вход через эту соцсеть пока не настроен на сервере.';
  }

  return 'Не удалось войти через соцсеть. Попробуйте ещё раз.';
}
