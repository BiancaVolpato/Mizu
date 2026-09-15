import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import Svg, { Circle, Ellipse, G, Path } from 'react-native-svg';
import { colors as palette } from '../theme';
import { CatColor, CatMood } from '../types';

type CatPaint = { body: string; accent: string; face: string; outline: string };

const paints: Record<CatColor, CatPaint> = {
  white: { body: '#F5F1EB', accent: '#D8C4B6', face: '#242424', outline: '#B9A99D' },
  black: { body: '#242424', accent: '#3B3A38', face: '#FAF9F6', outline: '#242424' },
  gray: { body: '#929693', accent: '#6E7470', face: '#FAF9F6', outline: '#6E7470' },
  orange: { body: '#D99B5E', accent: '#B8753D', face: '#242424', outline: '#B8753D' },
  siamese: { body: '#E7DACB', accent: '#594940', face: '#FAF9F6', outline: '#B5A18E' },
};

const moodLabels: Record<CatMood, string> = {
  sleeping: 'dormindo enrolado',
  stretching: 'se espreguiçando',
  playing: 'brincando com uma bolinha',
  happy: 'sentado e feliz',
  celebrating: 'comemorando com as patas para cima',
};

interface HeadProps {
  paint: CatPaint;
  color: CatColor;
  transform: string;
  expression: 'sleep' | 'curious' | 'focused' | 'happy' | 'excited';
}

const Head = ({ paint, color, transform, expression }: HeadProps) => {
  const closed = expression === 'sleep' || expression === 'happy';
  return (
    <G transform={transform}>
      <Path d="M-34-8L-29-36-8-22C-3-25 7-25 12-22L32-36 34-7C42 2 42 20 35 31 25 45-24 45-35 31-43 19-42 3-34-8z" fill={paint.body} stroke={paint.outline} strokeWidth="2.2" strokeLinejoin="round" />
      {color === 'siamese' ? <Path d="M-29-9L-27-30-8-18C2-23 13-21 27-8 35 0 35 18 29 27 16 38-18 39-30 27-37 17-37 1-29-9z" fill={paint.accent} /> : null}
      {color === 'orange' ? <G stroke={paint.accent} strokeWidth="3" strokeLinecap="round"><Path d="M-10-20l-3 9"/><Path d="M0-22v10"/><Path d="M10-20l3 9"/></G> : null}
      {closed ? (
        <G stroke={paint.face} strokeWidth="3.4" strokeLinecap="round" fill="none">
          <Path d={expression === 'happy' ? 'M-23 8q8 8 16 0' : 'M-23 11q8 5 16 0'} />
          <Path d={expression === 'happy' ? 'M8 8q8 8 16 0' : 'M8 11q8 5 16 0'} />
        </G>
      ) : (
        <G fill={paint.face}>
          <Ellipse cx="-15" cy="9" rx={expression === 'excited' ? 6.5 : 5.5} ry={expression === 'excited' ? 9 : 8} />
          <Ellipse cx="16" cy="9" rx={expression === 'excited' ? 6.5 : 5.5} ry={expression === 'excited' ? 9 : 8} />
          {color !== 'black' && color !== 'siamese' ? <G fill="#FAF9F6"><Circle cx="-13" cy="6" r="1.8"/><Circle cx="18" cy="6" r="1.8"/></G> : null}
        </G>
      )}
      <Path d="M-3 22l4 2 4-2" stroke={paint.face} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      {expression !== 'sleep' ? <Path d={expression === 'excited' ? 'M1 26q0 8 7 3' : 'M1 25q-5 6-10 1M1 25q5 6 10 1'} stroke={paint.face} strokeWidth="2" strokeLinecap="round" fill="none" /> : null}
    </G>
  );
};

const SleepingCat = ({ paint, color }: { paint: CatPaint; color: CatColor }) => (
  <G>
    <Ellipse cx="118" cy="166" rx="82" ry="8" fill="#242424" opacity="0.07" />
    <Path d="M45 127c0-37 32-68 76-68 48 0 79 30 78 67-1 32-33 45-83 45-43 0-71-12-71-44z" fill={paint.body} stroke={paint.outline} strokeWidth="2.2" />
    <Path d="M174 98c33 11 30 54-2 60-24 5-48-7-59-20" stroke={paint.accent} strokeWidth="15" strokeLinecap="round" fill="none" />
    <Head paint={paint} color={color} expression="sleep" transform="translate(84 108) rotate(-9) scale(.88)" />
    <Path d="M48 72q-9-10-18 0M37 61q-7-8-14 0" stroke={palette.waterDark} strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.65" />
  </G>
);

const StretchingCat = ({ paint, color }: { paint: CatPaint; color: CatColor }) => (
  <G>
    <Ellipse cx="118" cy="169" rx="91" ry="8" fill="#242424" opacity="0.07" />
    <Path d="M74 86c30-32 86-34 112 1 15 20 4 49-23 48l-91-4c-26-1-23-24 2-45z" fill={paint.body} stroke={paint.outline} strokeWidth="2.2" />
    <Path d="M177 91c25-13 26-42 8-56-13-9-25 2-18 13" stroke={paint.body} strokeWidth="14" strokeLinecap="round" fill="none" />
    <Path d="M80 123L48 158M107 128L83 163" stroke={paint.accent} strokeWidth="15" strokeLinecap="round" />
    <Path d="M164 127l13 35" stroke={paint.accent} strokeWidth="15" strokeLinecap="round" />
    <Head paint={paint} color={color} expression="curious" transform="translate(62 119) rotate(-18) scale(.82)" />
    <Path d="M33 161h27M70 165h27M165 165h26" stroke={paint.outline} strokeWidth="3" strokeLinecap="round" opacity="0.6" />
  </G>
);

