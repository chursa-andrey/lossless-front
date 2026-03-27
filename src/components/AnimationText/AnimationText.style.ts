import { createThemedStyles } from '@/theme/createThemedStyles';

export const makeStyles = createThemedStyles(theme => ({
  textRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  wordWrapper: {
    flexDirection: 'row',
    height: theme.custom.metrics.lh(theme.custom.typography.animationText.fontSize),
    overflow: 'hidden',
  },
  text: {
    fontSize: theme.custom.typography.animationText.fontSize,
    fontFamily: 'LXGWWenKaiMonoTC-Light',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
}));
