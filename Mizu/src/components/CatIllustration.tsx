import React, { useEffect, useRef } from 'react';
import { Animated, Image, ImageSourcePropType, StyleSheet, View } from 'react-native';
import Svg, { G, Path } from 'react-native-svg';
import { colors as palette } from '../theme';
import { CatColor, CatMood } from '../types';

type CatPaint = { body: string; outline: string; face: string; detail: string };

const paints: Record<CatColor, CatPaint> = {
  white: { body: '#F1ECE5', outline: '#A99B8F', face: '#292826', detail: '#D4C5B8' },
  black: { body: '#20211F', outline: '#20211F', face: '#FAF7F0', detail: '#343632' },
  gray: { body: '#777E79', outline: '#5E6560', face: '#FAF7F0', detail: '#626964' },
  orange: { body: '#CB8248', outline: '#A96335', face: '#282623', detail: '#A96335' },
  siamese: { body: '#DACBB8', outline: '#988675', face: '#302C29', detail: '#5B4940' },
};

const bodySources: Record<CatMood, ImageSourcePropType> = {
  sleeping: require('../../assets/cats/sleeping.png'),
  stretching: require('../../assets/cats/stretching.png'),
  playing: require('../../assets/cats/playing.png'),
  happy: require('../../assets/cats/happy.png'),
  celebrating: require('../../assets/cats/celebrating.png'),
};

const moodLabels: Record<CatMood, string> = {
  sleeping: 'dormindo enrolado',
  stretching: 'se espreguiçando',
  playing: 'brincando com uma gota de água',
  happy: 'sentado e contente',
  celebrating: 'comemorando com as patas para cima',
};

const RingEyes = ({ paint, left, right, size = 7 }: { paint: CatPaint; left: [number, number]; right: [number, number]; size?: number }) => (
  <G fill="none" stroke={paint.face} strokeWidth="4.2" strokeLinecap="round">
    <Path d={`M${left[0] - size} ${left[1]}c0-${size + 2} ${size * 2}-${size + 2} ${size * 2} 0s-${size * 2} ${size + 2}-${size * 2} 0z`} />
    <Path d={`M${right[0] - size} ${right[1]}c0-${size + 2} ${size * 2}-${size + 2} ${size * 2} 0s-${size * 2} ${size + 2}-${size * 2} 0z`} />
  </G>
);

const ClosedEyes = ({ paint, left, right }: { paint: CatPaint; left: [number, number]; right: [number, number] }) => (
  <G fill="none" stroke={paint.face} strokeWidth="4.4" strokeLinecap="round">
    <Path d={`M${left[0] - 7} ${left[1]}q7 7 14 0`} />
    <Path d={`M${right[0] - 7} ${right[1]}q7 7 14 0`} />
  </G>
);

const Face = ({ mood, paint }: { mood: CatMood; paint: CatPaint }) => {
  if (mood === 'sleeping') {
    return (
      <G>
        <ClosedEyes paint={paint} left={[194, 87]} right={[216, 88]} />
        <Path d="M201 102q6 5 12 0" fill="none" stroke={paint.face} strokeWidth="3" strokeLinecap="round" />
        <G fill="none" stroke={palette.waterDark} strokeWidth="3" strokeLinecap="round" opacity="0.72">
          <Path d="M54 62q8-8 16 0" />
          <Path d="M42 50q6-6 12 0" />
        </G>
      </G>
    );
  }

  if (mood === 'stretching') {
    return (
      <G>
        <RingEyes paint={paint} left={[80, 128]} right={[98, 126]} size={5.4} />
        <Path d="M86 141q5 4 10-1" fill="none" stroke={paint.face} strokeWidth="2.8" strokeLinecap="round" />
        <G fill="none" stroke={palette.beige} strokeWidth="3" strokeLinecap="round">
          <Path d="M53 125l-10-4M54 136l-12 1" />
        </G>
      </G>
    );
  }

  if (mood === 'playing') {
    return (
      <G>
        <RingEyes paint={paint} left={[191, 112]} right={[210, 109]} size={5.7} />
        <Path d="M198 126q5 4 10-1" fill="none" stroke={paint.face} strokeWidth="2.8" strokeLinecap="round" />
        <Path d="M225 65c0-9 9-17 9-17s10 8 10 17c0 6-4 10-10 10s-9-4-9-10z" fill={palette.waterDark} />
        <G fill="none" stroke={palette.waterDark} strokeWidth="3" strokeLinecap="round">
          <Path d="M216 57l-8-5M216 69l-10 2" />
        </G>
      </G>
    );
  }

  if (mood === 'happy') {
    return (
      <G>
        <ClosedEyes paint={paint} left={[123, 65]} right={[143, 65]} />
        <Path d="M128 80q6 6 12 0M134 82q0 7 7 6" fill="none" stroke={paint.face} strokeWidth="2.8" strokeLinecap="round" />
        <Path d="M80 70c0-7 7-13 7-13s8 6 8 13c0 5-3 8-8 8s-7-3-7-8z" fill={palette.waterDark} opacity="0.78" />
      </G>
    );
  }

  return (
    <G>
      <RingEyes paint={paint} left={[122, 57]} right={[141, 56]} size={5.6} />
      <Path d="M128 73q6 7 13 0M134 75q0 8 7 7" fill="none" stroke={paint.face} strokeWidth="2.9" strokeLinecap="round" />
      <G fill={palette.waterDark}>
        <Path d="M49 47c0-8 8-15 8-15s9 7 9 15c0 5-4 9-9 9s-8-4-8-9z" />
        <Path d="M210 44c0-7 7-13 7-13s8 6 8 13c0 5-3 8-8 8s-7-3-7-8z" />
      </G>
      <G fill="none" stroke={palette.beige} strokeWidth="3" strokeLinecap="round">
        <Path d="M39 69l-10-3M42 79l-10 4M222 68l10-6M225 79l11 1" />
      </G>
    </G>
  );
};

