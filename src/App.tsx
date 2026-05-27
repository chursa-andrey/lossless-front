import '@/i18n';

import { useEffect, useRef } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PaperProvider } from 'react-native-paper';
import { QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query';

import { AppBootstrap } from '@/features/auth/components/AppBootstrap';
import { useAuthStore } from '@/features/auth/store/authStore';
import { appTheme } from './theme';
import RootNavigator from './navigation';

const queryClient = new QueryClient();

function AppSessionQueryCacheSync() {
  const queryClientInstance = useQueryClient();
  const status = useAuthStore(state => state.status);
  const userId = useAuthStore(state => state.user?.id ?? null);
  const previousSessionKeyRef = useRef<string | null>(null);
  const sessionKey = status === 'authenticated' ? `user:${userId ?? 'unknown'}` : status;

  useEffect(() => {
    const previousSessionKey = previousSessionKeyRef.current;
    previousSessionKeyRef.current = sessionKey;

    if (previousSessionKey === null || previousSessionKey === sessionKey) {
      return;
    }

    queryClientInstance.clear();
  }, [queryClientInstance, sessionKey]);

  return null;
}

function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={appTheme}>
        <QueryClientProvider client={queryClient}>
          <AppBootstrap />
          <AppSessionQueryCacheSync />
          <RootNavigator />
        </QueryClientProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}

export default App;
