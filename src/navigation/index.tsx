import { SafeAreaView } from 'react-native-safe-area-context';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useAuthStore } from '@/features/auth/store/authStore';
import { RootStackParamList } from './types';
import { SCREENS } from '@/constants/screens';
import AuthBootstrapScreen from '@/screens/AuthBootstrapScreen/AuthBootstrapScreen';
import HomeScreen from '@/screens/HomeScreen/HomeScreen';
import ProfileScreen from '@/screens/ProfileScreen/ProfileScreen';
import StartScreen from '@/screens/StartScreen/StartScreen';
import RegScreen from '@/screens/RegScreen/RegScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const status = useAuthStore(state => state.status);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#333' }} edges={['top', 'bottom']}>
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <NavigationContainer>
          <Stack.Navigator key={status} screenOptions={{ headerShown: false, animation: 'fade' }}>
            {status === 'bootstrapping' ? (
              <Stack.Screen name={SCREENS.AUTH_BOOTSTRAP} component={AuthBootstrapScreen} />
            ) : null}
            {status === 'authenticated' ? (
              <>
                <Stack.Screen name={SCREENS.HOME} component={HomeScreen} />
                <Stack.Screen name={SCREENS.PROFILE} component={ProfileScreen} />
              </>
            ) : null}
            {status === 'guest' ? (
              <>
                <Stack.Screen name={SCREENS.START} component={StartScreen} />
                <Stack.Screen name={SCREENS.REG} component={RegScreen} />
              </>
            ) : null}
          </Stack.Navigator>
        </NavigationContainer>
      </View>
    </SafeAreaView>
  );
}
