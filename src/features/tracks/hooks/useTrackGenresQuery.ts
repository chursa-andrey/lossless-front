import { useQuery } from '@tanstack/react-query';

import { useAuthStore } from '@/features/auth/store/authStore';
import { tracksApi } from '@/features/tracks/api/tracksApi';

export function useTrackGenresQuery() {
  const authenticatedRequest = useAuthStore(state => state.authenticatedRequest);

  return useQuery({
    queryKey: ['tracks', 'genres'],
    queryFn: () => tracksApi.getGenres(authenticatedRequest),
    staleTime: 5 * 60 * 1000,
  });
}
