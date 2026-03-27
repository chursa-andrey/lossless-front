import { StyleSheet } from 'react-native';
import type { AppTheme } from '../../theme';

export const styles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: theme.custom.spacing.l,
      paddingTop: theme.custom.spacing.xl,
      backgroundColor: theme.custom.colors.backgroundColor,
    },
    title: {
      ...theme.custom.typography.h1,
      color: theme.custom.colors.textPrimary,
    },
    subtitle: {
      ...theme.custom.typography.body,
      color: theme.custom.colors.textSecondary,
      marginTop: theme.custom.space(2),
    },
    button: {
      marginTop: theme.custom.space(4),
      borderRadius: theme.roundness * 1.5,
    },
    buttonLabel: {
      ...theme.custom.typography.body,
      fontWeight: '600',
      color: theme.colors.onPrimary,
    },
  });
