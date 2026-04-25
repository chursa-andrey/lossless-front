import { useEffect } from 'react';

import { useAuthStore } from '@/features/auth/store/authStore';

export function AppBootstrap() {
  const restoreSession = useAuthStore(state => state.restoreSession);

  useEffect(() => {
    restoreSession().catch(() => undefined);
  }, [restoreSession]);

  return null;
}
