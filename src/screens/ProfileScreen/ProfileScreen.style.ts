import { createThemedStyles } from '@/theme/createThemedStyles';
import { PixelRatio } from 'react-native';

const thinLine = 1.5 / PixelRatio.get();

export const makeStyles = createThemedStyles(theme => ({
  container: {
    flex: 1,
    backgroundColor: theme.custom.colors.backgroundColor,
    paddingHorizontal: theme.custom.spacing.screenPadding,
    paddingTop: theme.custom.spacing.xl,
    paddingBottom: theme.custom.spacing.s,
  },
  scrollArea: {
    flex: 1,
    marginVertical: theme.custom.spacing.s,
  },
  scrollContent: {
    paddingBottom: theme.custom.spacing.s,
  },
  card: {
    marginBottom: theme.custom.spacing.s,
    borderRadius: theme.roundness * 1.8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderWidth: thinLine,
    borderColor: '#ddd',
    elevation: 1,
  },
  sectionLabel: {
    ...theme.custom.typography.small,
    color: theme.custom.colors.success,
    fontWeight: '600',
    marginBottom: theme.custom.space(1.5),
  },
  title: {
    ...theme.custom.typography.h1,
    color: theme.custom.colors.textPrimary,
  },
  subtitle: {
    ...theme.custom.typography.body,
    color: theme.custom.colors.textSecondary,
    marginTop: theme.custom.space(2),
  },
  cardDescription: {
    ...theme.custom.typography.body,
    color: theme.custom.colors.textSecondary,
  },
  button: {
    marginTop: theme.custom.space(4),
    borderRadius: theme.roundness * 1.5,
  },
  buttonLabel: {
    ...theme.custom.typography.body,
    fontWeight: '600',
    color: theme.colors.onPrimary,
  },
}));
