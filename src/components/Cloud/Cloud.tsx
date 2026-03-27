import { useState } from 'react';
import { ImageBackground, View } from 'react-native';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import { makeStyles } from './Cloud.style';
import cloudImage from '@/assets/images/cloud.png';
import AnimationText from '../AnimationText/AnimationText';

type CloudProps = {
  dialog: string[];
  onFinished?: () => void;
};

export default function Cloud({ dialog, onFinished = () => {} }: CloudProps) {
  const styles = useThemedStyles(makeStyles);
  const [index, setIndex] = useState(0);

  const nextPhrase = () => {
    if (dialog.length - 1 > index) {
      setIndex(prev => prev + 1);
    } else {
      onFinished();
    }
  };

  const currentText = dialog[index] ?? '.....';

  return (
    <ImageBackground
      source={cloudImage}
      style={styles.cloud}
      imageStyle={styles.cloudBgImg}
      resizeMode="contain"
    >
      <View style={styles.textWrapper}>
        <AnimationText key={index} text={currentText} onFinished={nextPhrase} />
      </View>
    </ImageBackground>
  );
}
