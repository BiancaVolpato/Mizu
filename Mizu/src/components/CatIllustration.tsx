import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import Svg, { G, Path } from 'react-native-svg';
import { colors as palette } from '../theme';
import { CatColor, CatMood } from '../types';

type CatPaint = { ink: string; detail: string; eyes: string; outline: string };

const paints: Record<CatColor, CatPaint> = {
  white: { ink: '#F2EDE6', detail: '#D2C1B4', eyes: '#343331', outline: '#A99A8E' },
  black: { ink: '#20211F', detail: '#343632', eyes: '#FAF7F0', outline: '#20211F' },
  gray: { ink: '#858B87', detail: '#666D68', eyes: '#FAF7F0', outline: '#6B716D' },
  orange: { ink: '#D38F51', detail: '#AD6838', eyes: '#282724', outline: '#B7753E' },
  siamese: { ink: '#DED0BE', detail: '#58463D', eyes: '#FAF7F0', outline: '#A49382' },
};

const moodLabels: Record<CatMood, string> = {
  sleeping: 'dormindo enrolado',
  stretching: 'se espreguiçando',
  playing: 'brincando com uma gota de água',
  happy: 'sentado e contente',
  celebrating: 'comemorando com as patas para cima',
};

const Ground = ({ wide = false }: { wide?: boolean }) => (
  <Path
    d={wide ? 'M31 184c43-7 151-7 198 1-28 9-163 10-198-1z' : 'M55 185c35-7 117-7 151 0-26 9-121 9-151 0z'}
    fill="#242424"
    opacity="0.065"
  />
);

const OpenEyes = ({ paint, left, right, scale = 1 }: { paint: CatPaint; left: [number, number]; right: [number, number]; scale?: number }) => (
  <G fill="none" stroke={paint.eyes} strokeWidth={5 * scale} strokeLinecap="round">
    <Path d={`M${left[0] - 7 * scale} ${left[1]}c0-${9 * scale} ${14 * scale}-${9 * scale} ${14 * scale} 0s-${14 * scale} ${9 * scale}-${14 * scale} 0z`} />
    <Path d={`M${right[0] - 7 * scale} ${right[1]}c0-${9 * scale} ${14 * scale}-${9 * scale} ${14 * scale} 0s-${14 * scale} ${9 * scale}-${14 * scale} 0z`} />
  </G>
);

const ClosedEyes = ({ paint, left, right }: { paint: CatPaint; left: [number, number]; right: [number, number] }) => (
  <G fill="none" stroke={paint.eyes} strokeWidth="5" strokeLinecap="round">
    <Path d={`M${left[0] - 7} ${left[1]}q7 7 14 0`} />
    <Path d={`M${right[0] - 7} ${right[1]}q7 7 14 0`} />
  </G>
);

const FurMarks = ({ paint, color, mood }: { paint: CatPaint; color: CatColor; mood: CatMood }) => {
  if (color === 'black' || color === 'white') return null;
  if (color === 'siamese') {
    const mask = mood === 'sleeping'
      ? 'M132 88c8-14 29-17 40-4 9 10 8 30-1 39-12 11-36 8-42-5-4-10-2-21 3-30z'
      : mood === 'stretching'
        ? 'M72 126c-8-15-1-34 14-40l22-15 19 18c7 15 0 35-14 42-15 8-33 5-41-5z'
        : mood === 'playing'
          ? 'M77 102c-7-16 0-35 14-42l22-16 20 20c7 17-2 38-18 44-15 6-31 3-38-6z'
          : mood === 'happy'
            ? 'M99 71c-3-18 7-36 24-42l20-10 17 19c10 15 4 39-11 48-17 10-43 5-50-15z'
            : 'M101 71c-4-18 6-37 23-44l19-11 19 20c9 16 3 39-12 48-17 10-42 4-49-13z';
    return <Path d={mask} fill={paint.detail} opacity="0.98" />;
  }

  const marks = mood === 'sleeping'
    ? 'M149 76l-3 13M159 77l1 13M169 81l4 11'
    : mood === 'stretching'
      ? 'M91 80l2 13M101 78l4 13M112 79l5 12'
      : mood === 'playing'
        ? 'M95 53l2 13M106 51l4 13M117 54l5 11'
        : mood === 'happy'
          ? 'M119 35l2 14M132 31l4 15M145 35l5 13'
          : 'M120 33l2 14M133 30l4 15M146 34l5 13';
  return <Path d={marks} fill="none" stroke={paint.detail} strokeWidth="4" strokeLinecap="round" opacity="0.78" />;
};

