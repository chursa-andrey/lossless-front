export const BUTTON_ANIMATION = {
  SWING_AND_FALL: 'swingAndFall',
  DROP_THEN_PULSE: 'dropThenPulse',
} as const;

export type ButtonAnimationType = (typeof BUTTON_ANIMATION)[keyof typeof BUTTON_ANIMATION];
