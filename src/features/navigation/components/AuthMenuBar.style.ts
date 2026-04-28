import { PixelRatio } from 'react-native';

import { createThemedStyles } from '@/theme/createThemedStyles';

const thinLine = 1.5 / PixelRatio.get();

export const makeStyles = createThemedStyles(theme => ({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.custom.spacing.s,
    paddingVertical: theme.custom.spacing.xs,
    borderRadius: theme.roundness * 1.8,
    backgroundColor: 'rgba(255, 255, 255, 0.76)',
    borderWidth: thinLine,
    borderColor: 'rgba(119, 119, 119, 0.18)',
  },
  iconButton: {
    margin: 0,
  },
}));
