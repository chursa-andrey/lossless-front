import { useMemo, useState } from 'react';
import { ImageBackground, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'react-native-paper';
import Animated, { FadeIn } from 'react-native-reanimated';

import deityImage from '@/assets/images/deity.png';
import { AnimationButton } from '@/components/AnimationButton/AnimationButton';
import Cloud from '@/components/Cloud/Cloud';
import { BUTTON_ANIMATION } from '@/constants/animationTypes';
import { SCREENS } from '@/constants/screens';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import { RootStackParamList } from '@/navigation/types';
import type { AppTheme } from '@/theme';
import { makeStyles } from './StartScreen.style';

type Props = NativeStackScreenProps<RootStackParamList, 'Start'>;

export default function StartScreen({ navigation }: Props) {
  const styles = useThemedStyles(makeStyles);
  const theme = useTheme<AppTheme>();
  const { t } = useTranslation();
  const dialog = useMemo(
    () => [
      t('start.dialog.first'),
      t('start.dialog.second'),
      t('start.dialog.third'),
      t('start.dialog.fourth'),
      t('start.dialog.fifth'),
    ],
    [t],
  );

  const [showButtonSection, setShowButtonSection] = useState(false);
  const [regBtnAnimation, setRegBtnAnimation] = useState(false);

  return (
    <ImageBackground source={deityImage} style={styles.container} resizeMode="cover">
      <View style={styles.cloudWrapper}>
        <Cloud
          dialog={dialog}
          onFinished={() => {
            setShowButtonSection(true);
          }}
        />
      </View>
      <View style={styles.buttonWrapper}>
        {showButtonSection ? (
          <Animated.View entering={FadeIn.duration(500)}>
            <AnimationButton
              type={BUTTON_ANIMATION.DROP_THEN_PULSE}
              buttonLabel={t('start.buttons.register')}
              buttonStyle={{
                backgroundColor: theme.custom.colors.success,
              }}
              animationStart={regBtnAnimation}
              navigateTo={() => navigation.navigate(SCREENS.REG)}
            />
            <AnimationButton
              type={BUTTON_ANIMATION.SWING_AND_FALL}
              buttonLabel={t('start.buttons.dismiss')}
              buttonStyle={{
                marginTop: theme.custom.spacing.m,
              }}
              onFinished={() => {
                setRegBtnAnimation(true);
              }}
            />
          </Animated.View>
        ) : null}
      </View>
    </ImageBackground>
  );
}
