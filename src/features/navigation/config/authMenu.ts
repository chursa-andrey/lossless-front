import type { AuthMenuItem } from '@/features/navigation/components/AuthMenuBar';
import { SCREENS } from '@/constants/screens';
import iconLetter from '@/assets/icons/icon_letter.png';
import iconRadio from '@/assets/icons/icon_radio.png';
import iconTemple from '@/assets/icons/icon_tample.png';
import iconReward from '@/assets/icons/icon_reward.png';
import iconUploadTrack from '@/assets/icons/icon_upload_track.png';
import iconUploadTrackActive from '@/assets/icons/icon_upload_track_active.png';
import iconProfile from '@/assets/icons/icon_profile.png';
import iconProfileActive from '@/assets/icons/icon_profile_active.png';
import iconTempleActive from '@/assets/icons/icon_tample_active.png';
import i18n from '@/i18n';
import { createElement } from 'react';
import { Image, type ImageSourcePropType } from 'react-native';

type ActiveMenuScreen = typeof SCREENS.HOME | typeof SCREENS.PROFILE | typeof SCREENS.UPLOAD_TRACK;

type HeaderMenuOptions = {
  currentScreen?: ActiveMenuScreen;
  onHomePress?: () => void;
  onRadioPress?: () => void;
  onLetterPress?: () => void;
};

type FooterMenuOptions = {
  currentScreen?: ActiveMenuScreen;
  onRewardPress?: () => void;
  onUploadTrackPress?: () => void;
  onProfilePress?: () => void;
};

type CreateMenuItemOptions = {
  active?: boolean;
  onPress?: () => void;
};

function createImageIcon(source: ImageSourcePropType): AuthMenuItem['icon'] {
  return ({ size }) =>
    createElement(Image, {
      source,
      resizeMode: 'contain',
      style: {
        width: size,
        height: size,
      },
      accessibilityIgnoresInvertColors: true,
    });
}

function withOnPress(onPress?: () => void): Pick<CreateMenuItemOptions, 'onPress'> | object {
  return onPress ? { onPress } : {};
}

function createMenuItem(
  icon: AuthMenuItem['icon'],
  label: string,
  options: CreateMenuItemOptions = {},
): AuthMenuItem {
  const item: AuthMenuItem = {
    icon,
    label,
    active: options.active ?? false,
  };

  if (options.onPress) {
    item.onPress = options.onPress;
  }

  return item;
}

export function createHeaderMenu(options: HeaderMenuOptions = {}): AuthMenuItem[] {
  const isHomeActive = options.currentScreen === SCREENS.HOME;

  return [
    createMenuItem(
      createImageIcon(isHomeActive ? iconTempleActive : iconTemple),
      i18n.t('home.menu.home'),
      {
        active: isHomeActive,
        ...withOnPress(options.onHomePress),
      },
    ),
    createMenuItem(createImageIcon(iconRadio), i18n.t('home.menu.search'), {
      ...withOnPress(options.onRadioPress),
    }),
    createMenuItem(createImageIcon(iconLetter), i18n.t('home.menu.notifications'), {
      ...withOnPress(options.onLetterPress),
    }),
  ];
}

export function createFooterMenu(options: FooterMenuOptions = {}): AuthMenuItem[] {
  const isProfileActive = options.currentScreen === SCREENS.PROFILE;
  const isUploadTrackActive = options.currentScreen === SCREENS.UPLOAD_TRACK;

  return [
    createMenuItem(createImageIcon(iconReward), i18n.t('home.menu.library'), {
      ...withOnPress(options.onRewardPress),
    }),
    createMenuItem(
      createImageIcon(isUploadTrackActive ? iconUploadTrackActive : iconUploadTrack),
      i18n.t('home.menu.uploadTrack'),
      {
        active: isUploadTrackActive,
        ...withOnPress(options.onUploadTrackPress),
      },
    ),
    createMenuItem(
      createImageIcon(isProfileActive ? iconProfileActive : iconProfile),
      i18n.t('home.menu.profile'),
      {
        active: options.currentScreen === SCREENS.PROFILE,
        ...withOnPress(options.onProfilePress),
      },
    ),
  ];
}
