import { createThemedStyles } from '@/theme/createThemedStyles';

export const makeStyles = createThemedStyles(theme => ({
  root: {
    flex: 1,
    backgroundColor: theme.custom.colors.backgroundColor,
  },
  topSafeArea: {
    backgroundColor: theme.custom.colors.textPrimary,
  },
  content: {
    flex: 1,
    backgroundColor: theme.custom.colors.backgroundColor,
  },
  bottomSafeArea: {
    backgroundColor: theme.custom.colors.surface,
  },
}));
