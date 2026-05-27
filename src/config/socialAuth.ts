import { getNativeConfigValue } from '@/config/nativeConfig';

export const SOCIAL_AUTH_CONFIG = {
  google: {
    webClientId:
      getNativeConfigValue('googleWebClientId') ??
      '427236087294-2kav01nmm9ate3j69vslktaq7dsb7e6q.apps.googleusercontent.com',
  },
  apple: {
    androidClientId: getNativeConfigValue('appleAndroidClientId') ?? '',
    androidRedirectUri: getNativeConfigValue('appleAndroidRedirectUri') ?? '',
  },
  facebook: {
    appId: getNativeConfigValue('facebookAppId') ?? '895194523552101',
    clientToken: getNativeConfigValue('facebookClientToken') ?? '63fd65f9db4a3b979a8f53d59414d053',
  },
} as const;
