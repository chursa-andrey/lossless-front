import { View } from 'react-native';

import { useThemedStyles } from '@/hooks/useThemedStyles';
import { makeStyles } from './TrackFeedSkeletonFooter.style';

type TrackFeedSkeletonFooterProps = {
  visible: boolean;
};

const skeletonItems = [1, 2];

export function TrackFeedSkeletonFooter({ visible }: TrackFeedSkeletonFooterProps) {
  const styles = useThemedStyles(makeStyles);

  if (!visible) {
    return <View style={styles.footerSpacer} />;
  }

  return (
    <View style={styles.footer}>
      {skeletonItems.map(item => (
        <View key={item} style={styles.card}>
          <View style={styles.playerRow}>
            <View style={styles.playCircle} />
            <View style={styles.progressColumn}>
              <View style={styles.progressLine} />
              <View style={styles.timeRow}>
                <View style={styles.shortLine} />
                <View style={styles.shortLine} />
              </View>
            </View>
            <View style={styles.loadingSlot} />
          </View>

          <View style={styles.metaRow}>
            <View style={styles.genreLine} />
            <View style={styles.uploaderLine} />
          </View>
          <View style={styles.titleLine} />
          <View style={styles.artistLine} />
        </View>
      ))}
    </View>
  );
}
