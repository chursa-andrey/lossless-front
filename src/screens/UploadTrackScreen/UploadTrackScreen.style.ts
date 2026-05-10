import { PixelRatio } from 'react-native';

import { createThemedStyles } from '@/theme/createThemedStyles';

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
    paddingHorizontal: 0,
    paddingTop: 4,
  },
  title: {
    ...theme.custom.typography.h2,
    color: theme.custom.colors.textPrimary,
    marginBottom: theme.custom.spacing.xs,
  },
  input: {
    height: theme.custom.spacing.inputHeight,
    marginTop: 6,
    padding: 0,
    fontSize: theme.custom.typography.input.fontSize,
    borderColor: '#ddd',
  },
  multilineInput: {
    minHeight: theme.custom.spacing.inputHeight,
    marginTop: 6,
    padding: 0,
    fontSize: theme.custom.typography.input.fontSize,
    borderColor: '#ddd',
  },
  genreModal: {
    marginHorizontal: theme.custom.spacing.screenPadding,
    padding: theme.custom.spacing.m,
    borderRadius: theme.roundness,
    backgroundColor: theme.custom.colors.backgroundColor,
    maxHeight: 440,
  },
  genreModalTitle: {
    ...theme.custom.typography.h2,
    color: theme.custom.colors.textPrimary,
    marginBottom: theme.custom.spacing.xs,
  },
  genreModalList: {
    maxHeight: 360,
  },
  genreOption: {
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: theme.custom.spacing.s,
    borderRadius: theme.roundness,
  },
  genreOptionActive: {
    backgroundColor: theme.custom.colors.surface,
  },
  genreOptionText: {
    ...theme.custom.typography.body,
    color: theme.custom.colors.textPrimary,
  },
  genreOptionTextActive: {
    color: theme.custom.colors.success,
    fontWeight: '600',
  },
  helperText: {
    fontSize: theme.custom.typography.helperText.fontSize,
    lineHeight: theme.custom.typography.helperText.lineHeight,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  linkInput: {
    flex: 1,
  },
  iconButton: {
    margin: 0,
    marginTop: 6,
  },
  addLinkButton: {
    alignSelf: 'flex-start',
    marginTop: theme.custom.spacing.xs,
    marginBottom: theme.custom.spacing.xs,
  },
  submitButton: {
    marginTop: theme.custom.spacing.s,
    backgroundColor: theme.custom.colors.success,
    borderRadius: theme.roundness,
  },
  submitLabel: {
    ...theme.custom.typography.body,
    fontWeight: '600',
    color: theme.colors.onPrimary,
  },
  successText: {
    paddingLeft: 0,
    fontSize: theme.custom.typography.infoText.fontSize,
    lineHeight: theme.custom.typography.infoText.lineHeight,
    color: theme.custom.colors.success,
    fontWeight: 'bold',
  },
  separator: {
    height: thinLine,
    backgroundColor: '#ddd',
    marginTop: theme.custom.spacing.xs,
    marginBottom: theme.custom.spacing.xs,
  },
}));