const SleepingCat = ({ paint, color }: { paint: CatPaint; color: CatColor }) => (
  <G>
    <Ground />
    <Path
      d="M45 142c-4-31 15-65 47-78 22-9 41-6 57 3l18-20 10 29c25 15 38 42 30 66-9 28-46 38-93 37-45-1-66-11-69-37zm120-2c17-4 28-13 28-25 0-10-7-18-16-20 8 18 1 32-12 45z"
      fill={paint.ink}
      stroke={paint.outline}
      strokeWidth="2.6"
      strokeLinejoin="round"
    />
    <FurMarks paint={paint} color={color} mood="sleeping" />
    <Path d="M62 151c26 18 91 17 119-7-24 5-42 0-57-12-13-10-27-12-40-5-10 5-16 14-22 24z" fill={paint.detail} opacity="0.36" />
    <ClosedEyes paint={paint} left={[143, 102]} right={[170, 103]} />
    <Path d="M154 117q5 4 10 0" fill="none" stroke={paint.eyes} strokeWidth="3.2" strokeLinecap="round" />
    <G fill="none" stroke={palette.waterDark} strokeWidth="3" strokeLinecap="round" opacity="0.68">
      <Path d="M54 66q8-8 16 0" />
      <Path d="M42 54q6-6 12 0" />
    </G>
  </G>
);

const StretchingCat = ({ paint, color }: { paint: CatPaint; color: CatColor }) => (
  <G>
    <Ground wide />
    <Path
      d="M62 142c-14-9-17-24-8-37 8-11 22-16 37-20l17-23 16 16c26-11 63-7 79 16 13 19 8 43-7 53-8 6-15 2-15-7 0-19 7-40 15-55 9-18 21-31 32-27 9 4 8 16 0 21-8 5-14 17-18 30-2 8-2 20 1 33 5 22-9 40-29 39-15 0-24-10-26-25l-2-13c-16 5-35 6-53 2l-27 32c-8 9-24 6-25-4-1-6 4-12 13-21l15-17-24 16c-12 8-24 2-23-8 1-5 6-10 12-14z"
      fill={paint.ink}
      stroke={paint.outline}
      strokeWidth="2.7"
      strokeLinejoin="round"
      strokeLinecap="round"
    />
    <FurMarks paint={paint} color={color} mood="stretching" />
    <OpenEyes paint={paint} left={[88, 108]} right={[113, 104]} scale={0.85} />
    <Path d="M99 121q5 4 10-1" fill="none" stroke={paint.eyes} strokeWidth="3" strokeLinecap="round" />
    <G fill="none" stroke={palette.beige} strokeWidth="3" strokeLinecap="round">
      <Path d="M42 105l-10-5M44 116l-13 1" />
    </G>
  </G>
);

const PlayingCat = ({ paint, color }: { paint: CatPaint; color: CatColor }) => (
  <G>
    <Ground wide />
    <Path
      d="M47 139c-8-19 2-43 24-55l18-29 18 15 18-23 15 29c25 10 43 34 44 61l23-22c8-8 20-8 24-1 4 8-1 16-11 20l-30 13c-5 22-26 34-55 33-29-1-51-13-61-31l-25 12c-11 5-20-1-18-10 1-5 7-9 16-12z"
      fill={paint.ink}
      stroke={paint.outline}
      strokeWidth="2.7"
      strokeLinejoin="round"
      strokeLinecap="round"
    />
    <FurMarks paint={paint} color={color} mood="playing" />
    <OpenEyes paint={paint} left={[94, 91]} right={[121, 86]} scale={0.92} />
    <Path d="M105 108q5 5 11 0" fill="none" stroke={paint.eyes} strokeWidth="3" strokeLinecap="round" />
    <Path d="M210 81c0-10 10-19 10-19s11 9 11 19c0 7-5 12-11 12s-10-5-10-12z" fill={palette.waterDark} />
    <G fill="none" stroke={palette.waterDark} strokeWidth="3" strokeLinecap="round">
      <Path d="M195 74l-9-5M195 84l-11 2" />
    </G>
  </G>
);

