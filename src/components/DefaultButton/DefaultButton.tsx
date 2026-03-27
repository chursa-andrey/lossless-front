import { StyleProp, ViewStyle, TextStyle, View } from 'react-native';
import { Button } from 'react-native-paper';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import { makeStyles } from './DefaultButton.style';
import { renderSocialIcon, SocialIconName } from './socialIcons';

import type { GestureResponderEvent } from 'react-native';

type DefaultButtonProps = {
  label: string;
  onPress?: (e: GestureResponderEvent) => void;
  disabled?: boolean;
  loading?: boolean;

  buttonStyle?: StyleProp<ViewStyle>;
  labelButtonStyle?: StyleProp<TextStyle>;
  icon?: SocialIconName;
};

export function DefaultButton({
  label,
  onPress,
  disabled = false,
  loading = false,
  buttonStyle,
  labelButtonStyle,
  icon,
}: DefaultButtonProps) {
  const styles = useThemedStyles(makeStyles);

  return (
    <View style={styles.buttonWrap}>
      {icon && <View style={styles.iconStyle}>{renderSocialIcon(icon, 20, 'white')}</View>}
      <Button
        mode="contained"
        {...(onPress ? { onPress } : {})}
        disabled={disabled}
        loading={loading}
        style={[styles.button, buttonStyle]}
        labelStyle={[styles.buttonLabelStyle, labelButtonStyle]}
      >
        {label}
      </Button>
    </View>
  );
}
