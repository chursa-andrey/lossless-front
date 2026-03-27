import { useState } from 'react';
import { ImageBackground, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import type { AppTheme } from '@/theme';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import { makeStyles } from './StartScreen.style';
import deityImage from '@/assets/images/deity.png';
import Cloud from '@/components/Cloud/Cloud';
import { AnimationButton } from '@/components/AnimationButton/AnimationButton';
import { BUTTON_ANIMATION } from '@/constants/animationTypes';
import Animated, { FadeIn } from 'react-native-reanimated';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { SCREENS } from '@/constants/screens';

const dialog = [
  'Привет мой пучеглазый друг!',
  'Упс, не то! :)',
  'Преветствую тебя многоуважаемый меломан!',
  'Меня зовут Lossless. Я местное божество :)',
  'Добро пожаловать в мой скромный храм качественной музыки!',
];

type Props = NativeStackScreenProps<RootStackParamList, 'Start'>;

export default function StartScreen({ navigation }: Props) {
  const styles = useThemedStyles(makeStyles);
  const theme = useTheme<AppTheme>();

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
        {showButtonSection && (
          <Animated.View entering={FadeIn.duration(500)}>
            <AnimationButton
              type={BUTTON_ANIMATION.DROP_THEN_PULSE}
              buttonLabel={'Регистрация'}
              buttonStyle={{
                backgroundColor: theme.custom.colors.success,
              }}
              animationStart={regBtnAnimation}
              navigateTo={() => navigation.navigate(SCREENS.REG)}
            />
            <AnimationButton
              type={BUTTON_ANIMATION.SWING_AND_FALL}
              buttonLabel={'Ой, иди в ..опу!'}
              buttonStyle={{
                marginTop: theme.custom.spacing.m,
              }}
              onFinished={() => {
                setRegBtnAnimation(true);
              }}
            />
          </Animated.View>
        )}
      </View>
    </ImageBackground>
  );
}
