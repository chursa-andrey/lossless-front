import {
  Easing,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';

type DropThenPulse = {
  onFinished?: () => void;
};

export function useDropThenPulse({ onFinished = () => {} }: DropThenPulse) {
  const offsetY = useSharedValue(0);
  const scale = useSharedValue(1);

  const start = () => {
    cancelAnimation(offsetY);
    cancelAnimation(scale);
    offsetY.value = 0;
    scale.value = 1;

    // offsetY.value = withTiming(35, { duration: 250, easing: Easing.out(Easing.cubic) });

    scale.value = withDelay(
      250 + 120,
      withRepeat(
        withSequence(
          withTiming(1.04, { duration: 200, easing: Easing.inOut(Easing.quad) }),
          withTiming(1, { duration: 200, easing: Easing.inOut(Easing.quad) }, finished => {
            if (!finished) return;

            if (onFinished) {
              runOnJS(onFinished)();
            }
          }),
        ),
        2,
        false,
      ),
    );
  };

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: offsetY.value }, { scale: scale.value }],
  }));

  return { style, start };
}
