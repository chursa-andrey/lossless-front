import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PaperProvider } from 'react-native-paper';
import { appTheme } from './theme';
import RootNavigator from './navigation';

function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={appTheme}>
        <RootNavigator />
      </PaperProvider>
    </SafeAreaProvider>
  );
}

export default App;
