import type { DocumentPickerResponse } from '@react-native-documents/picker';

export type UploadTrackFile = Pick<DocumentPickerResponse, 'uri' | 'name' | 'type' | 'size' | 'hasRequestedType'>;

export type TrackGenre = {
  slug: string;
  name: string;
};

export type UploadTrackInput = {
  trackFile: UploadTrackFile;
  genre: string;
  trackTitle?: string;
  artistName?: string;
  albumTitle?: string;
  purchaseLinks: string[];
};

export type UploadTrackResponse = {
  trackId: number;
};
