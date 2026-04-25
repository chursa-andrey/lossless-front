import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PaperProvider } from 'react-native-paper';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { AppBootstrap } from '@/features/auth/components/AppBootstrap';
import { appTheme } from './theme';
import RootNavigator from './navigation';

const queryClient = new QueryClient();

function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={appTheme}>
        <QueryClientProvider client={queryClient}>
          <AppBootstrap />
          <RootNavigator />
        </QueryClientProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}

export default App;
