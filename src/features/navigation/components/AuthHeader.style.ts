import { createThemedStyles } from '@/theme/createThemedStyles';

export const makeStyles = createThemedStyles(theme => ({
  container: {
    alignItems: 'stretch',
  },
  logoWrapper: {
    alignItems: 'center',
    marginBottom: theme.custom.spacing.xs,
    paddingVertical: theme.custom.spacing.xs,
  },
  logo: {
    width: 150,
    height: 55,
    opacity: 0.7,
  },
}));
