import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useAuthStore } from '@/features/auth/store/authStore';
import { tracksApi } from '@/features/tracks/api/tracksApi';
import type { UploadTrackInput } from '@/features/tracks/types/uploadTrack';

export function useUploadTrackMutation() {
  const queryClient = useQueryClient();
  const authenticatedRequest = useAuthStore(state => state.authenticatedRequest);

  return useMutation({
    mutationFn: (input: UploadTrackInput) => tracksApi.uploadTrack(authenticatedRequest, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tracks', 'feed'] }).catch(() => undefined);
    },
  });
}
