import { createThemedStyles } from '@/theme/createThemedStyles';

export const makeStyles = createThemedStyles(theme => ({
  button: {
    width: '100%',
    padding: 1,
    borderRadius: theme.roundness,
    backgroundColor: theme.custom.colors.defaultButton,
  },
  buttonLabelStyle: {
    fontSize: theme.custom.typography.button.fontSize,
  },
}));
