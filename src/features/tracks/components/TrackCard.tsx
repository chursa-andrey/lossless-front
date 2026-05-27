import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { Linking, Pressable, View, type GestureResponderEvent, type LayoutChangeEvent } from 'react-native';
import { ActivityIndicator, Button, IconButton, Text } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

import { usePlayerStore } from '@/features/tracks/player/playerStore';
import type { TrackFeedItem } from '@/features/tracks/types/trackFeed';
import {
  formatBitDepth,
  formatBitrate,
  formatChannels,
  formatDuration,
  formatSampleRate,
  resolveTrackFormat,
  resolveTrackTitle,
} from '@/features/tracks/utils/trackFormatting';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import { makeStyles } from './TrackCard.style';

type TrackCardProps = {
  track: TrackFeedItem;
};

type DetailRow = {
  label: string;
  value: string | number | null | undefined;
};

function TrackCardComponent({ track }: TrackCardProps) {
  const { t } = useTranslation();
  const styles = useThemedStyles(makeStyles);
  const [isExpanded, setIsExpanded] = useState(false);
  const [purchaseLinkError, setPurchaseLinkError] = useState<string | null>(null);
  const isActive = usePlayerStore(state => state.activeTrackId === track.id);
  const error = usePlayerStore(state => (state.activeTrackId === track.id ? state.error : null));
  const title = resolveTrackTitle(track);

  const details = useMemo<DetailRow[]>(
    () =>
      [
        { label: t('home.trackDetails.album'), value: track.albumTitle },
        { label: t('home.trackDetails.format'), value: resolveTrackFormat(track.audio) },
        { label: t('home.trackDetails.codec'), value: track.audio?.codec },
        {
          label: t('home.trackDetails.duration'),
          value: track.audio?.durationSeconds ? formatDuration(track.audio.durationSeconds) : null,
        },
        { label: t('home.trackDetails.sampleRate'), value: formatSampleRate(track.audio?.sampleRateHz) },
        { label: t('home.trackDetails.bitDepth'), value: formatBitDepth(track.audio?.bitDepth) },
        { label: t('home.trackDetails.channels'), value: formatChannels(track.audio?.channels) },
        { label: t('home.trackDetails.bitrate'), value: formatBitrate(track.audio?.bitrateKbps) },
      ].filter(detail => detail.value != null && String(detail.value).trim().length > 0),
    [t, track.albumTitle, track.audio],
  );

  const openPurchaseLink = useCallback(
    async (url: string) => {
      setPurchaseLinkError(null);

      try {
        const canOpen = await Linking.canOpenURL(url);

        if (!canOpen) {
          setPurchaseLinkError(t('home.trackDetails.purchaseLinkOpenFailed'));
          return;
        }

        await Linking.openURL(url);
      } catch {
        setPurchaseLinkError(t('home.trackDetails.purchaseLinkOpenFailed'));
      }
    },
    [t],
  );

  return (
    <View style={[styles.card, isActive && styles.activeCard]}>
      <TrackPlayerRow track={track} />

      <View style={styles.metaRow}>
        <Text style={styles.genre}>{track.genre.name}</Text>
        <Text style={styles.uploader}>{track.uploadedBy.displayName}</Text>
      </View>

      <Text style={styles.title} numberOfLines={2}>
        {title}
      </Text>
      {track.artistName ? (
        <Text style={styles.artist} numberOfLines={1}>
          {track.artistName}
        </Text>
      ) : null}

      {isActive && error ? <Text style={styles.errorText}>{t('home.player.error')}</Text> : null}

      <Button
        mode="text"
        compact
        icon={isExpanded ? 'chevron-up' : 'chevron-down'}
        onPress={() => setIsExpanded(value => !value)}
        style={styles.moreButton}
      >
        {isExpanded
          ? t('home.actions.less', { defaultValue: 'Less' })
          : t('home.actions.more', { defaultValue: 'More' })}
      </Button>

      {isExpanded ? (
        <View style={styles.details}>
          {details.map(detail => (
            <View key={detail.label} style={styles.detailRow}>
              <Text style={styles.detailLabel}>{detail.label}</Text>
              <Text style={styles.detailValue}>{detail.value}</Text>
            </View>
          ))}

          {track.purchaseLinks.length > 0 ? (
            <View style={styles.purchaseLinks}>
              <Text style={styles.detailLabel}>{t('home.trackDetails.purchaseLinks')}</Text>
              {track.purchaseLinks.map(link => (
                <Button
                  key={`${link.position}-${link.url}`}
                  mode="text"
                  compact
                  onPress={() => {
                    openPurchaseLink(link.url).catch(() => undefined);
                  }}
                  contentStyle={styles.purchaseLinkContent}
                  labelStyle={styles.purchaseLinkLabel}
                >
                  {link.url}
                </Button>
              ))}
              {purchaseLinkError ? <Text style={styles.purchaseLinkError}>{purchaseLinkError}</Text> : null}
            </View>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

export const TrackCard = memo(TrackCardComponent);

function TrackPlayerRow({ track }: TrackCardProps) {
  const isActive = usePlayerStore(state => state.activeTrackId === track.id);

  if (isActive) {
    return <ActiveTrackPlayerRow track={track} />;
  }

  return <InactiveTrackPlayerRow track={track} />;
}

function ActiveTrackPlayerRow({ track }: TrackCardProps) {
  const { t } = useTranslation();
  const styles = useThemedStyles(makeStyles);
  const [progressWidth, setProgressWidth] = useState(0);
  const [showLoadingIndicator, setShowLoadingIndicator] = useState(false);
  const isPlaying = usePlayerStore(state => state.isPlaying);
  const isLoading = usePlayerStore(state => state.isLoading);
  const currentTime = usePlayerStore(state => state.currentTime);
  const playerDuration = usePlayerStore(state => state.duration);
  const toggle = usePlayerStore(state => state.toggle);
  const seek = usePlayerStore(state => state.seek);
  const fallbackDuration = track.audio?.durationSeconds ?? 0;
  const displayedDuration = playerDuration || fallbackDuration;
  const progress = displayedDuration > 0 ? Math.min(currentTime / displayedDuration, 1) : 0;
  const canSeek = displayedDuration > 0 && !isLoading;

  useEffect(() => {
    const timer = setTimeout(
      () => {
        setShowLoadingIndicator(isLoading);
      },
      isLoading ? 450 : 0,
    );

    return () => {
      clearTimeout(timer);
    };
  }, [isLoading]);

  const handleProgressLayout = (event: LayoutChangeEvent) => {
    setProgressWidth(event.nativeEvent.layout.width);
  };

  const handleSeekPress = (event: GestureResponderEvent) => {
    if (!canSeek || progressWidth <= 0) {
      return;
    }

    const nextProgress = Math.min(Math.max(event.nativeEvent.locationX / progressWidth, 0), 1);
    seek(nextProgress * displayedDuration);
  };

  return (
    <View style={styles.playerRow}>
      <IconButton
        mode="contained"
        icon={isPlaying ? 'pause' : 'play'}
        size={22}
        onPress={() => toggle(track)}
        style={styles.playButton}
        accessibilityLabel={isPlaying ? t('home.player.pause') : t('home.player.play')}
      />

      <View style={styles.progressColumn}>
        <Pressable
          disabled={!canSeek}
          onLayout={handleProgressLayout}
          onPress={handleSeekPress}
          style={[styles.progressTrack, displayedDuration <= 0 && styles.progressTrackDisabled]}
        >
          <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
        </Pressable>
        <View style={styles.timeRow}>
          <Text style={styles.timeText}>{formatDuration(currentTime)}</Text>
          <Text style={styles.timeText}>{formatDuration(displayedDuration)}</Text>
        </View>
      </View>

      <View style={styles.loadingSlot}>
        {showLoadingIndicator ? <ActivityIndicator size={18} /> : null}
      </View>
    </View>
  );
}

function InactiveTrackPlayerRow({ track }: TrackCardProps) {
  const { t } = useTranslation();
  const styles = useThemedStyles(makeStyles);
  const toggle = usePlayerStore(state => state.toggle);
  const displayedDuration = track.audio?.durationSeconds ?? 0;

  return (
    <View style={styles.playerRow}>
      <IconButton
        mode="contained"
        icon="play"
        size={22}
        onPress={() => toggle(track)}
        style={styles.playButton}
        accessibilityLabel={t('home.player.play')}
      />

      <View style={styles.progressColumn}>
        <Pressable disabled style={[styles.progressTrack, styles.progressTrackDisabled]}>
          <View style={[styles.progressFill, { width: '0%' }]} />
        </Pressable>
        <View style={styles.timeRow}>
          <Text style={styles.timeText}>{formatDuration(0)}</Text>
          <Text style={styles.timeText}>{formatDuration(displayedDuration)}</Text>
        </View>
      </View>

      <View style={styles.loadingSlot} />
    </View>
  );
}
