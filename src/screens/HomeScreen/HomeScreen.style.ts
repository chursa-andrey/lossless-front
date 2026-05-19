import { createThemedStyles } from '@/theme/createThemedStyles';

export const makeStyles = createThemedStyles(theme => ({
  container: {
    flex: 1,
    backgroundColor: theme.custom.colors.backgroundColor,
    paddingTop: theme.custom.spacing.xs,
  },
  listArea: {
    flex: 1,
    paddingVertical: theme.custom.spacing.m,
    paddingHorizontal: theme.custom.spacing.screenPadding,
  },
  listContent: {
    paddingBottom: theme.custom.spacing.m,
  },
  emptyListContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  stateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.custom.spacing.l,
    paddingVertical: theme.custom.spacing.xxl,
  },
  stateText: {
    ...theme.custom.typography.body,
    color: theme.custom.colors.textSecondary,
    marginTop: theme.custom.spacing.s,
    textAlign: 'center',
  },
  errorText: {
    ...theme.custom.typography.body,
    color: theme.custom.colors.error,
    marginBottom: theme.custom.spacing.s,
    textAlign: 'center',
  },
  helperText: {
    ...theme.custom.typography.helperText,
    color: theme.custom.colors.textSecondary,
    marginTop: theme.custom.spacing.s,
    textAlign: 'center',
  },
}));
