import { View } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

import { useThemedStyles } from '@/hooks/useThemedStyles';
import { makeStyles } from './AuthBootstrapScreen.style';

export default function AuthBootstrapScreen() {
  const styles = useThemedStyles(makeStyles);
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" style={styles.spinner} />
      <Text style={styles.title}>{t('auth.bootstrap.title')}</Text>
      <Text style={styles.subtitle}>{t('auth.bootstrap.subtitle')}</Text>
    </View>
  );
}
