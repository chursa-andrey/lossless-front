import { API_BASE_URL } from '@/config/api';
import type { ApiErrorPayload } from '@/features/auth/types/auth';

export class ApiClientError extends Error {
  status: number;
  code: string | undefined;
  path: string | undefined;

  constructor(payload: ApiErrorPayload, fallbackMessage: string) {
    super(payload.message ?? payload.error ?? fallbackMessage);
    this.name = 'ApiClientError';
    this.status = payload.status ?? 0;
    this.code = payload.code;
    this.path = payload.path;
  }
}

function resolveUrl(path: string) {
  if (/^https?:\/\//.test(path)) {
    return path;
  }

  return path.startsWith('/') ? `${API_BASE_URL}${path}` : `${API_BASE_URL}/${path}`;
}

async function parseResponseBody<T>(response: Response): Promise<T> {
  if (response.status === 204) {
    return undefined as T;
  }

  const contentType = response.headers.get('content-type') ?? '';
  if (contentType.includes('application/json')) {
    return (await response.json()) as T;
  }

  return (await response.text()) as T;
}

export async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;

  try {
    response = await fetch(resolveUrl(path), init);
  } catch {
    throw new ApiClientError(
      {
        status: 0,
        error: 'Network Error',
        code: 'NETWORK_ERROR',
        path,
      },
      'Unable to reach the API',
    );
  }

  const body = await parseResponseBody<T | ApiErrorPayload>(response);

  if (!response.ok) {
    const payload =
      body && typeof body === 'object' && !Array.isArray(body)
        ? (body as ApiErrorPayload)
        : {
            status: response.status,
            error: response.statusText,
            path,
          };

    throw new ApiClientError(payload, 'API request failed');
  }

  return body as T;
}

export function jsonRequestInit(body: unknown, init: RequestInit = {}): RequestInit {
  const headers = new Headers(init.headers);

  if (!headers.has('Accept')) {
    headers.set('Accept', 'application/json');
  }

  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  return {
    ...init,
    headers,
    body: JSON.stringify(body),
  };
}

export function withAuthHeaders(accessToken: string, init: RequestInit = {}): RequestInit {
  const headers = new Headers(init.headers);

  if (!headers.has('Accept')) {
    headers.set('Accept', 'application/json');
  }

  headers.set('Authorization', `Bearer ${accessToken}`);

  return {
    ...init,
    headers,
  };
}
