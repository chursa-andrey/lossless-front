import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useVideoPlayer, type VideoConfig, type VideoPlayer } from 'react-native-video';

import { useAuthStore } from '@/features/auth/store/authStore';
import { tracksApi } from '@/features/tracks/api/tracksApi';
import { usePlayerStore } from '@/features/tracks/player/playerStore';
import type { TrackFeedItem } from '@/features/tracks/types/trackFeed';

type TrackAudioPlayerProps = {
  tracks: TrackFeedItem[];
};

type TrackVideoEngineProps = {
  initialSource: VideoConfig;
  source: VideoConfig | undefined;
  isPlaying: boolean;
  seekRequest: {
    id: number;
    seconds: number;
  } | null;
  setDuration: (duration: number) => void;
  setProgress: (currentTime: number) => void;
  setError: (error: string) => void;
  setLoading: (isLoading: boolean) => void;
  finish: () => void;
  registerNativeStop: (handler: () => void) => () => void;
};

export function TrackAudioPlayer({ tracks }: TrackAudioPlayerProps) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [engineInitialSource, setEngineInitialSource] = useState<VideoConfig | null>(null);
  const activeTrackId = usePlayerStore(state => state.activeTrackId);
  const isPlaying = usePlayerStore(state => state.isPlaying);
  const seekRequest = usePlayerStore(state => state.seekRequest);
  const setDuration = usePlayerStore(state => state.setDuration);
  const setProgress = usePlayerStore(state => state.setProgress);
  const setError = usePlayerStore(state => state.setError);
  const setLoading = usePlayerStore(state => state.setLoading);
  const finish = usePlayerStore(state => state.finish);
  const registerNativeStop = usePlayerStore(state => state.registerNativeStop);
  const getAccessToken = useAuthStore(state => state.getAccessToken);

  const activeTrack = useMemo(
    () => tracks.find(track => track.id === activeTrackId) ?? null,
    [activeTrackId, tracks],
  );
  const activeAudioUrl = activeTrack?.audioUrl;

  useEffect(() => {
    let isMounted = true;

    if (!activeTrackId) {
      return undefined;
    }

    getAccessToken()
      .then(token => {
        if (isMounted) {
          if (token) {
            setAccessToken(token);
          } else {
            setError('AUDIO_TOKEN_UNAVAILABLE');
          }
        }
      })
      .catch(() => {
        if (isMounted) {
          setError('AUDIO_TOKEN_UNAVAILABLE');
        }
      });

    return () => {
      isMounted = false;
    };
  }, [activeTrackId, getAccessToken, setError]);

  const source = useMemo<VideoConfig | undefined>(() => {
    if (!activeAudioUrl || !accessToken) {
      return undefined;
    }

    return {
      uri: tracksApi.resolveAudioUrl(activeAudioUrl),
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
  }, [accessToken, activeAudioUrl]);

  useEffect(() => {
    if (!source || engineInitialSource) {
      return undefined;
    }

    const timer = setTimeout(() => {
      setEngineInitialSource(source);
    }, 0);

    return () => {
      clearTimeout(timer);
    };
  }, [engineInitialSource, source]);

  if (!engineInitialSource) {
    return null;
  }

  return (
    <TrackVideoEngine
      initialSource={engineInitialSource}
      source={source}
      isPlaying={isPlaying}
      seekRequest={seekRequest}
      setDuration={setDuration}
      setProgress={setProgress}
      setError={setError}
      setLoading={setLoading}
      finish={finish}
      registerNativeStop={registerNativeStop}
    />
  );
}

