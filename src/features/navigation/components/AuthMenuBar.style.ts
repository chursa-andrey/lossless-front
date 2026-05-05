// import { PixelRatio } from 'react-native';

import { createThemedStyles } from '@/theme/createThemedStyles';

// const thinLine = 1.5 / PixelRatio.get();

export const makeStyles = createThemedStyles(theme => ({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.custom.spacing.s,
    borderWidth: 1.2,
    borderColor: '#ddd',
    backgroundColor: '#f5f5f5',
  },
  iconButton: {
    margin: 0,
    backgroundColor: '#f5f5f5',
  },
}));
