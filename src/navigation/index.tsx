import { SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useAuthStore } from '@/features/auth/store/authStore';
import { RootStackParamList } from './types';
import { SCREENS } from '@/constants/screens';
import AuthBootstrapScreen from '@/screens/AuthBootstrapScreen/AuthBootstrapScreen';
import HomeScreen from '@/screens/HomeScreen/HomeScreen';
import StartScreen from '@/screens/StartScreen/StartScreen';
import RegScreen from '@/screens/RegScreen/RegScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const status = useAuthStore(state => state.status);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#333' }} edges={['top', 'bottom']}>
      <NavigationContainer>
        <Stack.Navigator key={status} screenOptions={{ headerShown: false }}>
          {status === 'bootstrapping' ? (
            <Stack.Screen name={SCREENS.AUTH_BOOTSTRAP} component={AuthBootstrapScreen} />
          ) : null}
          {status === 'authenticated' ? (
            <Stack.Screen name={SCREENS.HOME} component={HomeScreen} />
          ) : null}
          {status === 'guest' ? (
            <>
              <Stack.Screen name={SCREENS.START} component={StartScreen} />
              <Stack.Screen name={SCREENS.REG} component={RegScreen} />
            </>
          ) : null}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}
