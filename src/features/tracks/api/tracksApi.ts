import type {
  TrackGenre,
  UploadTrackInput,
  UploadTrackResponse,
} from '@/features/tracks/types/uploadTrack';

type AuthenticatedRequest = <T>(path: string, init?: RequestInit) => Promise<T>;

function appendText(formData: FormData, fieldName: string, value: string | undefined) {
  const trimmedValue = value?.trim();

  if (trimmedValue) {
    formData.append(fieldName, trimmedValue);
  }
}

function createUploadTrackFormData(input: UploadTrackInput) {
  const formData = new FormData();
  const fileName = input.trackFile.name ?? 'track';
  const fileType = input.trackFile.type ?? 'application/octet-stream';

  formData.append(
    'file',
    {
      uri: input.trackFile.uri,
      name: fileName,
      type: fileType,
    } as unknown as Blob,
  );
  formData.append('genre', input.genre);
  appendText(formData, 'title', input.trackTitle);
  appendText(formData, 'artistName', input.artistName);
  appendText(formData, 'albumTitle', input.albumTitle);

  input.purchaseLinks
    .map(link => link.trim())
    .filter(Boolean)
    .forEach(link => {
      formData.append('purchaseLinks[]', link);
    });

  return formData;
}

export const tracksApi = {
  getGenres(authenticatedRequest: AuthenticatedRequest) {
    return authenticatedRequest<TrackGenre[]>('/api/v1/tracks/genres');
  },

  uploadTrack(authenticatedRequest: AuthenticatedRequest, input: UploadTrackInput) {
    return authenticatedRequest<UploadTrackResponse>('/api/v1/tracks/upload', {
      method: 'POST',
      body: createUploadTrackFormData(input),
    });
  },
};
