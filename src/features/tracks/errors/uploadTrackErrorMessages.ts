import { ApiClientError } from '@/features/auth/api/apiClient';
import i18n from '@/i18n';

export function getUploadTrackErrorMessage(error: unknown) {
  if (!(error instanceof ApiClientError)) {
    return i18n.t('uploadTrack.errors.submitGeneric');
  }

  if (error.code === 'NETWORK_ERROR' || error.status === 0) {
    return i18n.t('auth.errors.network');
  }

  if (error.status === 401) {
    return i18n.t('uploadTrack.errors.authRequired');
  }

  if (error.status === 400 || error.status === 422) {
    return i18n.t('uploadTrack.errors.invalidPayload');
  }

  return i18n.t('uploadTrack.errors.submitGeneric');
}
