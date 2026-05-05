import type { StyleProp, ViewStyle } from 'react-native';
import { Image, View } from 'react-native';

import logo from '@/assets/images/logo.png';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import { AuthMenuBar, type AuthMenuItem } from './AuthMenuBar';
import { makeStyles } from './AuthHeader.style';

type AuthHeaderProps = {
  items: AuthMenuItem[];
  containerStyle?: StyleProp<ViewStyle>;
};

export function AuthHeader({ items, containerStyle }: AuthHeaderProps) {
  const styles = useThemedStyles(makeStyles);

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.logoWrapper}>
        <Image source={logo} style={styles.logo} resizeMode="contain" />
      </View>
      <AuthMenuBar items={items} />
    </View>
  );
}
