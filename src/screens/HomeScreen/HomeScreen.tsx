import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, RefreshControl, View } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ActivityIndicator, Button, Text } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

import { SCREENS } from '@/constants/screens';
import { AuthHeader } from '@/features/navigation/components/AuthHeader';
import { AuthMenuBar } from '@/features/navigation/components/AuthMenuBar';
import { createFooterMenu, createHeaderMenu } from '@/features/navigation/config/authMenu';
import { TrackCard } from '@/features/tracks/components/TrackCard';
import { TrackFeedSkeletonFooter } from '@/features/tracks/components/TrackFeedSkeletonFooter';
import { useTrackFeedQuery } from '@/features/tracks/hooks/useTrackFeedQuery';
import { usePlayerStore } from '@/features/tracks/player/playerStore';
import type { TrackFeedItem } from '@/features/tracks/types/trackFeed';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import type { RootStackParamList } from '@/navigation/types';
import { makeStyles } from './HomeScreen.style';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

type ScrollToIndexFailedInfo = {
  index: number;
  highestMeasuredFrameIndex: number;
  averageItemLength: number;
};

export default function HomeScreen({ navigation }: Props) {
  const themedStyles = useThemedStyles(makeStyles);
  const { t } = useTranslation();
  const isFocused = useIsFocused();
  const listRef = useRef<FlatList<TrackFeedItem>>(null);
  const wasFocusedRef = useRef(false);
  const pendingFocusScrollTrackIdRef = useRef<number | null>(null);
  const autoScrollFrameRef = useRef<number | null>(null);
  const autoScrollResetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const retryScrollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isAutoScrollingRef = useRef(false);
  const [showNextPageSkeleton, setShowNextPageSkeleton] = useState(false);
  const [isPullRefreshing, setIsPullRefreshing] = useState(false);
  const activeTrackId = usePlayerStore(state => state.activeTrackId);
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isError,
    isFetchingNextPage,
    isLoading,
    isRefetching,
    refetch,
  } = useTrackFeedQuery();
  const tracks = useMemo(
    () => data?.pages.flatMap(page => page.items) ?? [],
    [data],
  );
  const headerMenuItems = createHeaderMenu({
    currentScreen: SCREENS.HOME,
  });
  const footerMenuItems = createFooterMenu({
    currentScreen: SCREENS.HOME,
    onUploadTrackPress: () => navigation.navigate(SCREENS.UPLOAD_TRACK),
    onProfilePress: () => navigation.navigate(SCREENS.PROFILE),
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowNextPageSkeleton(isFetchingNextPage);
    }, isFetchingNextPage ? 250 : 0);

    return () => {
      clearTimeout(timer);
    };
  }, [isFetchingNextPage]);

  const clearAutoScrollTimers = useCallback(() => {
    if (autoScrollFrameRef.current != null) {
      cancelAnimationFrame(autoScrollFrameRef.current);
      autoScrollFrameRef.current = null;
    }

    if (autoScrollResetTimerRef.current) {
      clearTimeout(autoScrollResetTimerRef.current);
      autoScrollResetTimerRef.current = null;
    }

    if (retryScrollTimerRef.current) {
      clearTimeout(retryScrollTimerRef.current);
      retryScrollTimerRef.current = null;
    }
  }, []);

  useEffect(
    () => () => {
      clearAutoScrollTimers();
    },
    [clearAutoScrollTimers],
  );

  useEffect(() => {
    if (!isFocused) {
      wasFocusedRef.current = false;
      pendingFocusScrollTrackIdRef.current = null;
      return;
    }

    if (!wasFocusedRef.current) {
      wasFocusedRef.current = true;
      pendingFocusScrollTrackIdRef.current = activeTrackId;
    }
  }, [activeTrackId, isFocused]);

  useEffect(() => {
    const trackId = pendingFocusScrollTrackIdRef.current;

    if (!isFocused || !trackId || tracks.length === 0) {
      return undefined;
    }

    const activeTrackIndex = tracks.findIndex(track => track.id === trackId);

    if (activeTrackIndex < 0) {
      return undefined;
    }

    pendingFocusScrollTrackIdRef.current = null;
    clearAutoScrollTimers();
    isAutoScrollingRef.current = true;
    autoScrollFrameRef.current = requestAnimationFrame(() => {
      autoScrollFrameRef.current = null;
      listRef.current?.scrollToIndex({
        animated: true,
        index: activeTrackIndex,
        viewPosition: 0.35,
      });
    });
    autoScrollResetTimerRef.current = setTimeout(() => {
      isAutoScrollingRef.current = false;
      autoScrollResetTimerRef.current = null;
    }, 700);

    return () => {
      clearAutoScrollTimers();
      isAutoScrollingRef.current = false;
    };
  }, [clearAutoScrollTimers, isFocused, tracks]);

  const loadNextPage = () => {
    if (hasNextPage && !isFetchingNextPage && !isAutoScrollingRef.current) {
      fetchNextPage();
    }
  };

  const renderTrack = ({ item }: { item: TrackFeedItem }) => <TrackCard track={item} />;

  const renderListFooter = () => <TrackFeedSkeletonFooter visible={showNextPageSkeleton} />;

  const handleScrollToIndexFailed = useCallback((info: ScrollToIndexFailedInfo) => {
    const estimatedOffset = Math.max(info.averageItemLength * info.index, 0);

    listRef.current?.scrollToOffset({
      animated: false,
      offset: estimatedOffset,
    });

    retryScrollTimerRef.current = setTimeout(() => {
      retryScrollTimerRef.current = null;
      listRef.current?.scrollToIndex({
        animated: true,
        index: info.index,
        viewPosition: 0.35,
      });
    }, 80);
  }, []);

  const handleRefresh = () => {
    setIsPullRefreshing(true);
    refetch().finally(() => {
      setIsPullRefreshing(false);
    });
  };

  const renderListEmpty = () => {
    if (isLoading) {
      return (
        <View style={themedStyles.stateContainer}>
          <ActivityIndicator />
          <Text style={themedStyles.stateText}>{t('home.feed.loading')}</Text>
        </View>
      );
    }

    if (isError) {
      return (
        <View style={themedStyles.stateContainer}>
          <Text style={themedStyles.errorText}>{t('home.feed.error')}</Text>
          <Button mode="contained-tonal" onPress={handleRefresh}>
            {t('home.actions.retry', { defaultValue: 'Retry' })}
          </Button>
          {error ? <Text style={themedStyles.helperText}>{error.message}</Text> : null}
        </View>
      );
    }

    return (
      <View style={themedStyles.stateContainer}>
        <Text style={themedStyles.stateText}>{t('home.feed.empty')}</Text>
      </View>
    );
  };

  return (
    <View style={themedStyles.container}>
      <AuthHeader items={headerMenuItems} />

      <FlatList
        ref={listRef}
        style={themedStyles.listArea}
        contentContainerStyle={[themedStyles.listContent, tracks.length === 0 && themedStyles.emptyListContent]}
        data={tracks}
        keyExtractor={track => String(track.id)}
        renderItem={renderTrack}
        ListEmptyComponent={renderListEmpty}
        ListFooterComponent={renderListFooter}
        onEndReached={loadNextPage}
        onEndReachedThreshold={0.4}
        onScrollToIndexFailed={handleScrollToIndexFailed}
        refreshControl={<RefreshControl refreshing={isPullRefreshing && isRefetching} onRefresh={handleRefresh} />}
        showsVerticalScrollIndicator={false}
      />

      <AuthMenuBar items={footerMenuItems} />
    </View>
  );
}
