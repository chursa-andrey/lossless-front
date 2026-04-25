export type AuthStatus = 'bootstrapping' | 'guest' | 'authenticated';

export type AuthUser = {
  id: number;
  email: string;
  displayName: string;
  roles: string[];
  createdAt: string;
};

export type TokenPairResponse = {
  accessToken: string;
  refreshToken: string;
};

export type AuthResponse = TokenPairResponse & {
  user: AuthUser;
};

export type ContinueWithEmailInput = {
  email: string;
  password: string;
  displayName?: string;
};

export type SocialProvider = 'google' | 'apple' | 'facebook';

export type SocialAuthInput = {
  provider: SocialProvider;
  providerToken: string;
  displayName?: string;
};

export type ApiErrorPayload = {
  timestamp?: string;
  status?: number;
  error?: string;
  code?: string;
  path?: string;
  message?: string;
};

export type AuthSessionState = {
  status: AuthStatus;
  accessToken: string | null;
  user: AuthUser | null;
};
