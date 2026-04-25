import { StyleSheet } from 'react-native';

import type { AppTheme } from '@/theme';

export const makeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: theme.custom.spacing.l,
      backgroundColor: theme.custom.colors.backgroundColor,
    },
    title: {
      ...theme.custom.typography.h2,
      color: theme.custom.colors.textPrimary,
      textAlign: 'center',
    },
    subtitle: {
      ...theme.custom.typography.body,
      marginTop: theme.custom.spacing.s,
      color: theme.custom.colors.textSecondary,
      textAlign: 'center',
    },
    spinner: {
      marginBottom: theme.custom.spacing.m,
    },
  });
