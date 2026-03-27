export const spacing = (multiplier: number) => 4 * multiplier;

export const spacingTokens = {
  none: 0,

  xs: spacing(1),
  s: spacing(2),
  m: spacing(3),
  l: spacing(4),
  xl: spacing(6),
  xxl: spacing(8),
  xxxl: spacing(10),

  screenPadding: spacing(4),
  cardPadding: spacing(4),
  sectionGap: spacing(6),
  buttonHeight: spacing(12),
  inputHeight: spacing(11),
} as const;
