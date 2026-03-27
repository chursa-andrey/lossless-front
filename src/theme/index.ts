import { MD3LightTheme as DefaultTheme } from 'react-native-paper';
import { colors } from './color';
import { typography } from './typography';
import { spacing, spacingTokens } from './spacing';
import * as metrics from './metrics';

export const appTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    outline: colors.outline,
    primary: colors.primary,
    secondary: colors.primaryLight,
    background: colors.backgroundColor,
    surface: colors.surface,
    error: colors.error,
    onPrimary: colors.textOnPrimary,
    onBackground: colors.textPrimary,
    onSurface: colors.textPrimary,
  },
  fonts: {
    ...DefaultTheme.fonts,
    // body
    bodyLarge: { ...DefaultTheme.fonts.bodyLarge, fontFamily: 'Inter_24pt-Light' },
    bodyMedium: { ...DefaultTheme.fonts.bodyMedium, fontFamily: 'Inter_24pt-Light' },
    bodySmall: { ...DefaultTheme.fonts.bodySmall, fontFamily: 'Inter_24pt-Light' },

    // labels
    labelLarge: { ...DefaultTheme.fonts.labelLarge, fontFamily: 'Inter_24pt-Light' },
    labelMedium: { ...DefaultTheme.fonts.labelMedium, fontFamily: 'Inter_24pt-Light' },
    labelSmall: { ...DefaultTheme.fonts.labelSmall, fontFamily: 'Inter_24pt-Light' },

    // titles
    titleLarge: { ...DefaultTheme.fonts.titleLarge, fontFamily: 'Inter_24pt-Light' },
    titleMedium: { ...DefaultTheme.fonts.titleMedium, fontFamily: 'Inter_24pt-Light' },
    titleSmall: { ...DefaultTheme.fonts.titleSmall, fontFamily: 'Inter_24pt-Light' },

    // headlines / display
    headlineLarge: { ...DefaultTheme.fonts.headlineLarge, fontFamily: 'Inter_24pt-Light' },
    headlineMedium: { ...DefaultTheme.fonts.headlineMedium, fontFamily: 'Inter_24pt-Light' },
    headlineSmall: { ...DefaultTheme.fonts.headlineSmall, fontFamily: 'Inter_24pt-Light' },

    displayLarge: { ...DefaultTheme.fonts.displayLarge, fontFamily: 'Inter_24pt-Light' },
    displayMedium: { ...DefaultTheme.fonts.displayMedium, fontFamily: 'Inter_24pt-Light' },
    displaySmall: { ...DefaultTheme.fonts.displaySmall, fontFamily: 'Inter_24pt-Light' },
  },
  roundness: 10,
  custom: {
    colors,
    typography,
    space: spacing,
    spacing: spacingTokens,
    metrics,
  },
};

export type AppTheme = typeof appTheme;
