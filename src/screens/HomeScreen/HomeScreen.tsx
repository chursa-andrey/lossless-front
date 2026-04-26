import { useState } from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

import { DefaultButton } from '@/components/DefaultButton/DefaultButton';
import { useAuthStore } from '@/features/auth/store/authStore';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import { styles } from './HomeScreen.style';

export default function HomeScreen() {
  const themedStyles = useThemedStyles(styles);
  const { t } = useTranslation();
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
      <Text style={themedStyles.title}>{t('home.title')}</Text>
      <Text style={themedStyles.subtitle}>
        {user
          ? t('home.subtitleLoggedIn', { displayName: user.displayName, email: user.email })
          : t('home.subtitleFallback')}
      </Text>
      <DefaultButton
        label={t('auth.actions.logout')}
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
