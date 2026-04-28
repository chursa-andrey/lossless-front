import type { StyleProp, ViewStyle } from 'react-native';
import { View } from 'react-native';
import { IconButton, useTheme } from 'react-native-paper';

import { useThemedStyles } from '@/hooks/useThemedStyles';
import type { AppTheme } from '@/theme';
import { makeStyles } from './AuthMenuBar.style';

type IconName = React.ComponentProps<typeof IconButton>['icon'];

export type AuthMenuItem = {
  icon: IconName;
  label: string;
  onPress?: () => void;
  active?: boolean;
};

type AuthMenuBarProps = {
  items: AuthMenuItem[];
  containerStyle?: StyleProp<ViewStyle>;
};

export function AuthMenuBar({ items, containerStyle }: AuthMenuBarProps) {
  const styles = useThemedStyles(makeStyles);
  const theme = useTheme<AppTheme>();

  return (
    <View style={[styles.container, containerStyle]}>
      {items.map(item =>
        item.onPress ? (
          <IconButton
            key={`${String(item.icon)}:${item.label}`}
            icon={item.icon}
            size={24}
            mode="contained-tonal"
            containerColor={theme.custom.colors.backgroundColor}
            iconColor={item.active ? theme.custom.colors.success : theme.custom.colors.textPrimary}
            style={styles.iconButton}
            accessibilityLabel={item.label}
            onPress={item.onPress}
          />
        ) : (
          <IconButton
            key={`${String(item.icon)}:${item.label}`}
            icon={item.icon}
            size={24}
            mode="contained-tonal"
            containerColor={theme.custom.colors.backgroundColor}
            iconColor={item.active ? theme.custom.colors.success : theme.custom.colors.textPrimary}
            style={styles.iconButton}
            accessibilityLabel={item.label}
          />
        ),
      )}
    </View>
  );
}
