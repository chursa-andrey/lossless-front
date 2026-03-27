import { useWindowDimensions } from 'react-native';
import {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';

type SwingAndFall = {
  onFinished?: () => void;
};

export function useSwingAndFall({ onFinished = () => {} }: SwingAndFall) {
  const { height: screenH } = useWindowDimensions();

  const rot = useSharedValue(0);
  const y = useSharedValue(0);
  const x = useSharedValue(0);
  const opacity = useSharedValue(1);

  const start = () => {
    const startAngle = 2.45;
    const swingA = 0.65;
    const swingB = 2.45;
    const swingC = 0.65;

    rot.value = withSequence(
      withTiming(startAngle, {
        duration: 500,
        easing: Easing.inOut(Easing.quad),
      }),
      withDelay(80, withTiming(startAngle, { duration: 0 })),

      withRepeat(
        withSequence(
          withTiming(swingA, {
            duration: 550,
            easing: Easing.inOut(Easing.quad),
          }),
          withDelay(80, withTiming(swingA, { duration: 0 })),
          withTiming(swingB, {
            duration: 575,
            easing: Easing.inOut(Easing.quad),
          }),
          withDelay(80, withTiming(swingB, { duration: 0 })),
          withTiming(swingC, {
            duration: 600,
            easing: Easing.inOut(Easing.quad),
          }),
          withDelay(80, withTiming(swingC, { duration: 0 })),
        ),
        1,
        false,
      ),

      withTiming(swingC, {
        duration: 80,
        easing: Easing.out(Easing.linear),
      }),

      withTiming(-2.2, {
        duration: 520,
        easing: Easing.in(Easing.cubic),
      }),
    );

    y.value = withDelay(
      180 + 5 * (220 + 220),
      withTiming(screenH + 200, { duration: 700, easing: Easing.in(Easing.cubic) }),
    );

    x.value = withDelay(
      180 + 5 * (220 + 220),
      withTiming(-60, { duration: 700, easing: Easing.in(Easing.cubic) }),
    );

    opacity.value = withDelay(
      180 + 5 * (220 + 220) + 350,
      withTiming(0, { duration: 350 }, finished => {
        if (!finished) return;

        if (onFinished) {
          runOnJS(onFinished)();
        }
      }),
    );
  };

  const style = useAnimatedStyle(() => {
    const pivotX = -110;
    const pivotY = 5;

    return {
      opacity: opacity.value,
      transform: [
        { translateX: x.value },
        { translateY: y.value },

        { translateX: pivotX },
        { translateY: pivotY },
        { rotateZ: `${rot.value}rad` },
        { translateX: -pivotX },
        { translateY: -pivotY },
      ],
    };
  }, []);

  return { style, start };
}
