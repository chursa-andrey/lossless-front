import { useEffect } from 'react';

import { TrackAudioPlayer } from '@/features/tracks/components/TrackAudioPlayer';
import { usePlayerStore } from '@/features/tracks/player/playerStore';

export function PlayerHost() {
  const stop = usePlayerStore(state => state.stop);

  useEffect(
    () => () => {
      stop();
    },
    [stop],
  );

  return <TrackAudioPlayer />;
}
