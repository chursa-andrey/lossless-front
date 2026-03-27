import { createThemedStyles } from '@/theme/createThemedStyles';

export const makeStyles = createThemedStyles(theme => ({
  cloud: {
    flex: 0.5,
    justifyContent: 'flex-end',
  },
  cloudBgImg: {
    width: '100%',
    height: '100%',
  },
  textWrapper: {
    flex: 0.64,
    justifyContent: 'center',
    paddingTop: theme.custom.spacing.l,
    paddingHorizontal: theme.custom.spacing.xxl,
  },
}));
