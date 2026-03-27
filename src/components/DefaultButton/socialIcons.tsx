// socialIcons.tsx
import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

export type SocialIconName = 'google' | 'apple' | 'facebook';

const ICONS: Record<SocialIconName, (p: { size: number; color: string }) => React.ReactNode> = {
  google: ({ size, color }) => <MaterialCommunityIcons name="google" size={size} color={color} />,
  apple: ({ size, color }) => <Ionicons name="logo-apple" size={size} color={color} />,
  facebook: ({ size, color }) => (
    <MaterialCommunityIcons name="facebook" size={size} color={color} />
  ),
};

export const renderSocialIcon = (name: SocialIconName, size: number, color: string) =>
  ICONS[name]({ size, color });
