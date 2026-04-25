import { useState } from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';

import { DefaultButton } from '@/components/DefaultButton/DefaultButton';
import { useAuthStore } from '@/features/auth/store/authStore';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import { styles } from './HomeScreen.style';

export default function HomeScreen() {
  const themedStyles = useThemedStyles(styles);
  const logout = useAuthStore(state => state.logout);
  const user = useAuthStore(state => state.user);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      await logout();
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <View style={themedStyles.container}>
      <Text style={themedStyles.title}>Сессия активна</Text>
      <Text style={themedStyles.subtitle}>
        {user ? `Вы вошли как ${user.displayName} (${user.email})` : 'Пользователь загружен.'}
      </Text>
      <DefaultButton
        label="Выйти"
        onPress={() => {
          handleLogout().catch(() => undefined);
        }}
        loading={isLoggingOut}
        disabled={isLoggingOut}
        buttonStyle={themedStyles.button}
        labelButtonStyle={themedStyles.buttonLabel}
      />
    </View>
  );
}
