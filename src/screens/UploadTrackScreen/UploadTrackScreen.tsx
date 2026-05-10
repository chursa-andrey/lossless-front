import { useCallback, useMemo, useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { zodResolver } from '@hookform/resolvers/zod';
import { errorCodes, isErrorWithCode, pick, types } from '@react-native-documents/picker';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  Card,
  HelperText,
  IconButton,
  Modal,
  Portal,
  Text,
  TextInput as PaperTextInput,
} from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DefaultButton } from '@/components/DefaultButton/DefaultButton';
import { SCREENS } from '@/constants/screens';
import { AuthHeader } from '@/features/navigation/components/AuthHeader';
import { AuthMenuBar } from '@/features/navigation/components/AuthMenuBar';
import { createFooterMenu, createHeaderMenu } from '@/features/navigation/config/authMenu';
import { TRACK_GENRES, type TrackGenre } from '@/features/tracks/config/genres';
import { getUploadTrackErrorMessage } from '@/features/tracks/errors/uploadTrackErrorMessages';
import { useUploadTrackMutation } from '@/features/tracks/hooks/useUploadTrackMutation';
import {
  createUploadTrackSchema,
  type UploadTrackFormValues,
} from '@/features/tracks/schemas/uploadTrackSchema';
import type { UploadTrackInput } from '@/features/tracks/types/uploadTrack';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import type { RootStackParamList } from '@/navigation/types';
import { makeStyles } from './UploadTrackScreen.style';

type Props = NativeStackScreenProps<RootStackParamList, 'UploadTrack'>;

const defaultValues: UploadTrackFormValues = {
  trackFile: null,
  genre: undefined as unknown as TrackGenre,
  trackTitle: '',
  artistName: '',
  albumTitle: '',
  purchaseLinks: [{ url: '' }],
};

function toUploadTrackInput(values: UploadTrackFormValues): UploadTrackInput {
  if (!values.trackFile) {
    throw new Error('Track file is required');
  }

  return {
    trackFile: values.trackFile,
    genre: values.genre,
    trackTitle: values.trackTitle,
    artistName: values.artistName,
    albumTitle: values.albumTitle,
    purchaseLinks: values.purchaseLinks.map(({ url }) => url.trim()).filter(Boolean),
  };
}

