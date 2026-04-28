import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Card, Text } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

import { DefaultButton } from '@/components/DefaultButton/DefaultButton';
import { SCREENS } from '@/constants/screens';
import { useAuthStore } from '@/features/auth/store/authStore';
import { AuthMenuBar } from '@/features/navigation/components/AuthMenuBar';
import { createFooterMenu, createHeaderMenu } from '@/features/navigation/config/authMenu';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import type { RootStackParamList } from '@/navigation/types';
import { makeStyles } from './ProfileScreen.style';

type Props = NativeStackScreenProps<RootStackParamList, 'Profile'>;

export default function ProfileScreen({ navigation }: Props) {
  const styles = useThemedStyles(makeStyles);
  const { t } = useTranslation();
  const logout = useAuthStore(state => state.logout);
  const user = useAuthStore(state => state.user);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const headerMenuItems = createHeaderMenu({
    currentScreen: SCREENS.PROFILE,
    onHomePress: () => navigation.navigate(SCREENS.HOME),
  });
  const footerMenuItems = createFooterMenu({
    currentScreen: SCREENS.PROFILE,
    onLibraryPress: () => navigation.navigate(SCREENS.HOME),
  });

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      await logout();
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <View style={styles.container}>
      <AuthMenuBar items={headerMenuItems} />

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionLabel}>{t('profile.sections.account')}</Text>
            <Text style={styles.title}>{t('profile.title')}</Text>
            <Text style={styles.subtitle}>
              {user
                ? t('profile.subtitleLoggedIn', { displayName: user.displayName, email: user.email })
                : t('profile.subtitleFallback')}
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionLabel}>{t('profile.sections.session')}</Text>
            <Text style={styles.cardDescription}>{t('profile.sessionDescription')}</Text>
            <DefaultButton
              label={t('auth.actions.logout')}
              onPress={() => {
                handleLogout().catch(() => undefined);
              }}
              loading={isLoggingOut}
              disabled={isLoggingOut}
              buttonStyle={styles.button}
              labelButtonStyle={styles.buttonLabel}
            />
          </Card.Content>
        </Card>
      </ScrollView>

      <AuthMenuBar items={footerMenuItems} />
    </View>
  );
}
