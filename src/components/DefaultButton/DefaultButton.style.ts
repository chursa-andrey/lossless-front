import { createThemedStyles } from '@/theme/createThemedStyles';

export const makeStyles = createThemedStyles(theme => ({
  buttonWrap: {
    marginTop: theme.custom.spacing.m,
    flex: 1,
  },
  button: {
    padding: 1,
    borderRadius: theme.roundness,
    backgroundColor: theme.custom.colors.defaultButton,
    justifyContent: 'center',
    zIndex: 1,
  },
  buttonLabelStyle: {
    textAlign: 'center',
    fontSize: theme.custom.typography.button.fontSize,
    color: '#fff',
  },
  iconStyle: {
    position: 'absolute',
    left: 16,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    zIndex: 10,
  },
}));
