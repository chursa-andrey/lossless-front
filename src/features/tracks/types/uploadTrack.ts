import type { DocumentPickerResponse } from '@react-native-documents/picker';

import type { TrackGenre } from '@/features/tracks/config/genres';

export type UploadTrackFile = Pick<DocumentPickerResponse, 'uri' | 'name' | 'type' | 'size' | 'hasRequestedType'>;

export type UploadTrackInput = {
  trackFile: UploadTrackFile;
  genre: TrackGenre;
  trackTitle?: string;
  artistName?: string;
  albumTitle?: string;
  purchaseLinks: string[];
};

export type UploadTrackResponse = {
  id?: string | number;
  status?: string;
};
