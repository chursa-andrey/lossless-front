import { NativeModules } from 'react-native';

type LosslessConfigModule = {
  apiBaseUrl?: string;
  googleWebClientId?: string;
  facebookAppId?: string;
  facebookClientToken?: string;
  appleAndroidClientId?: string;
  appleAndroidRedirectUri?: string;
};

const nativeConfig = NativeModules.LosslessConfig as LosslessConfigModule | undefined;

export function getNativeConfigValue(key: keyof LosslessConfigModule) {
  const value = nativeConfig?.[key]?.trim();
  return value ? value : undefined;
}
