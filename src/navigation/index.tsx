import { SafeAreaView } from 'react-native-safe-area-context';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useAuthStore } from '@/features/auth/store/authStore';
import { PlayerHost } from '@/features/tracks/player/PlayerHost';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import { RootStackParamList } from './types';
import { makeStyles } from './index.style';
import { SCREENS } from '@/constants/screens';
import AuthBootstrapScreen from '@/screens/AuthBootstrapScreen/AuthBootstrapScreen';
import HomeScreen from '@/screens/HomeScreen/HomeScreen';
import ProfileScreen from '@/screens/ProfileScreen/ProfileScreen';
import UploadTrackScreen from '@/screens/UploadTrackScreen/UploadTrackScreen';
import StartScreen from '@/screens/StartScreen/StartScreen';
import RegScreen from '@/screens/RegScreen/RegScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const styles = useThemedStyles(makeStyles);
  const status = useAuthStore(state => state.status);

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.topSafeArea} edges={['top']} />
      <View style={styles.content}>
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
      <SafeAreaView style={styles.bottomSafeArea} edges={['bottom']} />
    </View>
  );
}
