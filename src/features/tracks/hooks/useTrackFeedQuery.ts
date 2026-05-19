import { useInfiniteQuery } from '@tanstack/react-query';

import { useAuthStore } from '@/features/auth/store/authStore';
import { tracksApi } from '@/features/tracks/api/tracksApi';
import type { TrackFeedCursor } from '@/features/tracks/types/trackFeed';

const TRACK_FEED_PAGE_SIZE = 10;
const TRACK_FEED_NEXT_PAGE_PREVIEW_DELAY_MS = 0;

function delay(milliseconds: number) {
  return new Promise<void>(resolve => {
    setTimeout(resolve, milliseconds);
  });
}

export function useTrackFeedQuery() {
  const authenticatedRequest = useAuthStore(state => state.authenticatedRequest);

  return useInfiniteQuery({
    queryKey: ['tracks', 'feed'],
    initialPageParam: null as TrackFeedCursor | null,
    queryFn: async ({ pageParam }) => {
      if (pageParam && TRACK_FEED_NEXT_PAGE_PREVIEW_DELAY_MS > 0) {
        await delay(TRACK_FEED_NEXT_PAGE_PREVIEW_DELAY_MS);
      }

      return tracksApi.getFeed(authenticatedRequest, {
        limit: TRACK_FEED_PAGE_SIZE,
        cursor: pageParam,
      });
    },
    getNextPageParam: lastPage => (lastPage.hasMore ? lastPage.nextCursor ?? undefined : undefined),
    staleTime: 30 * 1000,
  });
}
