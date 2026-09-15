import React from 'react';
import { Animated, Pressable, StyleSheet, Text } from 'react-native';
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
        <Text style={styles.plus}>+</Text>
        <Text style={styles.label}>{label ?? `${amount} ml`}</Text>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrap: { flex: 1, minWidth: '46%' },
  button: { minHeight: sizes.touch + 8, borderRadius: radius.md, backgroundColor: colors.waterSoft, paddingHorizontal: spacing.sm, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  pressed: { opacity: 0.72 },
  plus: { ...typography.h2, color: colors.waterDark },
  label: { ...typography.button, color: colors.text },
});
