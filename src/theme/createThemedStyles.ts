import { StyleSheet } from 'react-native';
import type { ImageStyle, TextStyle, ViewStyle } from 'react-native';
import type { AppTheme } from './';

type AnyNamedStyles = Record<string, ViewStyle | TextStyle | ImageStyle>;

export function createThemedStyles<T extends AnyNamedStyles>(
  styles: (theme: AppTheme) => T,
): (theme: AppTheme) => T {
  return (theme: AppTheme) =>
    StyleSheet.create(styles(theme) as StyleSheet.NamedStyles<T>) as T;
}
