import { createThemedStyles } from '@/theme/createThemedStyles';
import { PixelRatio } from 'react-native';

const thinLine = 1.5 / PixelRatio.get();

export const makeStyles = createThemedStyles(theme => ({
  regScreenContainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: theme.custom.spacing.screenPadding,
  },
  logoWrapper: {
    flex: 0.31,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 140,
    height: 140,
    opacity: 0.7,
    marginTop: 15,
  },
  content: {
    flex: 0.69,
    paddingBottom: 15,
    borderTopWidth: thinLine,
    borderTopColor: '#ddd',
  },
  scrollView: {
    flexGrow: 1,
  },
  card: {
    paddingTop: 4,
    paddingHorizontal: 0,
  },
  input: {
    height: theme.custom.spacing.inputHeight,
    marginTop: 6,
    padding: 0,
    fontSize: theme.custom.typography.input.fontSize,
    borderColor: '#ddd',
  },
  button: {
    width: '100%',
    padding: 1,
    borderRadius: theme.roundness,
    backgroundColor: '#626263ff',
  },
  helperText: {
    fontSize: theme.custom.typography.helperText.fontSize,
    lineHeight: theme.custom.typography.helperText.lineHeight,
  },
  infoWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 1,
    marginBottom: 3,
  },
  infoText: {
    paddingLeft: 7,
    fontSize: theme.custom.typography.infoText.fontSize,
    lineHeight: theme.custom.typography.infoText.lineHeight,
    color: theme.custom.colors.success,
    fontWeight: 'bold',
  },
  infoIcon: {
    paddingTop: 2,
    fontSize: 32,
    color: theme.custom.colors.success,
    fontWeight: '100',
  },
}));
