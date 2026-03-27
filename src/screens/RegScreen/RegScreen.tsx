import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  ImageBackground,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput as RNTextInput,
} from 'react-native';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import { makeStyles } from './RegScreen.style';
import { useTheme, HelperText } from 'react-native-paper';
import type { AppTheme } from '@/theme';
import gateImage from '@/assets/images/gate.png';
import logo from '@/assets/images/logo.png';
import { useFocusEffect } from '@react-navigation/native';
import Animated from 'react-native-reanimated';
import { useZoomAndFadeIn } from '@/hooks/animations';
import { Card, TextInput as PaperTextInput, Divider } from 'react-native-paper';
import { DefaultButton } from '@/components/DefaultButton/DefaultButton';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { regSchema, type RegFormValues } from '@/features/auth/schemas/regSchema';
import Ionicons from 'react-native-vector-icons/Ionicons';

type PaperInputHandle = Pick<
  RNTextInput,
  'focus' | 'clear' | 'blur' | 'isFocused' | 'setNativeProps' | 'setSelection'
>;

export default function RegScreen() {
  const styles = useThemedStyles(makeStyles);
  const theme = useTheme<AppTheme>();
  const insets = useSafeAreaInsets();

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

  const onSubmit = (data: RegFormValues) => {
    console.log('Form data:', data);
  };

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
    }, [start, reset]),
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
                render={({ field: { value, onChange, onBlur } }) => (
                  <PaperTextInput
                    style={styles.input}
                    label="Email"
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
                      console.log('email submit', passwordRef.current);
                      passwordRef.current?.focus();
                    }}
                    disabled={isSubmitting}
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
                render={({ field: { value, onChange, onBlur } }) => (
                  <PaperTextInput
                    ref={setPasswordRef}
                    style={styles.input}
                    label="Password"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    mode="outlined"
                    secureTextEntry={!showPass}
                    textContentType="newPassword"
                    autoComplete="password-new"
                    error={!!errors.password}
                    returnKeyType="done"
                    onSubmitEditing={handleSubmit(onSubmit)}
                    disabled={isSubmitting}
                    right={
                      <PaperTextInput.Icon
                        icon={showPass ? 'eye' : 'eye-off'}
                        onPress={() => setShowPass(v => !v)}
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

              <DefaultButton
                label="Продолжить с Email"
                onPress={handleSubmit(onSubmit)}
                disabled={isSubmitting}
                buttonStyle={{
                  backgroundColor: theme.custom.colors.success,
                }}
              />

              <View style={styles.infoWrapper}>
                <Ionicons name="information-circle-outline" style={styles.infoIcon} />
                <HelperText type="info" style={styles.infoText}>
                  Аккаунт существует — войдём. {'\n'}Если нет — создадим новый.
                </HelperText>
              </View>

              <Divider style={{ marginVertical: theme.custom.spacing.xs }} />

              <DefaultButton label="Войти с Google" icon="google" />
              <DefaultButton label="Войти с Apple" icon="apple" />
              <DefaultButton label="Войти с Facebook" icon="facebook" />
            </Card.Content>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </ImageBackground>
  );
}
