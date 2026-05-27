import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AppState, PermissionsAndroid, Platform, type AppStateStatus } from 'react-native';
import { useVideoPlayer, type VideoConfig, type VideoPlayer } from 'react-native-video';

import { useAuthStore } from '@/features/auth/store/authStore';
import { tracksApi } from '@/features/tracks/api/tracksApi';
import { usePlayerStore } from '@/features/tracks/player/playerStore';
import { resolveTrackTitle } from '@/features/tracks/utils/trackFormatting';

const BASE64_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

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
  syncNativePlaybackState: (isPlaying: boolean) => void;
  finish: () => void;
  registerNativeStop: (handler: () => void) => () => void;
};

export function TrackAudioPlayer() {
  const [resolvedAccessToken, setResolvedAccessToken] = useState<string | null>(null);
  const [engineInitialSource, setEngineInitialSource] = useState<VideoConfig | null>(null);
  const activeTrackId = usePlayerStore(state => state.activeTrackId);
  const activeTrack = usePlayerStore(state => state.activeTrack);
  const isPlaying = usePlayerStore(state => state.isPlaying);
  const seekRequest = usePlayerStore(state => state.seekRequest);
  const setDuration = usePlayerStore(state => state.setDuration);
  const setProgress = usePlayerStore(state => state.setProgress);
  const setError = usePlayerStore(state => state.setError);
  const setLoading = usePlayerStore(state => state.setLoading);
  const syncNativePlaybackState = usePlayerStore(state => state.syncNativePlaybackState);
  const finish = usePlayerStore(state => state.finish);
  const registerNativeStop = usePlayerStore(state => state.registerNativeStop);
  const storeAccessToken = useAuthStore(state => state.accessToken);
  const getAccessToken = useAuthStore(state => state.getAccessToken);
  const refreshSession = useAuthStore(state => state.refreshSession);

  const activeAudioUrl = activeTrack?.audioUrl;
  const sourceAccessToken = storeAccessToken ?? resolvedAccessToken;

  useEffect(() => {
    let isMounted = true;

    if (!activeTrackId || storeAccessToken) {
      return undefined;
    }

    getAccessToken()
      .then(token => {
        if (isMounted) {
          if (token) {
            setResolvedAccessToken(token);
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
  }, [activeTrackId, getAccessToken, setError, storeAccessToken]);

  useEffect(() => {
    if (!activeTrackId || !sourceAccessToken) {
      return undefined;
    }

    const refreshDelayMs = getAccessTokenRefreshDelayMs(sourceAccessToken);
    if (refreshDelayMs == null) {
      return undefined;
    }

    const timer = setTimeout(() => {
      refreshSession()
        .then(token => {
          if (!token) {
            setError('AUDIO_TOKEN_UNAVAILABLE');
          }
        })
        .catch(() => {
          setError('AUDIO_TOKEN_UNAVAILABLE');
        });
    }, refreshDelayMs);

    return () => {
      clearTimeout(timer);
    };
  }, [activeTrackId, refreshSession, setError, sourceAccessToken]);

  const source = useMemo<VideoConfig | undefined>(() => {
    if (!activeAudioUrl || !sourceAccessToken) {
      return undefined;
    }

    const nextSource: VideoConfig = {
      uri: tracksApi.resolveAudioUrl(activeAudioUrl),
      headers: {
        Authorization: `Bearer ${sourceAccessToken}`,
      },
    };

    if (activeTrack) {
      nextSource.metadata = {
        title: resolveTrackTitle(activeTrack),
        subtitle: activeTrack.albumTitle ?? activeTrack.genre.name,
        artist: activeTrack.artistName ?? activeTrack.uploadedBy.displayName,
      };
    }

    return nextSource;
  }, [activeAudioUrl, activeTrack, sourceAccessToken]);

  useEffect(() => {
    if (activeTrackId && isPlaying) {
      requestAndroidNotificationPermission().catch(() => undefined);
    }
  }, [activeTrackId, isPlaying]);

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
      syncNativePlaybackState={syncNativePlaybackState}
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
  syncNativePlaybackState,
  finish,
  registerNativeStop,
}: TrackVideoEngineProps) {
  const lastSeekRequestId = useRef<number | null>(null);
  const currentSourceKey = useRef<string | null>(sourceKey(initialSource));
  const currentSourceUri = useRef<string | null>(sourceUri(initialSource));
  const isSourceReady = useRef(true);
  const isPlayingRef = useRef(isPlaying);
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);
  const playRetryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const ignoreNativePauseUntilRef = useRef(0);
  const player = useVideoPlayer(initialSource, setupPlayer);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  const clearPlayRetryTimer = useCallback(() => {
    if (playRetryTimerRef.current) {
      clearTimeout(playRetryTimerRef.current);
      playRetryTimerRef.current = null;
    }
  }, []);

  const startNativePlayback = useCallback(() => {
    try {
      ignoreNativePauseUntilRef.current = Date.now() + 800;
      player.play();
      clearPlayRetryTimer();
      playRetryTimerRef.current = setTimeout(() => {
        playRetryTimerRef.current = null;

        if (isPlayingRef.current && isSourceReady.current && !player.isPlaying) {
          player.play();
        }
      }, 250);
    } catch {
      setError('AUDIO_PLAYBACK_FAILED');
    }
  }, [clearPlayRetryTimer, player, setError]);

  const stopNativePlayback = useCallback(() => {
    clearPlayRetryTimer();

    try {
      player.pause();
    } catch {
      // Native player can already be released during teardown.
    }

    currentSourceKey.current = null;
    isSourceReady.current = false;
  }, [clearPlayRetryTimer, player]);

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
      clearPlayRetryTimer();
      releaseNativePlayback();
    },
    [clearPlayRetryTimer, releaseNativePlayback],
  );

  useEffect(
    () => registerNativeStop(stopNativePlayback),
    [registerNativeStop, stopNativePlayback],
  );

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      const previousAppState = appStateRef.current;
      appStateRef.current = nextAppState;

      if (nextAppState !== 'active' || previousAppState === 'active') {
        return;
      }

      if (isPlayingRef.current && source && isSourceReady.current) {
        startNativePlayback();
        return;
      }

      clearPlayRetryTimer();

      try {
        player.pause();
      } catch {
        // Native player can be transitioning while Android returns from file picker.
      }
    });

    return () => {
      subscription.remove();
    };
  }, [clearPlayRetryTimer, player, source, startNativePlayback]);

  useEffect(() => {
    let isCancelled = false;
    const nextSourceKey = source ? sourceKey(source) : null;
    const nextSourceUri = source ? sourceUri(source) : null;

    if (nextSourceKey === currentSourceKey.current) {
      return undefined;
    }

    const previousSourceUri = currentSourceUri.current;
    const restorePlaybackPosition =
      previousSourceUri !== null &&
      previousSourceUri === nextSourceUri &&
      Number.isFinite(player.currentTime)
        ? Math.max(player.currentTime, 0)
        : 0;

    currentSourceKey.current = nextSourceKey;
    currentSourceUri.current = nextSourceUri;
    lastSeekRequestId.current = null;
    isSourceReady.current = false;
    clearPlayRetryTimer();

    if (!source) {
      stopNativePlayback();
      return undefined;
    }

    setLoading(true);
    player.pause();
    player
      .replaceSourceAsync(source)
      .then(() => {
        if (isCancelled) {
          return;
        }

        isSourceReady.current = true;
        const duration = Number.isFinite(player.duration) ? player.duration : 0;

        if (duration > 0) {
          setDuration(duration);
        } else {
          setLoading(false);
        }

        if (restorePlaybackPosition > 0) {
          player.seekTo(restorePlaybackPosition);
          setProgress(restorePlaybackPosition);
        }

        if (isPlayingRef.current) {
          startNativePlayback();
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
  }, [
    clearPlayRetryTimer,
    player,
    setDuration,
    setError,
    setLoading,
    setProgress,
    source,
    startNativePlayback,
    stopNativePlayback,
  ]);

  useEffect(() => {
    try {
      if (isPlaying) {
        if (!source || !isSourceReady.current) {
          return;
        }

        startNativePlayback();
      } else {
        clearPlayRetryTimer();
        player.pause();
      }
    } catch {
      if (isPlaying) {
        setError('AUDIO_PLAYBACK_FAILED');
      }
    }
  }, [clearPlayRetryTimer, isPlaying, player, setError, source, startNativePlayback]);

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
      if (!isSourceReady.current && !data.isBuffering) {
        return;
      }

      setLoading(data.isBuffering);
      if (!data.isBuffering) {
        if (!data.isPlaying && isPlayingRef.current && Date.now() < ignoreNativePauseUntilRef.current) {
          return;
        }

        syncNativePlaybackState(data.isPlaying);
      }
    };
    const handleBuffer: Parameters<typeof player.addEventListener<'onBuffer'>>[1] = isBuffering => {
      if (!isSourceReady.current && !isBuffering) {
        return;
      }

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
  }, [finish, player, setDuration, setError, setLoading, setProgress, syncNativePlaybackState]);

  return null;
}