const CoatDetails = ({ color, mood, paint }: { color: CatColor; mood: CatMood; paint: CatPaint }) => {
  if (color !== 'orange' && color !== 'siamese') return null;
  const head = mood === 'sleeping'
    ? 'M182 57q22-14 45 2l8 42q-25 18-54 3z'
    : mood === 'stretching'
      ? 'M62 108q18-19 42-6l9 37q-25 12-52-1z'
      : mood === 'playing'
        ? 'M176 89q23-16 48 1l7 38q-28 13-56-2z'
        : mood === 'happy'
          ? 'M109 40q23-17 47 1l4 45q-27 14-53-1z'
          : 'M108 33q24-17 48 1l5 43q-28 14-54 0z';

  if (color === 'siamese') return <Path d={head} fill={paint.detail} opacity="0.9" />;

  const stripes = mood === 'sleeping'
    ? 'M192 59l2 13M203 56l4 14M214 58l5 12'
    : mood === 'stretching'
      ? 'M77 104l2 11M87 101l4 12M98 104l5 10'
      : mood === 'playing'
        ? 'M190 90l2 12M201 87l4 13M212 91l5 10'
        : mood === 'happy'
          ? 'M122 42l2 13M133 39l4 14M145 42l5 11'
          : 'M121 36l2 13M133 33l4 14M145 36l5 11';
  return <Path d={stripes} fill="none" stroke={paint.detail} strokeWidth="3.4" strokeLinecap="round" opacity="0.82" />;
};

interface Props { color: CatColor; mood: CatMood; size?: number }

export const CatIllustration = ({ color, mood, size = 188 }: Props) => {
  const scale = useRef(new Animated.Value(1)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const paint = paints[color];

  useEffect(() => {
    Animated.parallel([
      Animated.sequence([
        Animated.timing(scale, { toValue: mood === 'celebrating' ? 1.06 : 1.025, duration: 150, useNativeDriver: true }),
        Animated.spring(scale, { toValue: 1, friction: 5, tension: 90, useNativeDriver: true }),
      ]),
      Animated.sequence([
        Animated.timing(translateY, { toValue: mood === 'celebrating' ? -7 : -2, duration: 150, useNativeDriver: true }),
        Animated.spring(translateY, { toValue: 0, friction: 5, tension: 90, useNativeDriver: true }),
      ]),
    ]).start();
  }, [mood, scale, translateY]);

  return (
    <Animated.View
      accessibilityRole="image"
      accessibilityLabel={`Gatinho ${moodLabels[mood]}`}
      style={[styles.frame, { width: size, height: size * 0.81, transform: [{ translateY }, { scale }] }]}
    >
      <PathlessShadow />
      {color === 'white' ? (
        <Image source={bodySources[mood]} resizeMode="contain" style={[styles.body, styles.outline, { tintColor: paint.outline }]} />
      ) : null}
      <Image source={bodySources[mood]} resizeMode="contain" style={[styles.body, { tintColor: paint.body }]} />
      <Svg pointerEvents="none" style={StyleSheet.absoluteFill} viewBox="0 0 260 210">
        <CoatDetails color={color} mood={mood} paint={paint} />
        <Face mood={mood} paint={paint} />
      </Svg>
    </Animated.View>
  );
};

const PathlessShadow = () => (
  <View pointerEvents="none" style={styles.shadow} />
);

const styles = StyleSheet.create({
  frame: { position: 'relative' },
  body: { position: 'absolute', inset: 0, width: '100%', height: '100%' },
  outline: { transform: [{ scale: 1.035 }] },
  shadow: {
    position: 'absolute',
    left: '18%',
    right: '18%',
    bottom: '5%',
    height: 8,
    borderRadius: 999,
    backgroundColor: '#242424',
    opacity: 0.065,
  },
});