export default function UploadTrackScreen({ navigation }: Props) {
  const styles = useThemedStyles(makeStyles);
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const uploadTrackSchema = useMemo(() => createUploadTrackSchema(t), [t]);
  const uploadTrackMutation = useUploadTrackMutation();
  const [isGenreMenuVisible, setIsGenreMenuVisible] = useState(false);
  const [isUploadSuccess, setIsUploadSuccess] = useState(false);
  const headerMenuItems = createHeaderMenu({
    onHomePress: () => navigation.navigate(SCREENS.HOME),
  });
  const footerMenuItems = createFooterMenu({
    currentScreen: SCREENS.UPLOAD_TRACK,
    onRewardPress: () => navigation.navigate(SCREENS.HOME),
    onProfilePress: () => navigation.navigate(SCREENS.PROFILE),
  });

  const {
    control,
    handleSubmit,
    setError,
    clearErrors,
    reset,
    formState: { errors, isSubmitted },
  } = useForm<UploadTrackFormValues>({
    resolver: zodResolver(uploadTrackSchema),
    defaultValues,
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'purchaseLinks',
  });
  const isSubmitting = uploadTrackMutation.isPending;
  const openGenreMenu = useCallback(() => {
    if (isSubmitting) {
      return;
    }

    Keyboard.dismiss();
    setIsGenreMenuVisible(true);
  }, [isSubmitting]);

  const handlePickTrack = useCallback(
    async (onChange: (value: UploadTrackFormValues['trackFile']) => void) => {
      try {
        const [file] = await pick({
          type: [types.audio],
          allowMultiSelection: false,
        });

        onChange(file);
        setIsUploadSuccess(false);
        clearErrors('trackFile');
      } catch (error) {
        if (isErrorWithCode(error) && error.code === errorCodes.OPERATION_CANCELED) {
          return;
        }

        setError('trackFile', {
          type: 'manual',
          message: t('uploadTrack.errors.filePicker'),
        });
      }
    },
    [clearErrors, setError, t],
  );

  const onSubmit = async (values: UploadTrackFormValues) => {
    setIsUploadSuccess(false);

    try {
      await uploadTrackMutation.mutateAsync(toUploadTrackInput(values));
      reset(defaultValues);
      setIsUploadSuccess(true);
    } catch (error) {
      setError('root', {
        type: 'server',
        message: getUploadTrackErrorMessage(error),
      });
    }
  };

  return (
    <View style={styles.container}>
      <AuthHeader items={headerMenuItems} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={insets.top}
      >
        <ScrollView
          style={styles.scrollArea}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="always"
          showsVerticalScrollIndicator={false}
        >
          <Card.Content style={styles.card}>
            <Text style={styles.title}>{t('uploadTrack.title')}</Text>

            <Controller
              control={control}
              name="trackFile"
              render={({ field: { onChange, value } }) => (
                <Pressable
                  onPress={() => {
                    handlePickTrack(onChange).catch(() => undefined);
                  }}
                >
                  <PaperTextInput
                    style={styles.input}
                    label={t('uploadTrack.fields.trackFile')}
                    value={value?.name ?? ''}
                    mode="outlined"
                    editable={false}
                    pointerEvents="none"
                    error={!!errors.trackFile}
                    disabled={isSubmitting}
                    right={
                      <PaperTextInput.Icon
                        icon="file-upload-outline"
                        disabled={isSubmitting}
                        onPress={() => {
                          handlePickTrack(onChange).catch(() => undefined);
                        }}
                      />
                    }
                  />
                </Pressable>
              )}
            />
            {isSubmitted && errors.trackFile?.message ? (
              <HelperText type="error" style={styles.helperText} visible>
                {errors.trackFile.message}
              </HelperText>
            ) : null}

            <Controller
              control={control}
              name="genre"
              render={({ field: { onChange, value } }) => (
                <>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={t('uploadTrack.fields.genre')}
                    disabled={isSubmitting}
                    onPress={openGenreMenu}
                  >
                    <PaperTextInput
                      style={styles.input}
                      label={t('uploadTrack.fields.genre')}
                      value={value ? t(`uploadTrack.genres.${value}`) : ''}
                      mode="outlined"
                      editable={false}
                      pointerEvents="none"
                      error={!!errors.genre}
                      disabled={isSubmitting}
                      right={
                        <PaperTextInput.Icon
                          icon="menu-down"
                          disabled={isSubmitting}
                          onPress={openGenreMenu}
                        />
                      }
                    />
                  </Pressable>

                  <Portal>
                    <Modal
                      visible={isGenreMenuVisible}
                      onDismiss={() => setIsGenreMenuVisible(false)}
                      contentContainerStyle={styles.genreModal}
                    >
                      <Text style={styles.genreModalTitle}>
                        {t('uploadTrack.fields.genre')}
                      </Text>
                      <ScrollView
                        style={styles.genreModalList}
                        keyboardShouldPersistTaps="always"
                        showsVerticalScrollIndicator={false}
                      >
                        {TRACK_GENRES.map(genre => {
                          const isSelected = value === genre;

                          return (
                            <Pressable
                              key={genre}
                              accessibilityRole="button"
                              style={[
                                styles.genreOption,
                                isSelected ? styles.genreOptionActive : null,
                              ]}
                              onPress={() => {
                                onChange(genre);
                                setIsGenreMenuVisible(false);
                                setIsUploadSuccess(false);
                                clearErrors('genre');
                              }}
                            >
                              <Text
                                style={[
                                  styles.genreOptionText,
                                  isSelected ? styles.genreOptionTextActive : null,
                                ]}
                              >
                                {t(`uploadTrack.genres.${genre}`)}
                              </Text>
                            </Pressable>
                          );
                        })}
                      </ScrollView>
                    </Modal>
                  </Portal>
                </>
              )}
            />
            {isSubmitted && errors.genre?.message ? (
              <HelperText type="error" style={styles.helperText} visible>
                {errors.genre.message}
              </HelperText>
            ) : null}

            <Controller
              control={control}
              name="trackTitle"
              render={({ field: { onBlur, onChange, value } }) => (
                <PaperTextInput
                  style={styles.input}
                  label={t('uploadTrack.fields.trackTitle')}
                  value={value}
                  onChangeText={text => {
                    setIsUploadSuccess(false);
                    onChange(text);
                  }}
                  onBlur={onBlur}
                  mode="outlined"
                  error={!!errors.trackTitle}
                  returnKeyType="next"
                  disabled={isSubmitting}
                />
              )}
            />
            {isSubmitted && errors.trackTitle?.message ? (
              <HelperText type="error" style={styles.helperText} visible>
                {errors.trackTitle.message}
              </HelperText>
            ) : null}

            <Controller
              control={control}
              name="artistName"
              render={({ field: { onBlur, onChange, value } }) => (
                <PaperTextInput
                  style={styles.input}
                  label={t('uploadTrack.fields.artistName')}
                  value={value}
                  onChangeText={text => {
                    setIsUploadSuccess(false);
                    onChange(text);
                  }}
                  onBlur={onBlur}
                  mode="outlined"
                  error={!!errors.artistName}
                  returnKeyType="next"
                  disabled={isSubmitting}
                />
              )}
            />
            {isSubmitted && errors.artistName?.message ? (
              <HelperText type="error" style={styles.helperText} visible>
                {errors.artistName.message}
              </HelperText>
            ) : null}

            <Controller
              control={control}
              name="albumTitle"
              render={({ field: { onBlur, onChange, value } }) => (
                <PaperTextInput
                  style={styles.input}
                  label={t('uploadTrack.fields.albumTitle')}
                  value={value}
                  onChangeText={text => {
                    setIsUploadSuccess(false);
                    onChange(text);
                  }}
                  onBlur={onBlur}
                  mode="outlined"
                  error={!!errors.albumTitle}
                  returnKeyType="next"
                  disabled={isSubmitting}
                />
              )}
            />
            {isSubmitted && errors.albumTitle?.message ? (
              <HelperText type="error" style={styles.helperText} visible>
                {errors.albumTitle.message}
              </HelperText>
            ) : null}

            <View style={styles.separator} />

            {fields.map((field, index) => (
              <View key={field.id}>
                <View style={styles.linkRow}>
                  <Controller
                    control={control}
                    name={`purchaseLinks.${index}.url`}
                    render={({ field: { onBlur, onChange, value } }) => (
                      <PaperTextInput
                        style={[styles.input, styles.linkInput]}
                        label={t('uploadTrack.fields.purchaseLink')}
                        value={value}
                        onChangeText={text => {
                          setIsUploadSuccess(false);
                          onChange(text);
                        }}
                        onBlur={onBlur}
                        mode="outlined"
                        autoCapitalize="none"
                        autoCorrect={false}
                        keyboardType="url"
                        error={!!errors.purchaseLinks?.[index]?.url}
                        disabled={isSubmitting}
                      />
                    )}
                  />
                  {fields.length > 1 ? (
                    <IconButton
                      icon="minus-circle-outline"
                      size={24}
                      style={styles.iconButton}
                      disabled={isSubmitting}
                      accessibilityLabel={t('uploadTrack.actions.removePurchaseLink')}
                      onPress={() => remove(index)}
                    />
                  ) : null}
                </View>
                {isSubmitted && errors.purchaseLinks?.[index]?.url?.message ? (
                  <HelperText type="error" style={styles.helperText} visible>
                    {errors.purchaseLinks[index]?.url?.message}
                  </HelperText>
                ) : null}
              </View>
            ))}

            <IconButton
              icon="plus-circle-outline"
              size={26}
              style={styles.addLinkButton}
              disabled={isSubmitting}
              accessibilityLabel={t('uploadTrack.actions.addPurchaseLink')}
              onPress={() => append({ url: '' })}
            />

            {errors.root?.message ? (
              <HelperText type="error" style={styles.helperText} visible>
                {errors.root.message}
              </HelperText>
            ) : null}
            {isUploadSuccess ? (
              <HelperText type="info" style={styles.successText} visible>
                {t('uploadTrack.messages.uploadSuccess')}
              </HelperText>
            ) : null}

            <DefaultButton
              label={t('uploadTrack.actions.submit')}
              onPress={handleSubmit(onSubmit)}
              loading={isSubmitting}
              disabled={isSubmitting}
              buttonStyle={styles.submitButton}
              labelButtonStyle={styles.submitLabel}
            />
          </Card.Content>
        </ScrollView>
      </KeyboardAvoidingView>

      <AuthMenuBar items={footerMenuItems} />
    </View>
  );
}
