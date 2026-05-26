import { create } from 'zustand';

import type { TrackFeedItem } from '@/features/tracks/types/trackFeed';

type SeekRequest = {
  id: number;
  seconds: number;
};

type PlayerState = {
  activeTrackId: number | null;
  activeTrack: TrackFeedItem | null;
  isPlaying: boolean;
  isLoading: boolean;
  error: string | null;
  currentTime: number;
  duration: number;
  seekRequest: SeekRequest | null;
  play: (track: TrackFeedItem) => void;
  pause: () => void;
  toggle: (track: TrackFeedItem) => void;
  seek: (seconds: number) => void;
  stop: () => void;
  setLoading: (isLoading: boolean) => void;
  setDuration: (duration: number) => void;
  setProgress: (currentTime: number) => void;
  setError: (error: string) => void;
  syncNativePlaybackState: (isPlaying: boolean) => void;
  finish: () => void;
  registerNativeStop: (handler: () => void) => () => void;
};

let seekRequestId = 0;
let lastProgressUpdateAt = 0;
const nativeStopHandlers = new Set<() => void>();
const PLAYER_PROGRESS_UPDATE_INTERVAL_MS = 500;
const PLAYER_PROGRESS_MIN_DELTA_SECONDS = 0.25;

const initialPlaybackState = {
  activeTrackId: null,
  activeTrack: null,
  isPlaying: false,
  isLoading: false,
  error: null,
  currentTime: 0,
  duration: 0,
  seekRequest: null,
};

function pauseNativePlayback() {
  nativeStopHandlers.forEach(handler => {
    handler();
  });
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  ...initialPlaybackState,

  play: track => {
    const trackId = track.id;
    const currentTrackId = get().activeTrackId;
    const isTrackChange = currentTrackId !== trackId;

    if (isTrackChange) {
      pauseNativePlayback();
    }

    set({
      activeTrackId: trackId,
      activeTrack: track,
      isPlaying: true,
      isLoading: currentTrackId !== trackId,
      error: null,
      currentTime: currentTrackId === trackId ? get().currentTime : 0,
      duration: currentTrackId === trackId ? get().duration : 0,
      seekRequest: currentTrackId === trackId ? get().seekRequest : null,
    });
  },

  pause: () => {
    set({
      isPlaying: false,
      isLoading: false,
    });
  },

  toggle: track => {
    const { activeTrackId, isPlaying, pause, play } = get();

    if (activeTrackId === track.id && isPlaying) {
      pause();
      return;
    }

    play(track);
  },

  seek: seconds => {
    const duration = get().duration;
    const nextTime = duration > 0 ? Math.min(Math.max(seconds, 0), duration) : Math.max(seconds, 0);

    seekRequestId += 1;
    lastProgressUpdateAt = Date.now();
    set({
      currentTime: nextTime,
      seekRequest: {
        id: seekRequestId,
        seconds: nextTime,
      },
    });
  },

  stop: () => {
    pauseNativePlayback();
    lastProgressUpdateAt = 0;
    set(initialPlaybackState);
  },

  setLoading: isLoading => {
    if (get().isLoading === isLoading) {
      return;
    }

    set({ isLoading });
  },

  setDuration: duration => {
    const nextDuration = Math.max(duration, 0);
    const { duration: currentDuration, isLoading } = get();

    if (Math.abs(currentDuration - nextDuration) < 0.05 && !isLoading) {
      return;
    }

    set({ duration: nextDuration, isLoading: false });
  },

  setProgress: currentTime => {
    const nextTime = Math.max(currentTime, 0);
    const now = Date.now();
    const previousTime = get().currentTime;

    if (
      now - lastProgressUpdateAt < PLAYER_PROGRESS_UPDATE_INTERVAL_MS &&
      Math.abs(nextTime - previousTime) < PLAYER_PROGRESS_MIN_DELTA_SECONDS
    ) {
      return;
    }

    lastProgressUpdateAt = now;
    set({ currentTime: nextTime });
  },

  setError: error => {
    pauseNativePlayback();
    set({
      error,
      isPlaying: false,
      isLoading: false,
    });
  },

  syncNativePlaybackState: isPlaying => {
    if (!get().activeTrackId || get().isPlaying === isPlaying) {
      return;
    }

    set({
      isPlaying,
      isLoading: false,
      error: isPlaying ? null : get().error,
    });
  },

  finish: () => {
    pauseNativePlayback();
    lastProgressUpdateAt = 0;
    set(initialPlaybackState);
  },

  registerNativeStop: handler => {
    nativeStopHandlers.add(handler);

    return () => {
      nativeStopHandlers.delete(handler);
    };
  },
}));