const PlayingCat = ({ paint, color }: { paint: CatPaint; color: CatColor }) => (
  <G>
    <Ellipse cx="118" cy="169" rx="94" ry="8" fill="#242424" opacity="0.07" />
    <Path d="M65 119c8-38 37-61 75-51 31 8 46 34 35 63-10 25-45 31-77 24-27-5-39-15-33-36z" fill={paint.body} stroke={paint.outline} strokeWidth="2.2" />
    <Path d="M72 132l-34 25M101 145l-21 22M158 133l26 25" stroke={paint.accent} strokeWidth="14" strokeLinecap="round" />
    <Path d="M167 102c31 0 40-24 30-37-8-10-20-5-18 5" stroke={paint.body} strokeWidth="13" strokeLinecap="round" fill="none" />
    <Head paint={paint} color={color} expression="focused" transform="translate(95 78) rotate(10) scale(.83)" />
    <Path d="M140 119q25 5 44 23" stroke={paint.body} strokeWidth="13" strokeLinecap="round" fill="none" />
    <G>
      <Circle cx="202" cy="151" r="15" fill={palette.beige} />
      <Path d="M193 142l18 18M211 142l-18 18" stroke="#FAF9F6" strokeWidth="2.2" />
      <Path d="M194 133q8-8 16 0" stroke={palette.waterDark} strokeWidth="2" fill="none" />
    </G>
  </G>
);

const HappyCat = ({ paint, color }: { paint: CatPaint; color: CatColor }) => (
  <G>
    <Ellipse cx="118" cy="170" rx="76" ry="8" fill="#242424" opacity="0.07" />
    <Path d="M76 142c2-47 17-76 43-76s45 31 47 77c1 23-18 29-46 29-29 0-45-8-44-30z" fill={paint.body} stroke={paint.outline} strokeWidth="2.2" />
    <Path d="M91 113l3 45M147 113l-3 45" stroke={paint.accent} strokeWidth="13" strokeLinecap="round" />
    <Path d="M160 139c32 17 50-7 42-28-6-16-24-13-24 0 0 8 9 12 15 7" stroke={paint.body} strokeWidth="13" strokeLinecap="round" fill="none" />
    <Head paint={paint} color={color} expression="happy" transform="translate(120 60) scale(.96)" />
    <Path d="M82 166h26M132 166h26" stroke={paint.outline} strokeWidth="3" strokeLinecap="round" opacity="0.6" />
    <Path d="M112 105q8 7 16 0" stroke={paint.accent} strokeWidth="3" strokeLinecap="round" fill="none" />
  </G>
);

const CelebratingCat = ({ paint, color }: { paint: CatPaint; color: CatColor }) => (
  <G>
    <Ellipse cx="120" cy="174" rx="68" ry="7" fill="#242424" opacity="0.07" />
    <G fill={palette.waterDark}>
      <Circle cx="31" cy="44" r="4"/><Circle cx="207" cy="49" r="5"/><Circle cx="191" cy="20" r="3"/>
      <Path d="M47 17l4 12 11-6-6 13" stroke={palette.beige} strokeWidth="4" fill="none" strokeLinecap="round"/>
      <Path d="M164 13l-3 12-11-4 6 12" stroke={palette.waterDark} strokeWidth="4" fill="none" strokeLinecap="round"/>
    </G>
    <Path d="M88 151c2-46 12-76 31-76 22 0 34 31 35 77 1 19-13 24-34 24-22 0-33-7-32-25z" fill={paint.body} stroke={paint.outline} strokeWidth="2.2" />
    <Path d="M101 149l-12 23M139 149l12 23" stroke={paint.accent} strokeWidth="14" strokeLinecap="round" />
    <Path d="M99 105L66 66M143 105l34-42" stroke={paint.body} strokeWidth="14" strokeLinecap="round" />
    <Path d="M66 66l-9-11M66 66l-14-1M177 63l9-12M177 63l14-2" stroke={paint.accent} strokeWidth="6" strokeLinecap="round" />
    <Path d="M151 134c28 14 48-4 43-24" stroke={paint.body} strokeWidth="13" strokeLinecap="round" fill="none" />
    <Head paint={paint} color={color} expression="excited" transform="translate(120 58) scale(.94)" />
  </G>
);

interface Props { color: CatColor; mood: CatMood; size?: number; }

export const CatIllustration = ({ color, mood, size = 188 }: Props) => {
  const scale = useRef(new Animated.Value(1)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.parallel([
      Animated.sequence([
        Animated.timing(scale, { toValue: mood === 'celebrating' ? 1.075 : 1.025, duration: 150, useNativeDriver: true }),
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
      <Svg width={size} height={size * 0.8} viewBox="0 0 240 190">
        {mood === 'sleeping' ? <SleepingCat paint={paint} color={color} /> : null}
        {mood === 'stretching' ? <StretchingCat paint={paint} color={color} /> : null}
        {mood === 'playing' ? <PlayingCat paint={paint} color={color} /> : null}
        {mood === 'happy' ? <HappyCat paint={paint} color={color} /> : null}
        {mood === 'celebrating' ? <CelebratingCat paint={paint} color={color} /> : null}
      </Svg>
    </Animated.View>
  );
};