function TrackVideoEngine({
  initialSource,
  source,
  isPlaying,
  seekRequest,
  setDuration,
  setProgress,
  setError,
  setLoading,
  finish,
  registerNativeStop,
}: TrackVideoEngineProps) {
  const lastSeekRequestId = useRef<number | null>(null);
  const currentSourceKey = useRef<string | null>(sourceKey(initialSource));
  const isSourceReady = useRef(true);
  const player = useVideoPlayer(initialSource, setupPlayer);
  const stopNativePlayback = useCallback(() => {
    try {
      player.pause();
    } catch {
      // Native player can already be released during teardown.
    }

    currentSourceKey.current = null;
    isSourceReady.current = false;
  }, [player]);

  const releaseNativePlayback = useCallback(() => {
    stopNativePlayback();

    try {
      player.release();
    } catch {
      // v7 also releases from useVideoPlayer cleanup; duplicate release is best-effort.
    }
  }, [player, stopNativePlayback]);

  useEffect(
    () => () => {
      releaseNativePlayback();
    },
    [releaseNativePlayback],
  );

  useEffect(
    () => registerNativeStop(stopNativePlayback),
    [registerNativeStop, stopNativePlayback],
  );

  useEffect(() => {
    let isCancelled = false;
    const nextSourceKey = source ? sourceKey(source) : null;

    if (nextSourceKey === currentSourceKey.current) {
      return undefined;
    }

    currentSourceKey.current = nextSourceKey;
    lastSeekRequestId.current = null;
    isSourceReady.current = false;

    if (!source) {
      stopNativePlayback();
      return undefined;
    }

    setLoading(true);
    player.pause();
    player
      .replaceSourceAsync(source)
      .then(() => {
        isSourceReady.current = !isCancelled;
        if (!isCancelled && isPlaying) {
          player.play();
        }
      })
      .catch(() => {
        if (!isCancelled) {
          currentSourceKey.current = null;
          isSourceReady.current = false;
          setError('AUDIO_PLAYBACK_FAILED');
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [isPlaying, player, setError, setLoading, source, stopNativePlayback]);

  useEffect(() => {
    try {
      if (isPlaying) {
        if (!source || !isSourceReady.current) {
          return;
        }

        player.play();
      } else {
        player.pause();
      }
    } catch {
      if (isPlaying) {
        setError('AUDIO_PLAYBACK_FAILED');
      }
    }
  }, [isPlaying, player, setError, source]);

  useEffect(() => {
    if (!seekRequest || lastSeekRequestId.current === seekRequest.id) {
      return;
    }

    lastSeekRequestId.current = seekRequest.id;
    try {
      player.seekTo(seekRequest.seconds);
    } catch {
      setError('AUDIO_PLAYBACK_FAILED');
    }
  }, [player, seekRequest, setError]);

  useEffect(() => {
    const handleLoad: Parameters<typeof player.addEventListener<'onLoad'>>[1] = data => {
      if (!isSourceReady.current) {
        return;
      }

      setDuration(data.duration);
    };
    const handleProgress: Parameters<typeof player.addEventListener<'onProgress'>>[1] = data => {
      if (!isSourceReady.current) {
        return;
      }

      setProgress(data.currentTime);
    };
    const handlePlaybackStateChange: Parameters<typeof player.addEventListener<'onPlaybackStateChange'>>[1] = data => {
      setLoading(data.isBuffering);
    };
    const handleBuffer: Parameters<typeof player.addEventListener<'onBuffer'>>[1] = isBuffering => {
      setLoading(isBuffering);
    };
    const handleError: Parameters<typeof player.addEventListener<'onError'>>[1] = () => {
      setError('AUDIO_PLAYBACK_FAILED');
    };

    const subscriptions = [
      player.addEventListener('onLoad', handleLoad),
      player.addEventListener('onProgress', handleProgress),
      player.addEventListener('onPlaybackStateChange', handlePlaybackStateChange),
      player.addEventListener('onBuffer', handleBuffer),
      player.addEventListener('onEnd', finish),
      player.addEventListener('onError', handleError),
    ];

    return () => {
      subscriptions.forEach(subscription => subscription.remove());
    };
  }, [finish, player, setDuration, setError, setLoading, setProgress]);

  return null;
}

function setupPlayer(player: VideoPlayer) {
  player.playInBackground = false;
  player.playWhenInactive = false;
  player.showNotificationControls = false;
}

function sourceKey(source: VideoConfig | undefined) {
  if (!source) {
    return null;
  }

  return JSON.stringify(source);
}
