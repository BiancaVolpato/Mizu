import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import Svg, { Circle, Ellipse, G, Path } from 'react-native-svg';
import { colors as palette } from '../theme';
import { CatColor, CatMood } from '../types';

const fills: Record<CatColor, { body: string; accent: string; eye: string }> = {
  white: { body: '#F4F0EA', accent: '#D8C4B6', eye: '#242424' },
  black: { body: '#242424', accent: '#3A3937', eye: '#FAF9F6' },
  gray: { body: '#8E918F', accent: '#6F7371', eye: '#FAF9F6' },
  orange: { body: '#D99B5E', accent: '#B8753D', eye: '#242424' },
  siamese: { body: '#E5D7C8', accent: '#55463F', eye: '#242424' },
};

interface Props { color: CatColor; mood: CatMood; size?: number; }

export const CatIllustration = ({ color, mood, size = 176 }: Props) => {
  const bounce = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.sequence([
      Animated.timing(bounce, { toValue: mood === 'celebrating' ? 1.1 : 1.035, duration: 150, useNativeDriver: true }),
      Animated.spring(bounce, { toValue: 1, friction: 4, useNativeDriver: true }),
    ]).start();
  }, [bounce, mood]);
  const fill = fills[color];
  const sleeping = mood === 'sleeping';
  const celebrating = mood === 'celebrating';
  return (
    <Animated.View accessibilityRole="image" accessibilityLabel={`Gatinho ${mood === 'sleeping' ? 'dormindo' : mood === 'stretching' ? 'se espreguiçando' : mood === 'playing' ? 'brincando' : mood === 'happy' ? 'feliz' : 'comemorando'}`} style={{ transform: [{ scale: bounce }] }}>
      <Svg width={size} height={size * 0.78} viewBox="0 0 220 172">
        {celebrating ? <G fill={palette.waterDark}><Circle cx="28" cy="34" r="4"/><Circle cx="188" cy="30" r="5"/><Path d="M48 20l4 11 10-5-6 12" stroke={palette.beige} strokeWidth="4" fill="none"/><Path d="M168 12l-3 11-10-4 6 11" stroke={palette.waterDark} strokeWidth="4" fill="none"/></G> : null}
        <Ellipse cx="110" cy="153" rx="70" ry="8" fill="#242424" opacity="0.08" />
        <Path d={sleeping ? 'M47 119c4-42 32-66 72-61 37 4 57 26 57 57 0 26-23 37-66 37-42 0-66-9-63-33z' : 'M52 117c3-40 28-64 63-64 41 0 62 25 59 67-2 24-26 32-63 32-41 0-62-10-59-35z'} fill={fill.body}/>
        <Path d="M72 67L68 36l27 19M145 57l24-20-2 35" fill={fill.body} stroke={fill.body} strokeWidth="7" strokeLinejoin="round"/>
        {color === 'siamese' ? <Path d="M81 53c12-10 46-11 61 2l-7 43H86z" fill={fill.accent} opacity="0.95"/> : null}
        {sleeping ? (
          <G stroke={fill.eye} strokeWidth="4" strokeLinecap="round" fill="none"><Path d="M88 83q8 7 16 0"/><Path d="M125 83q8 7 16 0"/></G>
        ) : (
          <G><Ellipse cx="98" cy="81" rx="7" ry={mood === 'happy' ? 8 : 11} fill={fill.eye}/><Ellipse cx="137" cy="81" rx="7" ry={mood === 'happy' ? 8 : 11} fill={fill.eye}/>{color !== 'black' && <G fill="#FAF9F6"><Circle cx="100" cy="78" r="2"/><Circle cx="139" cy="78" r="2"/></G>}</G>
        )}
        <Path d="M113 95l5 3 5-3" stroke={color === 'black' ? '#FAF9F6' : '#242424'} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        <Path d={mood === 'stretching' ? 'M55 119c-22 4-29 19-18 27 10 7 21-3 15-10' : mood === 'playing' ? 'M164 123c29-6 31-35 14-38-13-3-18 11-9 18' : 'M169 128c31 10 40-16 28-27-9-9-20-2-15 8'} stroke={fill.body} strokeWidth="13" strokeLinecap="round" fill="none"/>
        <Path d={mood === 'stretching' ? 'M78 128l-24 20M141 129l23 18' : 'M84 126v25M142 126v25'} stroke={fill.accent} strokeWidth="16" strokeLinecap="round"/>
        {mood === 'playing' ? <G><Circle cx="183" cy="82" r="14" fill={palette.beige}/><Path d="M176 74l14 16M190 75l-14 15" stroke="#FAF9F6" strokeWidth="2"/></G> : null}
      </Svg>
    </Animated.View>
  );
};

const styles = StyleSheet.create({ wrap: { alignItems: 'center' } });