const HappyCat = ({ paint, color }: { paint: CatPaint; color: CatColor }) => (
  <G>
    <Ground />
    <Path
      d="M70 166c-2-19 10-33 30-39l3-37c1-17 8-30 20-38l-2-28 22 17 21-20 5 30c14 8 21 23 20 43l-2 42c14 7 31 8 42-2 8-8 7-20-1-25-6-4-13-1-13 5 0 5 4 7 8 6-2 12-17 16-27 9-11-8-13-25-4-37 11-15 33-17 47-5 17 15 15 44-3 61-16 15-42 19-64 10-11 15-31 23-55 23-30 0-49-10-51-25z"
      fill={paint.ink}
      stroke={paint.outline}
      strokeWidth="2.7"
      strokeLinejoin="round"
      strokeLinecap="round"
    />
    <FurMarks paint={paint} color={color} mood="happy" />
    <Path d="M119 116c-2 22-1 42 2 59M151 115c3 22 3 42 0 60" fill="none" stroke={paint.detail} strokeWidth="4" strokeLinecap="round" opacity="0.68" />
    <ClosedEyes paint={paint} left={[130, 71]} right={[158, 70]} />
    <Path d="M140 88q5 6 11 0M145 88q0 8 7 7" fill="none" stroke={paint.eyes} strokeWidth="3" strokeLinecap="round" />
    <Path d="M85 70c0-7 7-13 7-13s8 6 8 13c0 5-3 8-8 8s-7-3-7-8z" fill={palette.waterDark} opacity="0.7" />
  </G>
);

const CelebratingCat = ({ paint, color }: { paint: CatPaint; color: CatColor }) => (
  <G>
    <Ground />
    <Path
      d="M91 177c-8-10-4-22 7-30l7-48-29-35c-7-9-5-20 3-24 8-4 16 2 20 12l14 29 8-32-1-27 22 17 21-21 5 29-1 34 16-31c5-10 15-14 22-9 8 6 7 16-1 24l-27 31 10 49c12 7 17 20 10 30-7 10-24 9-34-1-15 8-34 8-49 0-10 10-26 12-33 3z"
      fill={paint.ink}
      stroke={paint.outline}
      strokeWidth="2.7"
      strokeLinejoin="round"
      strokeLinecap="round"
    />
    <FurMarks paint={paint} color={color} mood="celebrating" />
    <OpenEyes paint={paint} left={[132, 70]} right={[158, 68]} scale={0.92} />
    <Path d="M141 88q6 7 13 0M147 89q0 9 8 8" fill="none" stroke={paint.eyes} strokeWidth="3" strokeLinecap="round" />
    <G fill={palette.waterDark}>
      <Path d="M48 51c0-9 9-17 9-17s10 8 10 17c0 6-4 10-10 10s-9-4-9-10z" />
      <Path d="M211 45c0-8 8-15 8-15s9 7 9 15c0 5-4 9-9 9s-8-4-8-9z" />
    </G>
    <G fill="none" stroke={palette.beige} strokeWidth="3" strokeLinecap="round">
      <Path d="M39 77l-11-3M43 87l-11 4M221 73l10-6M225 84l12 1" />
    </G>
  </G>
);

interface Props { color: CatColor; mood: CatMood; size?: number }

export const CatIllustration = ({ color, mood, size = 188 }: Props) => {
  const scale = useRef(new Animated.Value(1)).current;
  const translateY = useRef(new Animated.Value(0)).current;

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

  const paint = paints[color];
  return (
    <Animated.View accessibilityRole="image" accessibilityLabel={`Gatinho ${moodLabels[mood]}`} style={{ transform: [{ translateY }, { scale }] }}>
      <Svg width={size} height={size * 0.81} viewBox="0 0 260 210">
        {mood === 'sleeping' ? <SleepingCat paint={paint} color={color} /> : null}
        {mood === 'stretching' ? <StretchingCat paint={paint} color={color} /> : null}
        {mood === 'playing' ? <PlayingCat paint={paint} color={color} /> : null}
        {mood === 'happy' ? <HappyCat paint={paint} color={color} /> : null}
        {mood === 'celebrating' ? <CelebratingCat paint={paint} color={color} /> : null}
      </Svg>
    </Animated.View>
  );
};
