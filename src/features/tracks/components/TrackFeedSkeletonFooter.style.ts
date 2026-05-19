import { PixelRatio } from 'react-native';

import { createThemedStyles } from '@/theme/createThemedStyles';

const thinLine = 1.5 / PixelRatio.get();

export const makeStyles = createThemedStyles(theme => {
  const skeletonColor = '#e6e6e6';
  const skeletonAccent = '#f0f0f0';

  return {
    footerSpacer: {
      height: theme.custom.spacing.m,
    },
    footer: {
      paddingBottom: theme.custom.spacing.m,
      paddingTop: theme.custom.spacing.xs,
    },
    card: {
      backgroundColor: 'rgba(255, 255, 255, 0.72)',
      borderColor: '#e4e4e4',
      borderRadius: 8,
      borderWidth: thinLine,
      marginBottom: theme.custom.spacing.m,
      padding: theme.custom.spacing.cardPadding,
    },
    playerRow: {
      alignItems: 'center',
      flexDirection: 'row',
      minHeight: 52,
    },
    playCircle: {
      backgroundColor: skeletonColor,
      borderRadius: 22,
      height: 44,
      marginRight: theme.custom.spacing.s,
      width: 44,
    },
    progressColumn: {
      flex: 1,
    },
    progressLine: {
      backgroundColor: skeletonColor,
      borderRadius: 3,
      height: 6,
    },
    timeRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: theme.custom.space(1),
    },
    shortLine: {
      backgroundColor: skeletonAccent,
      borderRadius: 4,
      height: 10,
      width: 38,
    },
    loadingSlot: {
      height: 24,
      marginLeft: theme.custom.spacing.s,
      width: 24,
    },
    metaRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: theme.custom.spacing.s,
    },
    genreLine: {
      backgroundColor: skeletonColor,
      borderRadius: 4,
      height: 12,
      width: 78,
    },
    uploaderLine: {
      backgroundColor: skeletonAccent,
      borderRadius: 4,
      height: 12,
      width: 96,
    },
    titleLine: {
      backgroundColor: skeletonColor,
      borderRadius: 5,
      height: 18,
      marginTop: theme.custom.spacing.xs,
      width: '72%',
    },
    artistLine: {
      backgroundColor: skeletonAccent,
      borderRadius: 4,
      height: 14,
      marginTop: theme.custom.space(1),
      width: '46%',
    },
  };
});
