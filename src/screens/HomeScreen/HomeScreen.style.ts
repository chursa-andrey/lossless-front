import { createThemedStyles } from '@/theme/createThemedStyles';
import { PixelRatio } from 'react-native';

const thinLine = 1.5 / PixelRatio.get();

export const makeStyles = createThemedStyles(theme => ({
  container: {
    flex: 1,
    backgroundColor: theme.custom.colors.backgroundColor,
    paddingTop: theme.custom.spacing.xs,
  },
  scrollArea: {
    flex: 1,
    paddingVertical: theme.custom.spacing.m,
    paddingHorizontal: theme.custom.spacing.screenPadding,
  },
  scrollContent: {
    paddingBottom: theme.custom.spacing.m,
  },
  card: {
    marginBottom: theme.custom.spacing.m,
    borderRadius: theme.roundness * 1.6,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderWidth: thinLine,
    borderColor: '#ddd',
    elevation: 1,
  },
  cardTitle: {
    ...theme.custom.typography.h2,
    color: theme.custom.colors.textPrimary,
  },
  cardDescription: {
    ...theme.custom.typography.body,
    color: theme.custom.colors.textSecondary,
    marginTop: theme.custom.space(1.5),
  },
}));
