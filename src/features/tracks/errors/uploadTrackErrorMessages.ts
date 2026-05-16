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

  if (
    error.code === 'TRACK_FILE_TOO_LARGE' ||
    error.code === 'TRACK_FILE_EXTENSION_NOT_ALLOWED' ||
    error.code === 'TRACK_FILE_CONTENT_TYPE_NOT_ALLOWED' ||
    error.code === 'TRACK_FILE_FORMAT_NOT_ALLOWED'
  ) {
    return i18n.t('uploadTrack.errors.invalidFile');
  }

  if (error.code === 'TRACK_GENRE_NOT_FOUND' || error.code === 'TRACK_GENRE_REQUIRED') {
    return i18n.t('uploadTrack.errors.invalidGenre');
  }

  if (error.code === 'TRACK_PURCHASE_LINK_LIMIT_EXCEEDED') {
    return i18n.t('uploadTrack.errors.purchaseLinkLimit');
  }

  if (error.code === 'TRACK_PURCHASE_LINK_INVALID') {
    return i18n.t('uploadTrack.validation.linkInvalid');
  }

  if (error.status === 400 || error.status === 422) {
    return i18n.t('uploadTrack.errors.invalidPayload');
  }

  return i18n.t('uploadTrack.errors.submitGeneric');
}
