import { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, RefreshControl, View } from 'react-native';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ActivityIndicator, Button, Text } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

import { SCREENS } from '@/constants/screens';
import { AuthHeader } from '@/features/navigation/components/AuthHeader';
import { AuthMenuBar } from '@/features/navigation/components/AuthMenuBar';
import { createFooterMenu, createHeaderMenu } from '@/features/navigation/config/authMenu';
import { TrackAudioPlayer } from '@/features/tracks/components/TrackAudioPlayer';
import { TrackCard } from '@/features/tracks/components/TrackCard';
import { TrackFeedSkeletonFooter } from '@/features/tracks/components/TrackFeedSkeletonFooter';
import { useTrackFeedQuery } from '@/features/tracks/hooks/useTrackFeedQuery';
import { usePlayerStore } from '@/features/tracks/player/playerStore';
import type { TrackFeedItem } from '@/features/tracks/types/trackFeed';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import type { RootStackParamList } from '@/navigation/types';
import { makeStyles } from './HomeScreen.style';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  const themedStyles = useThemedStyles(makeStyles);
  const { t } = useTranslation();
  const isFocused = useIsFocused();
  const [showNextPageSkeleton, setShowNextPageSkeleton] = useState(false);
  const stopPlayer = usePlayerStore(state => state.stop);
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

  useFocusEffect(
    useCallback(
      () => () => {
        stopPlayer();
      },
      [stopPlayer],
    ),
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowNextPageSkeleton(isFetchingNextPage);
    }, isFetchingNextPage ? 250 : 0);

    return () => {
      clearTimeout(timer);
    };
  }, [isFetchingNextPage]);

  const loadNextPage = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const renderTrack = ({ item }: { item: TrackFeedItem }) => <TrackCard track={item} />;

  const renderListFooter = () => <TrackFeedSkeletonFooter visible={showNextPageSkeleton} />;

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
          <Button mode="contained-tonal" onPress={() => refetch()}>
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
      {isFocused ? <TrackAudioPlayer tracks={tracks} /> : null}

      <FlatList
        style={themedStyles.listArea}
        contentContainerStyle={[themedStyles.listContent, tracks.length === 0 && themedStyles.emptyListContent]}
        data={tracks}
        keyExtractor={track => String(track.id)}
        renderItem={renderTrack}
        ListEmptyComponent={renderListEmpty}
        ListFooterComponent={renderListFooter}
        onEndReached={loadNextPage}
        onEndReachedThreshold={0.4}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
        showsVerticalScrollIndicator={false}
      />

      <AuthMenuBar items={footerMenuItems} />
    </View>
  );
}
