import { useEffect } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import { makeStyles } from './AnimationButton.style';
import { useDropThenPulse, useSwingAndFall } from '@/hooks/animations';
import { BUTTON_ANIMATION, ButtonAnimationType } from '@/constants/animationTypes';
import { Button } from 'react-native-paper';
import Animated from 'react-native-reanimated';

type AnimationButtonProps = {
  type: ButtonAnimationType;
  buttonLabel: string;
  buttonStyle?: StyleProp<ViewStyle>;
  animationStart?: boolean;
  onFinished?: () => void;
  navigateTo?: () => void;
};

export function AnimationButton({
  type,
  buttonLabel,
  buttonStyle,
  animationStart = false,
  onFinished = () => {},
  navigateTo,
}: AnimationButtonProps) {
  const styles = useThemedStyles(makeStyles);

  const drop = useDropThenPulse({ onFinished });
  const swing = useSwingAndFall({ onFinished });

  const active = type === BUTTON_ANIMATION.DROP_THEN_PULSE ? drop : swing;

  const onPress = () => {
    if (type === BUTTON_ANIMATION.SWING_AND_FALL) {
      active.start();
    }

    /** Reristration Button */
    if (type === BUTTON_ANIMATION.DROP_THEN_PULSE && navigateTo) {
      navigateTo();
    }
  };

  useEffect(() => {
    if (type === BUTTON_ANIMATION.DROP_THEN_PULSE && animationStart) {
      active.start();
    }
  }, [type, animationStart, active]);

  return (
    <Animated.View style={[active.style, { width: '100%', alignItems: 'center' }]}>
      <Button
        mode="contained"
        onPress={onPress}
        style={[styles.button, buttonStyle]}
        labelStyle={styles.buttonLabelStyle}
      >
        {buttonLabel}
      </Button>
    </Animated.View>
  );
}
