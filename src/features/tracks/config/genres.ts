export const TRACK_GENRES = [
  'rock',
  'pop',
  'hipHopRap',
  'electronic',
  'jazz',
  'classical',
  'rnbSoul',
  'metal',
  'indie',
  'reggae',
] as const;

export type TrackGenre = (typeof TRACK_GENRES)[number];