function setupPlayer(player: VideoPlayer) {
  player.playInBackground = true;
  player.playWhenInactive = true;
  player.showNotificationControls = true;
}

function sourceUri(source: VideoConfig | undefined) {
  return typeof source?.uri === 'string' ? source.uri : null;
}

function sourceKey(source: VideoConfig | undefined) {
  if (!source) {
    return null;
  }

  return JSON.stringify(source);
}

function getAccessTokenRefreshDelayMs(accessToken: string) {
  const payload = parseJwtPayload(accessToken);
  const expiresAtSeconds = typeof payload?.exp === 'number' ? payload.exp : null;

  if (!expiresAtSeconds) {
    return null;
  }

  const refreshAtMs = expiresAtSeconds * 1000 - 60 * 1000;
  return Math.max(refreshAtMs - Date.now(), 0);
}

function parseJwtPayload(accessToken: string): { exp?: unknown } | null {
  const [, payload] = accessToken.split('.');

  if (!payload) {
    return null;
  }

  try {
    const normalizedPayload = payload.replace(/-/g, '+').replace(/_/g, '/');
    const paddedPayload = normalizedPayload.padEnd(Math.ceil(normalizedPayload.length / 4) * 4, '=');
    const decodedPayload = decodeBase64(paddedPayload);

    if (!decodedPayload) {
      return null;
    }

    return JSON.parse(decodedPayload) as { exp?: unknown };
  } catch {
    return null;
  }
}

function decodeBase64(value: string) {
  let output = '';
  let buffer = 0;
  let bits = 0;

  for (const char of value.replace(new RegExp('=+$'), '')) {
    const index = BASE64_ALPHABET.indexOf(char);

    if (index < 0) {
      return null;
    }

    buffer = buffer * 64 + index;
    bits += 6;

    if (bits >= 8) {
      bits -= 8;
      output += String.fromCharCode(Math.floor(buffer / 2 ** bits) % 256);
      buffer %= 2 ** bits;
    }
  }

  return output;
}

async function requestAndroidNotificationPermission() {
  if (Platform.OS !== 'android' || Platform.Version < 33) {
    return;
  }

  await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
}
