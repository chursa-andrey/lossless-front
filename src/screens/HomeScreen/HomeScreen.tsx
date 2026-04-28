import { useMemo } from 'react';
import { ScrollView, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Card, Text } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

import { SCREENS } from '@/constants/screens';
import { AuthMenuBar } from '@/features/navigation/components/AuthMenuBar';
import { createFooterMenu, createHeaderMenu } from '@/features/navigation/config/authMenu';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import type { RootStackParamList } from '@/navigation/types';
import { makeStyles } from './HomeScreen.style';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  const themedStyles = useThemedStyles(makeStyles);
  const { t } = useTranslation();
  const placeholderCards = useMemo(() => Array.from({ length: 10 }, (_, index) => index + 1), []);
  const headerMenuItems = createHeaderMenu({
    currentScreen: SCREENS.HOME,
  });
  const footerMenuItems = createFooterMenu({
    currentScreen: SCREENS.HOME,
    onProfilePress: () => navigation.navigate(SCREENS.PROFILE),
  });

  return (
    <View style={themedStyles.container}>
      <AuthMenuBar items={headerMenuItems} />

      <ScrollView
        style={themedStyles.scrollArea}
        contentContainerStyle={themedStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {placeholderCards.map(cardIndex => (
          <Card key={cardIndex} style={themedStyles.card}>
            <Card.Content>
              <Text style={themedStyles.cardTitle}>{t('home.cardTitle', { index: cardIndex })}</Text>
              <Text style={themedStyles.cardDescription}>{t('home.cardDescription')}</Text>
            </Card.Content>
          </Card>
        ))}
      </ScrollView>

      <AuthMenuBar items={footerMenuItems} />
    </View>
  );
}
