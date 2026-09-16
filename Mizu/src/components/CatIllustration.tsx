import React, { useEffect, useRef } from 'react';
import { Animated, Image, StyleSheet } from 'react-native';
import { catArtwork } from '../data/catArtwork';
import { CatColor, CatMood } from '../types';

const moodLabels: Record<CatMood, string> = {
  sleeping: 'dormindo enrolado', stretching: 'se espreguiçando',
  playing: 'brincando', happy: 'sentado e contente',
  celebrating: 'comemorando com as patas para cima',
};
const colorLabels: Record<CatColor, string> = {
  white: 'branco', black: 'preto', gray: 'cinza', orange: 'laranja', siamese: 'siamês',
};
interface Props { color: CatColor; mood: CatMood; size?: number }

export const CatIllustration = ({ color, mood, size = 188 }: Props) => {
  const scale = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    const animation = Animated.sequence([
      Animated.timing(scale, { toValue: mood === 'celebrating' ? 1.04 : 1.015, duration: 150, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, friction: 7, tension: 90, useNativeDriver: true }),
    ]);
    animation.start();
    return () => { animation.stop(); scale.setValue(1); };
  }, [mood, scale]);
  return (
    <Animated.View accessible accessibilityRole="image"
      accessibilityLabel={`Gatinho ${colorLabels[color]} ${moodLabels[mood]}`}
      style={{ width: size, height: size * 0.95, transform: [{ scale }] }}>
      <Image accessible={false} source={catArtwork[color][mood]}
        resizeMode="contain" fadeDuration={0} style={styles.artwork} />
    </Animated.View>
  );
};
const styles = StyleSheet.create({
  artwork: { width: '100%', height: '100%', borderRadius: 20 },
});
