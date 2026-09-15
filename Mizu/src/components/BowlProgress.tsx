import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import Svg, { ClipPath, Defs, Ellipse, G, Path, Rect } from 'react-native-svg';
import { colors, radius, spacing, typography } from '../theme';

const AnimatedRect = Animated.createAnimatedComponent(Rect);
const AnimatedEllipse = Animated.createAnimatedComponent(Ellipse);

export const BowlProgress = ({ percent }: { percent: number }) => {
  const progress = useRef(new Animated.Value(0)).current;
  const bounce = useRef(new Animated.Value(1)).current;
  const clamped = Math.min(100, Math.max(0, percent));

  useEffect(() => {
    Animated.parallel([
      Animated.timing(progress, { toValue: clamped, duration: 620, useNativeDriver: false }),
      Animated.sequence([
        Animated.timing(bounce, { toValue: 1.025, duration: 160, useNativeDriver: true }),
        Animated.spring(bounce, { toValue: 1, friction: 6, useNativeDriver: true }),
      ]),
    ]).start();
  }, [bounce, clamped, progress]);

  const waterY = progress.interpolate({ inputRange: [0, 100], outputRange: [118, 26] });
  const waterHeight = progress.interpolate({ inputRange: [0, 100], outputRange: [0, 92] });

  return (
    <Animated.View
      style={[styles.wrap, { transform: [{ scale: bounce }] }]}
      accessibilityRole="progressbar"
      accessibilityLabel="Progresso de hidratação"
      accessibilityValue={{ min: 0, max: 100, now: clamped, text: `${percent}% da meta` }}
    >
      <Svg width="292" height="126" viewBox="0 0 292 126">
        <Defs>
          <ClipPath id="bowlFill">
            <Path d="M17 26h258c-8 57-40 87-129 87S25 83 17 26z" />
          </ClipPath>
        </Defs>
        <Ellipse cx="146" cy="116" rx="92" ry="7" fill="#242424" opacity="0.06" />
        <G clipPath="url(#bowlFill)">
          <Rect x="17" y="26" width="258" height="87" fill="#F5F1EC" />
          <AnimatedRect x="17" width="258" y={waterY as unknown as number} height={waterHeight as unknown as number} fill={colors.water} />
          <AnimatedEllipse cx="146" cy={waterY as unknown as number} rx="137" ry="7" fill={colors.waterSoft} opacity="0.82" />
        </G>
        <Path d="M17 26h258c-8 57-40 87-129 87S25 83 17 26z" fill="none" stroke={colors.beige} strokeWidth="3" strokeLinejoin="round" />
        <Path d="M15 26h262" stroke={colors.beige} strokeWidth="5" strokeLinecap="round" />
        <Path d="M63 112h166" stroke={colors.beige} strokeWidth="4" strokeLinecap="round" opacity="0.5" />
      </Svg>
      <View style={styles.percentPill} pointerEvents="none">
        <Text adjustsFontSizeToFit numberOfLines={1} style={styles.percent}>{percent}%</Text>
        <Text style={styles.caption}>da meta</Text>
      </View>
      {percent >= 100 ? <View style={styles.completeBadge}><Text style={styles.completeText}>Meta alcançada</Text></View> : null}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrap: { width: 292, height: 142, alignItems: 'center', justifyContent: 'flex-start', marginTop: spacing.xs },
  percentPill: { position: 'absolute', top: 49, minWidth: 92, alignItems: 'center', paddingHorizontal: spacing.sm, paddingVertical: 6, borderRadius: radius.md, backgroundColor: 'rgba(250,249,246,0.86)' },
  percent: { ...typography.h1, fontSize: 27, lineHeight: 31, color: colors.text },
  caption: { ...typography.caption, fontSize: 10, lineHeight: 13, color: colors.textMuted },
  completeBadge: { position: 'absolute', bottom: 1, backgroundColor: colors.text, borderRadius: radius.pill, paddingHorizontal: spacing.sm, paddingVertical: 5 },
  completeText: { ...typography.caption, fontSize: 10, color: colors.background, fontFamily: 'PlusJakartaSans_600SemiBold' },
});
