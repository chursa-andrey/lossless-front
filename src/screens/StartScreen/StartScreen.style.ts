import { createThemedStyles } from '@/theme/createThemedStyles';

export const makeStyles = createThemedStyles(theme => ({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: theme.custom.spacing.screenPadding,
  },
  cloudWrapper: {
    flex: 0.68,
    justifyContent: 'flex-end',
  },
  buttonWrapper: {
    flex: 0.32,
    paddingTop: theme.custom.spacing.xl,
  },
}));
