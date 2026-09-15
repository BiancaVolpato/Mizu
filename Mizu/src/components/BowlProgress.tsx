import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { colors, typography } from '../theme';

export const BowlProgress = ({ percent }: { percent: number }) => {
  const progress = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(progress, { toValue: Math.min(100, Math.max(0, percent)), duration: 420, useNativeDriver: false }).start();
  }, [percent, progress]);
  const width = progress.interpolate({ inputRange: [0, 100], outputRange: ['3%', '100%'] });
  return (
    <View style={styles.wrap} accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: 100, now: Math.min(100, percent), text: `${percent}%` }}>
      <View style={styles.waterTrack}><Animated.View style={[styles.water, { width }]} /></View>
      <Svg width="250" height="62" viewBox="0 0 250 62" style={styles.bowl}>
        <Path d="M12 8h226c-8 35-38 49-113 49S20 43 12 8z" fill="#F6F1EC" stroke={colors.beige} strokeWidth="3"/>
        <Path d="M29 17h192" stroke={colors.beige} strokeWidth="3" strokeLinecap="round"/>
      </Svg>
      <Text style={styles.label}>{percent}%</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: { width: 250, height: 74, alignItems: 'center', justifyContent: 'center' },
  bowl: { position: 'absolute', bottom: 0 },
  waterTrack: { position: 'absolute', top: 15, width: 192, height: 17, overflow: 'hidden', borderRadius: 9, zIndex: 2 },
  water: { height: '100%', backgroundColor: colors.water },
  label: { ...typography.caption, color: colors.text, fontFamily: 'PlusJakartaSans_600SemiBold', zIndex: 3, marginTop: 10 },
});
