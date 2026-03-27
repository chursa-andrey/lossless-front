import { Dimensions, PixelRatio } from 'react-native';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

export const vw = (percent: number) => (SCREEN_W * percent) / 100;
export const vh = (percent: number) => (SCREEN_H * percent) / 100;

export const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const BASE_WIDTH = 375;

const MIN_SCALE = 0.9;
const MAX_SCALE = 1.2;

export const sp = (size: number) => {
  const scale = SCREEN_W / BASE_WIDTH;
  const clamped = Math.min(Math.max(scale, MIN_SCALE), MAX_SCALE);
  return Math.round(PixelRatio.roundToNearestPixel(size * clamped));
};

const lineHeightRatio = 1.4; // LXGWWenKaiMonoTC-Light

export const lh = (fontSize: number) => Math.ceil(fontSize * lineHeightRatio);
