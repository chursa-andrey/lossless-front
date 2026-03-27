import { useCallback } from 'react';
import {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  runOnJS,
  cancelAnimation,
} from 'react-native-reanimated';

type ZoomAndFadeIn = {
  startOpacity?: number;
  startScale?: number;
  finalOpacity?: number;
  finalScale?: number;
  duration?: number;
  onFinished?: () => void;
};

export function useZoomAndFadeIn({
  startOpacity = 0,
  startScale = 0.95,
  finalOpacity = 1,
  finalScale = 1,
  duration = 500,
  onFinished,
}: ZoomAndFadeIn) {
  const opacity = useSharedValue(startOpacity);
  const scale = useSharedValue(startScale);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const start = useCallback(() => {
    opacity.value = withTiming(finalOpacity, { duration });
    scale.value = withTiming(finalScale, { duration }, finished => {
      if (!finished) return;

      if (onFinished) {
        runOnJS(onFinished)();
      }
    });
  }, [opacity, scale, finalOpacity, finalScale, duration, onFinished]);

  const reset = useCallback(() => {
    cancelAnimation(opacity);
    cancelAnimation(scale);

    opacity.value = startOpacity;
    scale.value = startScale;
  }, [opacity, scale, startOpacity, startScale]);

  return { style, start, reset };
}
