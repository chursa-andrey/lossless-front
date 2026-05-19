import { create } from 'zustand';

type SeekRequest = {
  id: number;
  seconds: number;
};

type PlayerState = {
  activeTrackId: number | null;
  isPlaying: boolean;
  isLoading: boolean;
  error: string | null;
  currentTime: number;
  duration: number;
  seekRequest: SeekRequest | null;
  play: (trackId: number) => void;
  pause: () => void;
  toggle: (trackId: number) => void;
  seek: (seconds: number) => void;
  stop: () => void;
  setLoading: (isLoading: boolean) => void;
  setDuration: (duration: number) => void;
  setProgress: (currentTime: number) => void;
  setError: (error: string) => void;
  finish: () => void;
  registerNativeStop: (handler: () => void) => () => void;
};

let seekRequestId = 0;
const nativeStopHandlers = new Set<() => void>();

const initialPlaybackState = {
  activeTrackId: null,
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

  play: trackId => {
    const currentTrackId = get().activeTrackId;
    const isTrackChange = currentTrackId !== trackId;

    if (isTrackChange) {
      pauseNativePlayback();
    }

    set({
      activeTrackId: trackId,
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

  toggle: trackId => {
    const { activeTrackId, isPlaying, pause, play } = get();

    if (activeTrackId === trackId && isPlaying) {
      pause();
      return;
    }

    play(trackId);
  },

  seek: seconds => {
    const duration = get().duration;
    const nextTime = duration > 0 ? Math.min(Math.max(seconds, 0), duration) : Math.max(seconds, 0);

    seekRequestId += 1;
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
    set(initialPlaybackState);
  },

  setLoading: isLoading => {
    set({ isLoading });
  },

  setDuration: duration => {
    set({ duration: Math.max(duration, 0), isLoading: false });
  },

  setProgress: currentTime => {
    set({ currentTime: Math.max(currentTime, 0) });
  },

  setError: error => {
    pauseNativePlayback();
    set({
      error,
      isPlaying: false,
      isLoading: false,
    });
  },

  finish: () => {
    pauseNativePlayback();
    set(initialPlaybackState);
  },

  registerNativeStop: handler => {
    nativeStopHandlers.add(handler);

    return () => {
      nativeStopHandlers.delete(handler);
    };
  },
}));
