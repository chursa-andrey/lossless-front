import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput as RNTextInput,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Card, Divider, HelperText, TextInput as PaperTextInput, useTheme } from 'react-native-paper';
import Animated from 'react-native-reanimated';
import Ionicons from 'react-native-vector-icons/Ionicons';

import gateImage from '@/assets/images/gate.png';
import logo from '@/assets/images/logo.png';
import { DefaultButton } from '@/components/DefaultButton/DefaultButton';
import { useRegScreenAuth } from '@/screens/RegScreen/useRegScreenAuth';
import { createRegSchema, type RegFormValues } from '@/features/auth/schemas/regSchema';
import { useZoomAndFadeIn } from '@/hooks/animations';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import type { AppTheme } from '@/theme';
import { makeStyles } from './RegScreen.style';

type PaperInputHandle = Pick<
  RNTextInput,
  'blur' | 'clear' | 'focus' | 'isFocused' | 'setNativeProps' | 'setSelection'
>;

export default function RegScreen() {
  const styles = useThemedStyles(makeStyles);
  const theme = useTheme<AppTheme>();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const regSchema = useMemo(() => createRegSchema(t), [t]);
  const isAppleLoginVisible = Platform.OS === 'ios';
  const passwordRef = useRef<PaperInputHandle | null>(null);

  const setPasswordRef = useCallback(
    (instance: RNTextInput | React.ComponentRef<typeof PaperTextInput> | null) => {
      passwordRef.current = instance as PaperInputHandle | null;
    },
    [],
  );

  const [showPass, setShowPass] = useState(false);
  const {
    control,
    handleSubmit,
    clearErrors,
    setError,
    formState: { errors, isSubmitted, isSubmitting },
  } = useForm<RegFormValues>({
    resolver: zodResolver(regSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
  });

  const { onSubmit, handleSocialLogin, socialSubmittingProvider, isAuthSubmitting } = useRegScreenAuth({
    clearErrors,
    setError,
    isSubmitting,
  });

  const { start, reset, style } = useZoomAndFadeIn({
    startOpacity: 0,
    startScale: 0.6,
    finalOpacity: 0.8,
    finalScale: 1,
    duration: 1000,
  });

  useFocusEffect(
    useCallback(() => {
      start();

      return () => {
        reset();
      };
    }, [reset, start]),
  );

  return (
    <ImageBackground source={gateImage} style={styles.regScreenContainer} resizeMode="cover">
      <Animated.View style={[styles.logoWrapper, style]}>
        <Image source={logo} style={styles.logo} resizeMode="contain" />
      </Animated.View>
      <View style={styles.content}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={insets.top}
        >
          <ScrollView contentContainerStyle={styles.scrollView} keyboardShouldPersistTaps="handled">
            <Card.Content style={styles.card}>
              <Controller
                control={control}
                name="email"
                render={({ field: { onBlur, onChange, value } }) => (
                  <PaperTextInput
                    style={styles.input}
                    label={t('auth.reg.fields.email')}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    mode="outlined"
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="email-address"
                    textContentType="emailAddress"
                    autoComplete="email"
                    error={!!errors.email}
                    returnKeyType="next"
                    submitBehavior="submit"
                    onSubmitEditing={() => {
                      passwordRef.current?.focus();
                    }}
                    disabled={isAuthSubmitting}
                  />
                )}
              />
              {isSubmitted && errors.email?.message ? (
                <HelperText type="error" style={styles.helperText} visible>
                  {errors.email.message}
                </HelperText>
              ) : null}

              <Controller
                control={control}
                name="password"
                render={({ field: { onBlur, onChange, value } }) => (
                  <PaperTextInput
                    ref={setPasswordRef}
                    style={styles.input}
                    label={t('auth.reg.fields.password')}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    mode="outlined"
                    secureTextEntry={!showPass}
                    textContentType="password"
                    autoComplete="password"
                    error={!!errors.password}
                    returnKeyType="done"
                    onSubmitEditing={handleSubmit(onSubmit)}
                    disabled={isAuthSubmitting}
                    right={
                      <PaperTextInput.Icon
                        icon={showPass ? 'eye' : 'eye-off'}
                        onPress={() => setShowPass(current => !current)}
                      />
                    }
                  />
                )}
              />
              {isSubmitted && errors.password?.message ? (
                <HelperText type="error" style={styles.helperText} visible>
                  {errors.password.message}
                </HelperText>
              ) : null}
              {errors.root?.message ? (
                <HelperText type="error" style={styles.helperText} visible>
                  {errors.root.message}
                </HelperText>
              ) : null}

              <DefaultButton
                label={t('auth.reg.buttons.continueWithEmail')}
                onPress={handleSubmit(onSubmit)}
                disabled={isAuthSubmitting}
                loading={isSubmitting}
                buttonStyle={{
                  backgroundColor: theme.custom.colors.success,
                }}
              />

              <View style={styles.infoWrapper}>
                <Ionicons name="information-circle-outline" style={styles.infoIcon} />
                <HelperText type="info" style={styles.infoText}>
                  {t('auth.reg.info.unifiedFlow')}
                </HelperText>
              </View>

              <Divider style={{ marginVertical: theme.custom.spacing.xs }} />

              <DefaultButton
                label={t('auth.reg.buttons.loginWithGoogle')}
                icon="google"
                disabled={isAuthSubmitting}
                loading={socialSubmittingProvider === 'google'}
                onPress={() => handleSocialLogin('google')}
              />
              {isAppleLoginVisible ? (
                <DefaultButton
                  label={t('auth.reg.buttons.loginWithApple')}
                  icon="apple"
                  disabled={isAuthSubmitting}
                  loading={socialSubmittingProvider === 'apple'}
                  onPress={() => handleSocialLogin('apple')}
                />
              ) : null}
              <DefaultButton
                label={t('auth.reg.buttons.loginWithFacebook')}
                icon="facebook"
                disabled={isAuthSubmitting}
                loading={socialSubmittingProvider === 'facebook'}
                onPress={() => handleSocialLogin('facebook')}
              />
            </Card.Content>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </ImageBackground>
  );
}
