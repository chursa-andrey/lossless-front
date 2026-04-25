import { View } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';

import { useThemedStyles } from '@/hooks/useThemedStyles';
import { makeStyles } from './AuthBootstrapScreen.style';

export default function AuthBootstrapScreen() {
  const styles = useThemedStyles(makeStyles);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" style={styles.spinner} />
      <Text style={styles.title}>Восстанавливаем сессию</Text>
      <Text style={styles.subtitle}>Проверяем сохранённый вход и обновляем токены.</Text>
    </View>
  );
}
