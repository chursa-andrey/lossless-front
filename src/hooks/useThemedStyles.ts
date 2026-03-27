import { useMemo } from 'react';
import { useTheme } from 'react-native-paper';
import { AppTheme } from '@/theme';

type MakeStyles<T> = (theme: AppTheme) => T;

export function useThemedStyles<T>(makeStyles: MakeStyles<T>): T {
  const theme = useTheme<AppTheme>();

  return useMemo(() => makeStyles(theme), [makeStyles, theme]);
}
