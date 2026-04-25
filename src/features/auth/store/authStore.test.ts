import { ApiClientError } from '@/features/auth/api/apiClient';
import { authApi } from '@/features/auth/api/authApi';
import { tokenStorage } from '@/features/auth/storage/tokenStorage';
import { useAuthStore } from '@/features/auth/store/authStore';
import type { AuthUser } from '@/features/auth/types/auth';

jest.mock('@/features/auth/api/authApi', () => ({
  authApi: {
    continueWithEmail: jest.fn(),
    socialLogin: jest.fn(),
    refresh: jest.fn(),
    getCurrentUser: jest.fn(),
    logout: jest.fn(),
  },
}));

jest.mock('@/features/auth/storage/tokenStorage', () => ({
  tokenStorage: {
    getRefreshToken: jest.fn(),
    setRefreshToken: jest.fn(),
    clearRefreshToken: jest.fn(),
  },
}));

const user: AuthUser = {
  id: 1,
  email: 'user@example.com',
  displayName: 'User',
  roles: ['USER'],
  createdAt: '2026-01-01T00:00:00Z',
};

function resetStore() {
  useAuthStore.setState({
    status: 'bootstrapping',
    accessToken: null,
    user: null,
    isBootstrapping: true,
    isAuthenticated: false,
  });
}

function jsonResponse(body: unknown, status = 200) {
  const responseBody =
    body && typeof body === 'object' && !Array.isArray(body)
      ? { ...(status >= 400 ? { status } : {}), ...(body as object) }
      : body;

  return {
    ok: status >= 200 && status < 300,
    status,
    statusText: status === 401 ? 'Unauthorized' : 'OK',
    headers: {
      get: (name: string) => (name.toLowerCase() === 'content-type' ? 'application/json' : null),
    },
    json: jest.fn().mockResolvedValue(responseBody),
    text: jest.fn().mockResolvedValue(JSON.stringify(responseBody)),
  };
}

describe('authStore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    resetStore();
    globalThis.fetch = jest.fn();
  });

  it('restores guest session when refresh token is missing', async () => {
    jest.mocked(tokenStorage.getRefreshToken).mockResolvedValue(null);

    await useAuthStore.getState().restoreSession();

    expect(useAuthStore.getState()).toMatchObject({
      status: 'guest',
      accessToken: null,
      user: null,
      isAuthenticated: false,
    });
  });

  it('restores authenticated session through refresh and current user request', async () => {
    jest.mocked(tokenStorage.getRefreshToken).mockResolvedValue('stored-refresh');
    jest.mocked(authApi.refresh).mockResolvedValue({
      accessToken: 'restored-access',
      refreshToken: 'rotated-refresh',
    });
    jest.mocked(authApi.getCurrentUser).mockResolvedValue(user);

    await useAuthStore.getState().restoreSession();

    expect(authApi.refresh).toHaveBeenCalledWith('stored-refresh');
    expect(authApi.getCurrentUser).toHaveBeenCalledWith('restored-access');
    expect(tokenStorage.setRefreshToken).toHaveBeenCalledWith('rotated-refresh');
    expect(useAuthStore.getState()).toMatchObject({
      status: 'authenticated',
      accessToken: 'restored-access',
      user,
      isAuthenticated: true,
    });
  });

  it('refreshes once and retries authenticated request after 401', async () => {
    useAuthStore.setState({
      status: 'authenticated',
      accessToken: 'old-access',
      user,
      isBootstrapping: false,
      isAuthenticated: true,
    });
    jest.mocked(tokenStorage.getRefreshToken).mockResolvedValue('stored-refresh');
    jest.mocked(authApi.refresh).mockResolvedValue({
      accessToken: 'new-access',
      refreshToken: 'new-refresh',
    });
    jest.mocked(globalThis.fetch)
      .mockResolvedValueOnce(jsonResponse({ code: 'AUTHENTICATION_REQUIRED' }, 401) as never)
      .mockResolvedValueOnce(jsonResponse({ ok: true }) as never);

    const result = await useAuthStore.getState().authenticatedRequest<{ ok: boolean }>('/protected');

    expect(result).toEqual({ ok: true });
    expect(authApi.refresh).toHaveBeenCalledTimes(1);
    expect(tokenStorage.setRefreshToken).toHaveBeenCalledWith('new-refresh');
    expect(globalThis.fetch).toHaveBeenCalledTimes(2);
    expect((globalThis.fetch as jest.Mock).mock.calls[0][1].headers.get('Authorization')).toBe(
      'Bearer old-access',
    );
    expect((globalThis.fetch as jest.Mock).mock.calls[1][1].headers.get('Authorization')).toBe(
      'Bearer new-access',
    );
  });

  it('clears session when refresh during retry fails', async () => {
    useAuthStore.setState({
      status: 'authenticated',
      accessToken: 'old-access',
      user,
      isBootstrapping: false,
      isAuthenticated: true,
    });
    jest.mocked(tokenStorage.getRefreshToken).mockResolvedValue('stored-refresh');
    jest.mocked(authApi.refresh).mockRejectedValue(new Error('refresh failed'));
    jest.mocked(globalThis.fetch).mockResolvedValueOnce(
      jsonResponse({ code: 'AUTHENTICATION_REQUIRED' }, 401) as never,
    );

    await expect(useAuthStore.getState().authenticatedRequest('/protected')).rejects.toBeInstanceOf(
      ApiClientError,
    );

    expect(tokenStorage.clearRefreshToken).toHaveBeenCalled();
    expect(useAuthStore.getState()).toMatchObject({
      status: 'guest',
      accessToken: null,
      user: null,
    });
  });
});
