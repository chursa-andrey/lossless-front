import { PixelRatio } from 'react-native';

import { createThemedStyles } from '@/theme/createThemedStyles';

const thinLine = 1.5 / PixelRatio.get();

export const makeStyles = createThemedStyles(theme => ({
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
    borderColor: '#ddd',
    borderRadius: 8,
    borderWidth: thinLine,
    elevation: 1,
    marginBottom: theme.custom.spacing.m,
    padding: theme.custom.spacing.cardPadding,
  },
  activeCard: {
    borderColor: theme.custom.colors.primary,
  },
  playerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    minHeight: 52,
  },
  playButton: {
    height: 44,
    margin: 0,
    marginRight: theme.custom.spacing.s,
    width: 44,
  },
  progressColumn: {
    flex: 1,
  },
  progressTrack: {
    backgroundColor: '#e4e4e4',
    borderRadius: 3,
    height: 6,
    overflow: 'hidden',
  },
  progressTrackDisabled: {
    opacity: 0.55,
  },
  progressFill: {
    backgroundColor: theme.custom.colors.primary,
    height: '100%',
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.custom.space(1),
  },
  timeText: {
    ...theme.custom.typography.helperText,
    color: theme.custom.colors.textSecondary,
    minWidth: 42,
  },
  loadingSlot: {
    alignItems: 'center',
    height: 24,
    justifyContent: 'center',
    marginLeft: theme.custom.spacing.s,
    width: 24,
  },
  metaRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.custom.spacing.s,
  },
  genre: {
    ...theme.custom.typography.infoText,
    color: theme.custom.colors.primary,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  uploader: {
    ...theme.custom.typography.infoText,
    color: theme.custom.colors.textSecondary,
    flexShrink: 1,
    marginLeft: theme.custom.spacing.s,
    textAlign: 'right',
  },
  title: {
    ...theme.custom.typography.h2,
    color: theme.custom.colors.textPrimary,
    marginTop: theme.custom.spacing.xs,
  },
  artist: {
    ...theme.custom.typography.body,
    color: theme.custom.colors.textSecondary,
    marginTop: theme.custom.space(1),
  },
  errorText: {
    ...theme.custom.typography.infoText,
    color: theme.custom.colors.error,
    marginTop: theme.custom.spacing.s,
  },
  moreButton: {
    alignSelf: 'flex-start',
    marginLeft: -theme.custom.spacing.s,
    marginTop: theme.custom.spacing.xs,
  },
  details: {
    borderTopColor: '#e5e5e5',
    borderTopWidth: thinLine,
    marginTop: theme.custom.spacing.s,
    paddingTop: theme.custom.spacing.s,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.custom.spacing.xs,
  },
  detailLabel: {
    ...theme.custom.typography.infoText,
    color: theme.custom.colors.textSecondary,
    flex: 1,
  },
  detailValue: {
    ...theme.custom.typography.infoText,
    color: theme.custom.colors.textPrimary,
    flex: 1.3,
    textAlign: 'right',
  },
  purchaseLinks: {
    marginTop: theme.custom.spacing.xs,
  },
  purchaseLinkContent: {
    justifyContent: 'flex-start',
  },
  purchaseLinkLabel: {
    marginHorizontal: 0,
    textAlign: 'left',
  },
  purchaseLinkError: {
    ...theme.custom.typography.infoText,
    color: theme.custom.colors.error,
    marginTop: theme.custom.spacing.xs,
  },
}));
