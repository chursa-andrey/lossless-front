import type { TrackGenre } from '@/features/tracks/types/uploadTrack';

export type TrackFeedCursor = {
  createdAt: string;
  id: number;
};

export type TrackUploaderProfile = {
  id: number;
  displayName: string;
};

export type TrackPurchaseLink = {
  url: string;
  position: number;
};

export type TrackAudioMetadata = {
  originalFilename?: string | null;
  extension?: string | null;
  format?: string | null;
  codec?: string | null;
  sizeBytes?: number | null;
  durationSeconds?: number | null;
  sampleRateHz?: number | null;
  bitDepth?: number | null;
  channels?: number | null;
  bitrateKbps?: number | null;
  embeddedGenre?: string | null;
};

export type TrackFeedItem = {
  id: number;
  title?: string | null;
  artistName?: string | null;
  albumTitle?: string | null;
  status: string;
  genre: TrackGenre;
  uploadedBy: TrackUploaderProfile;
  audioUrl: string;
  audio?: TrackAudioMetadata | null;
  purchaseLinks: TrackPurchaseLink[];
  createdAt: string;
  updatedAt: string;
};

export type TrackFeedResponse = {
  items: TrackFeedItem[];
  nextCursor?: TrackFeedCursor | null;
  hasMore: boolean;
};

export type GetTrackFeedParams = {
  limit?: number;
  cursor?: TrackFeedCursor | null;
};
