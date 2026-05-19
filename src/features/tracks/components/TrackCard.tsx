import { useEffect, useMemo, useState } from 'react';
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

export function TrackCard({ track }: TrackCardProps) {
  const { t } = useTranslation();
  const styles = useThemedStyles(makeStyles);
  const [isExpanded, setIsExpanded] = useState(false);
  const [progressWidth, setProgressWidth] = useState(0);
  const [showLoadingIndicator, setShowLoadingIndicator] = useState(false);
  const activeTrackId = usePlayerStore(state => state.activeTrackId);
  const isPlaying = usePlayerStore(state => state.isPlaying);
  const isLoading = usePlayerStore(state => state.isLoading);
  const error = usePlayerStore(state => state.error);
  const currentTime = usePlayerStore(state => state.currentTime);
  const playerDuration = usePlayerStore(state => state.duration);
  const toggle = usePlayerStore(state => state.toggle);
  const seek = usePlayerStore(state => state.seek);
  const isActive = activeTrackId === track.id;
  const isTrackPlaying = isActive && isPlaying;
  const displayedCurrentTime = isActive ? currentTime : 0;
  const fallbackDuration = track.audio?.durationSeconds ?? 0;
  const displayedDuration = isActive ? playerDuration || fallbackDuration : fallbackDuration;
  const progress = displayedDuration > 0 ? Math.min(displayedCurrentTime / displayedDuration, 1) : 0;
  const canSeek = isActive && displayedDuration > 0 && !isLoading;
  const isProgressDimmed = !isActive || displayedDuration <= 0;
  const title = resolveTrackTitle(track);

  useEffect(() => {
    const shouldShowLoadingIndicator = isActive && isLoading;
    const timer = setTimeout(
      () => {
        setShowLoadingIndicator(shouldShowLoadingIndicator);
      },
      shouldShowLoadingIndicator ? 450 : 0,
    );

    return () => {
      clearTimeout(timer);
    };
  }, [isActive, isLoading]);

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

  const openPurchaseLink = (url: string) => {
    Linking.openURL(url).catch(() => undefined);
  };

  return (
    <View style={[styles.card, isActive && styles.activeCard]}>
      <View style={styles.playerRow}>
        <IconButton
          mode="contained"
          icon={isTrackPlaying ? 'pause' : 'play'}
          size={22}
          onPress={() => toggle(track.id)}
          style={styles.playButton}
          accessibilityLabel={isTrackPlaying ? t('home.player.pause') : t('home.player.play')}
        />

        <View style={styles.progressColumn}>
          <Pressable
            disabled={!canSeek}
            onLayout={handleProgressLayout}
            onPress={handleSeekPress}
            style={[styles.progressTrack, isProgressDimmed && styles.progressTrackDisabled]}
          >
            <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
          </Pressable>
          <View style={styles.timeRow}>
            <Text style={styles.timeText}>{formatDuration(displayedCurrentTime)}</Text>
            <Text style={styles.timeText}>{formatDuration(displayedDuration)}</Text>
          </View>
        </View>

        <View style={styles.loadingSlot}>
          {showLoadingIndicator ? <ActivityIndicator size={18} /> : null}
        </View>
      </View>

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
                  onPress={() => openPurchaseLink(link.url)}
                  contentStyle={styles.purchaseLinkContent}
                  labelStyle={styles.purchaseLinkLabel}
                >
                  {link.url}
                </Button>
              ))}
            </View>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}
