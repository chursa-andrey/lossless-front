import type { TrackAudioMetadata, TrackFeedItem } from '@/features/tracks/types/trackFeed';

export function formatDuration(seconds: number | null | undefined) {
  if (seconds == null || !Number.isFinite(seconds) || seconds <= 0) {
    return '0:00';
  }

  const roundedSeconds = Math.floor(seconds);
  const minutes = Math.floor(roundedSeconds / 60);
  const remainingSeconds = roundedSeconds % 60;

  return `${minutes}:${String(remainingSeconds).padStart(2, '0')}`;
}

export function formatSampleRate(sampleRateHz: number | null | undefined) {
  if (!sampleRateHz) {
    return null;
  }

  return `${(sampleRateHz / 1000).toFixed(sampleRateHz % 1000 === 0 ? 0 : 1)} kHz`;
}

export function formatBitDepth(bitDepth: number | null | undefined) {
  return bitDepth ? `${bitDepth}-bit` : null;
}

export function formatChannels(channels: number | null | undefined) {
  return channels ? `${channels} ch` : null;
}

export function formatBitrate(bitrateKbps: number | null | undefined) {
  return bitrateKbps ? `${bitrateKbps} kbps` : null;
}

export function resolveTrackTitle(track: TrackFeedItem) {
  return track.title?.trim() || track.audio?.originalFilename?.trim() || `Track #${track.id}`;
}

export function resolveTrackFormat(audio: TrackAudioMetadata | null | undefined) {
  return audio?.format?.trim() || audio?.extension?.trim().toUpperCase() || null;
}
