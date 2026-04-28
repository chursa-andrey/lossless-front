import type { AuthMenuItem } from '@/features/navigation/components/AuthMenuBar';
import { SCREENS } from '@/constants/screens';
import i18n from '@/i18n';

type ActiveMenuScreen = typeof SCREENS.HOME | typeof SCREENS.PROFILE;

type HeaderMenuOptions = {
  currentScreen?: ActiveMenuScreen;
  onHomePress?: () => void;
  onSearchPress?: () => void;
  onNotificationsPress?: () => void;
};

type FooterMenuOptions = {
  currentScreen?: ActiveMenuScreen;
  onLibraryPress?: () => void;
  onFavoritesPress?: () => void;
  onProfilePress?: () => void;
};

type CreateMenuItemOptions = {
  active?: boolean;
  onPress?: () => void;
};

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
  return [
    createMenuItem('home-outline', i18n.t('home.menu.home'), {
      active: options.currentScreen === SCREENS.HOME,
      ...withOnPress(options.onHomePress),
    }),
    createMenuItem('magnify', i18n.t('home.menu.search'), {
      ...withOnPress(options.onSearchPress),
    }),
    createMenuItem('bell-outline', i18n.t('home.menu.notifications'), {
      ...withOnPress(options.onNotificationsPress),
    }),
  ];
}

export function createFooterMenu(options: FooterMenuOptions = {}): AuthMenuItem[] {
  return [
    createMenuItem('bookshelf', i18n.t('home.menu.library'), {
      ...withOnPress(options.onLibraryPress),
    }),
    createMenuItem('heart-outline', i18n.t('home.menu.favorites'), {
      ...withOnPress(options.onFavoritesPress),
    }),
    createMenuItem('account-outline', i18n.t('home.menu.profile'), {
      active: options.currentScreen === SCREENS.PROFILE,
      ...withOnPress(options.onProfilePress),
    }),
  ];
}
