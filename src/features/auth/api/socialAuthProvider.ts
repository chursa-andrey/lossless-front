import { Platform } from 'react-native';
import {
  GoogleSignin,
  statusCodes as googleStatusCodes,
} from '@react-native-google-signin/google-signin';
import appleAuth, { appleAuthAndroid } from '@invertase/react-native-apple-authentication';
import { AccessToken, LoginManager, Settings } from 'react-native-fbsdk-next';

import { SOCIAL_AUTH_CONFIG } from '@/config/socialAuth';
import type { SocialAuthInput, SocialProvider } from '@/features/auth/types/auth';

export class SocialAuthProviderError extends Error {
  code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = 'SocialAuthProviderError';
    this.code = code;
  }
}

let googleConfigured = false;
let facebookConfigured = false;

export async function getSocialAuthInput(provider: SocialProvider): Promise<SocialAuthInput> {
  switch (provider) {
    case 'google':
      return signInWithGoogle();
    case 'apple':
      return signInWithApple();
    case 'facebook':
      return signInWithFacebook();
    default:
      return assertNever(provider);
  }
}

async function signInWithGoogle(): Promise<SocialAuthInput> {
  ensureGoogleConfigured();

  try {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    const response = await GoogleSignin.signIn();
    if (response.type === 'cancelled') {
      throw new SocialAuthProviderError('PROVIDER_CANCELLED', 'Google sign-in was cancelled');
    }

    const providerToken = response.data.idToken ?? (await GoogleSignin.getTokens()).idToken;
    if (!providerToken) {
      throw new SocialAuthProviderError('PROVIDER_TOKEN_MISSING', 'Google did not return an id token');
    }

    return withOptionalDisplayName('google', providerToken, response.data.user.name ?? undefined);
  } catch (error) {
    if (getErrorCode(error) === googleStatusCodes.SIGN_IN_CANCELLED) {
      throw new SocialAuthProviderError('PROVIDER_CANCELLED', 'Google sign-in was cancelled');
    }
    if (error instanceof SocialAuthProviderError) {
      throw error;
    }
    throw new SocialAuthProviderError('PROVIDER_FAILED', 'Google sign-in failed');
  }
}

async function signInWithApple(): Promise<SocialAuthInput> {
  if (Platform.OS === 'ios') {
    return signInWithAppleIos();
  }

  if (Platform.OS === 'android') {
    return signInWithAppleAndroid();
  }

  throw new SocialAuthProviderError('PROVIDER_UNAVAILABLE', 'Apple sign-in is not available on this platform');
}

async function signInWithAppleIos(): Promise<SocialAuthInput> {
  try {
    const response = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
    });

    if (!response.identityToken) {
      throw new SocialAuthProviderError('PROVIDER_TOKEN_MISSING', 'Apple did not return an identity token');
    }

    return withOptionalDisplayName('apple', response.identityToken, buildAppleIosDisplayName(response.fullName));
  } catch (error) {
    if (getErrorCode(error) === appleAuth.Error.CANCELED) {
      throw new SocialAuthProviderError('PROVIDER_CANCELLED', 'Apple sign-in was cancelled');
    }
    if (error instanceof SocialAuthProviderError) {
      throw error;
    }
    throw new SocialAuthProviderError('PROVIDER_FAILED', 'Apple sign-in failed');
  }
}

async function signInWithAppleAndroid(): Promise<SocialAuthInput> {
  const { androidClientId, androidRedirectUri } = SOCIAL_AUTH_CONFIG.apple;
  if (!appleAuthAndroid.isSupported) {
    throw new SocialAuthProviderError('PROVIDER_UNAVAILABLE', 'Apple sign-in is not available on this device');
  }
  if (!androidClientId || !androidRedirectUri) {
    throw new SocialAuthProviderError('PROVIDER_NOT_CONFIGURED', 'Apple sign-in is not configured for Android');
  }

  try {
    appleAuthAndroid.configure({
      clientId: androidClientId,
      redirectUri: androidRedirectUri,
      responseType: appleAuthAndroid.ResponseType.ALL,
      scope: appleAuthAndroid.Scope.ALL,
      nonce: createNonce(),
    });

    const response = await appleAuthAndroid.signIn();
    if (!response.id_token) {
      throw new SocialAuthProviderError('PROVIDER_TOKEN_MISSING', 'Apple did not return an identity token');
    }

    return withOptionalDisplayName('apple', response.id_token, buildAppleAndroidDisplayName(response.user?.name));
  } catch (error) {
    if (getErrorCode(error) === appleAuthAndroid.Error.SIGNIN_CANCELLED) {
      throw new SocialAuthProviderError('PROVIDER_CANCELLED', 'Apple sign-in was cancelled');
    }
    if (error instanceof SocialAuthProviderError) {
      throw error;
    }
    throw new SocialAuthProviderError('PROVIDER_FAILED', 'Apple sign-in failed');
  }
}

async function signInWithFacebook(): Promise<SocialAuthInput> {
  ensureFacebookConfigured();

  const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);
  if (result.isCancelled) {
    throw new SocialAuthProviderError('PROVIDER_CANCELLED', 'Facebook sign-in was cancelled');
  }

  const accessToken = await AccessToken.getCurrentAccessToken();
  if (!accessToken?.accessToken) {
    throw new SocialAuthProviderError('PROVIDER_TOKEN_MISSING', 'Facebook did not return an access token');
  }

  return {
    provider: 'facebook',
    providerToken: accessToken.accessToken,
  };
}

function ensureGoogleConfigured() {
  if (googleConfigured) {
    return;
  }

  const { webClientId } = SOCIAL_AUTH_CONFIG.google;
  if (!webClientId) {
    throw new SocialAuthProviderError('PROVIDER_NOT_CONFIGURED', 'Google sign-in is not configured');
  }

  GoogleSignin.configure({
    webClientId,
    scopes: ['email', 'profile'],
  });
  googleConfigured = true;
}

function ensureFacebookConfigured() {
  if (facebookConfigured) {
    return;
  }

  const { appId, clientToken } = SOCIAL_AUTH_CONFIG.facebook;
  if (!appId || !clientToken) {
    throw new SocialAuthProviderError('PROVIDER_NOT_CONFIGURED', 'Facebook sign-in is not configured');
  }

  Settings.setAppID(appId);
  Settings.setClientToken(clientToken);
  Settings.initializeSDK();
  facebookConfigured = true;
}

function withOptionalDisplayName(
  provider: SocialProvider,
  providerToken: string,
  displayName?: string,
): SocialAuthInput {
  const normalizedDisplayName = displayName?.trim();
  if (!normalizedDisplayName) {
    return { provider, providerToken };
  }

  return { provider, providerToken, displayName: normalizedDisplayName };
}

function buildAppleIosDisplayName(
  fullName: Awaited<ReturnType<typeof appleAuth.performRequest>>['fullName'],
) {
  if (!fullName) {
    return undefined;
  }

  return [fullName.givenName, fullName.familyName].filter(Boolean).join(' ');
}

function buildAppleAndroidDisplayName(name: { firstName?: string; lastName?: string } | undefined) {
  if (!name) {
    return undefined;
  }

  return [name.firstName, name.lastName].filter(Boolean).join(' ');
}

function createNonce() {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function getErrorCode(error: unknown) {
  if (error && typeof error === 'object' && 'code' in error) {
    return String((error as { code?: unknown }).code);
  }
  return undefined;
}

function assertNever(value: never): never {
  throw new Error(`Unhandled social auth provider: ${value}`);
}
