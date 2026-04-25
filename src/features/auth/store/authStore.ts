import { create } from 'zustand';

import { apiRequest, ApiClientError, withAuthHeaders } from '@/features/auth/api/apiClient';
import { authApi } from '@/features/auth/api/authApi';
import { tokenStorage } from '@/features/auth/storage/tokenStorage';
import type {
  AuthResponse,
  AuthSessionState,
  AuthUser,
  ContinueWithEmailInput,
  SocialAuthInput,
} from '@/features/auth/types/auth';

type AuthSessionSlice = AuthSessionState & {
  isBootstrapping: boolean;
  isAuthenticated: boolean;
};

type AuthStore = AuthSessionSlice & {
  continueWithEmail: (input: ContinueWithEmailInput) => Promise<AuthUser>;
  socialLogin: (input: SocialAuthInput) => Promise<AuthUser>;
  refreshSession: () => Promise<string | null>;
  getAccessToken: () => Promise<string | null>;
  authenticatedRequest: <T>(path: string, init?: RequestInit) => Promise<T>;
  logout: () => Promise<void>;
  restoreSession: () => Promise<void>;
  setGuestSession: () => Promise<void>;
  applyAuthResponse: (response: AuthResponse) => Promise<AuthUser>;
};

const toSessionSlice = ({ status, accessToken, user }: AuthSessionState): AuthSessionSlice => ({
  status,
  accessToken,
  user,
  isBootstrapping: status === 'bootstrapping',
  isAuthenticated: status === 'authenticated',
});

const bootstrappingSession = toSessionSlice({
  status: 'bootstrapping',
  accessToken: null,
  user: null,
});

const guestSession = toSessionSlice({
  status: 'guest',
  accessToken: null,
  user: null,
});

let refreshPromise: Promise<string | null> | null = null;
let sessionRevision = 0;

function bumpSessionRevision() {
  sessionRevision += 1;
  return sessionRevision;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  ...bootstrappingSession,

  setGuestSession: async () => {
    bumpSessionRevision();
    refreshPromise = null;
    await tokenStorage.clearRefreshToken();
    set(guestSession);
  },

  applyAuthResponse: async ({ accessToken, refreshToken, user }) => {
    bumpSessionRevision();
    await tokenStorage.setRefreshToken(refreshToken);
    set(
      toSessionSlice({
        status: 'authenticated',
        accessToken,
        user,
      }),
    );

    return user;
  },

  restoreSession: async () => {
    const restoreRevision = sessionRevision;
    const refreshToken = await tokenStorage.getRefreshToken();

    if (!refreshToken) {
      bumpSessionRevision();
      set(guestSession);
      return;
    }

    try {
      const tokenPair = await authApi.refresh(refreshToken);
      const user = await authApi.getCurrentUser(tokenPair.accessToken);

      await tokenStorage.setRefreshToken(tokenPair.refreshToken);
      if (sessionRevision !== restoreRevision) {
        return;
      }

      bumpSessionRevision();
      set(
        toSessionSlice({
          status: 'authenticated',
          accessToken: tokenPair.accessToken,
          user,
        }),
      );
    } catch {
      await get().setGuestSession();
    }
  },

  continueWithEmail: async input => {
    const response = await authApi.continueWithEmail(input);
    return get().applyAuthResponse(response);
  },

  socialLogin: async input => {
    const response = await authApi.socialLogin(input);
    return get().applyAuthResponse(response);
  },

  refreshSession: async () => {
    if (refreshPromise) {
      return refreshPromise;
    }

    refreshPromise = (async () => {
      const currentRevision = sessionRevision;
      const refreshToken = await tokenStorage.getRefreshToken();

      if (!refreshToken) {
        await get().setGuestSession();
        return null;
      }

      try {
        const tokenPair = await authApi.refresh(refreshToken);
        const nextUser = get().user ?? (await authApi.getCurrentUser(tokenPair.accessToken));

        await tokenStorage.setRefreshToken(tokenPair.refreshToken);
        if (sessionRevision !== currentRevision) {
          return null;
        }

        bumpSessionRevision();
        set(
          toSessionSlice({
            status: 'authenticated',
            accessToken: tokenPair.accessToken,
            user: nextUser,
          }),
        );

        return tokenPair.accessToken;
      } catch {
        await get().setGuestSession();
        return null;
      } finally {
        refreshPromise = null;
      }
    })();

    return refreshPromise;
  },

  getAccessToken: async () => get().accessToken ?? get().refreshSession(),

  authenticatedRequest: async <T,>(path: string, init?: RequestInit) => {
    const accessToken = await get().getAccessToken();

    if (!accessToken) {
      throw new ApiClientError(
        {
          status: 401,
          error: 'Unauthorized',
          code: 'AUTHENTICATION_REQUIRED',
          path,
        },
        'Authentication is required',
      );
    }

    try {
      return await apiRequest<T>(path, withAuthHeaders(accessToken, init));
    } catch (error) {
      if (!(error instanceof ApiClientError) || error.status !== 401) {
        throw error;
      }

      const refreshedAccessToken = await get().refreshSession();

      if (!refreshedAccessToken) {
        throw error;
      }

      return apiRequest<T>(path, withAuthHeaders(refreshedAccessToken, init));
    }
  },

  logout: async () => {
    const refreshToken = await tokenStorage.getRefreshToken();

    try {
      if (refreshToken) {
        await authApi.logout(refreshToken);
      }
    } finally {
      await get().setGuestSession();
    }
  },
}));
