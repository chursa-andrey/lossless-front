import { useMemo, useEffect } from 'react';
import { View } from 'react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import { makeStyles } from './AnimationText.style';

type AnimationTextProps = {
  text: string;
  typingSpeed?: number;
  fontSize?: number;
  phaseDelay?: number;
  onFinished?: () => void;
};

export default function AnimationText({
  text,
  typingSpeed = 100,
  fontSize = 8,
  phaseDelay = 600,
  onFinished = () => {},
}: AnimationTextProps) {
  const styles = useThemedStyles(makeStyles);
  const words = useMemo(() => text.split(' '), [text]);
  const totalChars = useMemo(() => {
    return text.length;
  }, [text]);
  let globalCharIndex = 0;

  useEffect(() => {
    if (!onFinished) return;

    const totalDuration = totalChars * typingSpeed + phaseDelay;
    const timer = setTimeout(() => {
      onFinished();
    }, totalDuration);

    return () => clearTimeout(timer);
  }, [text, totalChars, typingSpeed, phaseDelay, onFinished]);

  return (
    <View style={styles.textRow}>
      {words.map((word, wordIndex) => {
        const chars = word.split('');
        return (
          <View key={`word-${wordIndex}`} style={styles.wordWrapper}>
            {chars.map((char, charIndex) => {
              const currentIndex = globalCharIndex;
              globalCharIndex += 1;
              const enteringAnimation = ZoomIn.duration(150)
                .springify()
                .damping(55)
                .delay(currentIndex * typingSpeed);

              return (
                <Animated.Text
                  key={`${char}-${charIndex}`}
                  entering={enteringAnimation}
                  style={[
                    styles.text,
                    char === ' ' && { width: fontSize * 0.3, fontSize: fontSize },
                  ]}
                >
                  {char}
                </Animated.Text>
              );
            })}

            {wordIndex < words.length - 1 && (
              <RenderSpace index={globalCharIndex++} speed={typingSpeed} fontSize={fontSize} />
            )}
          </View>
        );
      })}
    </View>
  );
}

type RenderSpaceProps = {
  index: number;
  speed: number;
  fontSize: number;
};

const RenderSpace = ({ index, speed, fontSize }: RenderSpaceProps) => (
  <Animated.Text
    entering={ZoomIn.delay(index * speed).duration(0)}
    style={{ width: fontSize * 0.3 }}
  >
    {' '}
  </Animated.Text>
);
