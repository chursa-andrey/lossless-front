import { SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { SCREENS } from '@/constants/screens';
import StartScreen from '@/screens/StartScreen/StartScreen';
import RegScreen from '@/screens/RegScreen/RegScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#333' }} edges={['top', 'bottom']}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name={SCREENS.START} component={StartScreen} />
          <Stack.Screen name={SCREENS.REG} component={RegScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}
