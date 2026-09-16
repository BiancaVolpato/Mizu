import React from 'react';
import { Animated, Pressable, StyleSheet, Text } from 'react-native';
import { MizuIcon } from './MizuIcon';
import { colors, radius, sizes, spacing, typography } from '../theme';

interface Props { amount?: number; label?: string; onPress: () => void; }

export const WaterQuickButton = ({ amount, label, onPress }: Props) => {
  const scale = React.useRef(new Animated.Value(1)).current;
  const press = () => {
    Animated.sequence([
      Animated.timing(scale, { toValue: 0.94, duration: 70, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, friction: 5, useNativeDriver: true }),
    ]).start();
    onPress();
  };
  return (
    <Animated.View style={[styles.wrap, { transform: [{ scale }] }]}>
      <Pressable accessibilityRole="button" accessibilityLabel={label ?? `Adicionar ${amount} mililitros`} onPress={press} style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
        <MizuIcon name={amount ? 'plus' : 'droplet'} size={amount ? 18 : 17} strokeWidth={amount ? 2 : 1.8} color={colors.waterDark} />
        <Text style={styles.label}>{label ?? `${amount} ml`}</Text>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrap: { flex: 1, minWidth: '46%' },
  button: { minHeight: sizes.touch + 8, borderRadius: radius.md, backgroundColor: colors.waterSoft, paddingHorizontal: spacing.sm, paddingVertical: spacing.sm, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  pressed: { opacity: 0.72 },
  label: { ...typography.button, color: colors.text, flexShrink: 1, textAlign: 'center' },
});
