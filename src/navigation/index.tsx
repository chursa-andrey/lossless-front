import { SafeAreaView } from 'react-native-safe-area-context';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useAuthStore } from '@/features/auth/store/authStore';
import { PlayerHost } from '@/features/tracks/player/PlayerHost';
import { RootStackParamList } from './types';
import { SCREENS } from '@/constants/screens';
import AuthBootstrapScreen from '@/screens/AuthBootstrapScreen/AuthBootstrapScreen';
import HomeScreen from '@/screens/HomeScreen/HomeScreen';
import ProfileScreen from '@/screens/ProfileScreen/ProfileScreen';
import UploadTrackScreen from '@/screens/UploadTrackScreen/UploadTrackScreen';
import StartScreen from '@/screens/StartScreen/StartScreen';
import RegScreen from '@/screens/RegScreen/RegScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const status = useAuthStore(state => state.status);

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <SafeAreaView style={{ backgroundColor: '#333' }} edges={['top']} />
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <NavigationContainer>
          <Stack.Navigator key={status} screenOptions={{ headerShown: false, animation: 'fade', freezeOnBlur: true }}>
            {status === 'bootstrapping' ? (
              <Stack.Screen name={SCREENS.AUTH_BOOTSTRAP} component={AuthBootstrapScreen} />
            ) : null}
            {status === 'authenticated' ? (
              <>
                <Stack.Screen name={SCREENS.HOME} component={HomeScreen} />
                <Stack.Screen name={SCREENS.PROFILE} component={ProfileScreen} />
                <Stack.Screen name={SCREENS.UPLOAD_TRACK} component={UploadTrackScreen} />
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
        {status === 'authenticated' ? <PlayerHost /> : null}
      </View>
      <SafeAreaView style={{ backgroundColor: '#eaeaea' }} edges={['bottom']} />
    </View>
  );
}
