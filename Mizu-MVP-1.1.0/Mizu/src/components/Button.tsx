import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, ViewStyle } from 'react-native';
import { colors, radius, sizes, spacing, typography } from '../theme';

interface Props {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  accessibilityHint?: string;
}

export const Button = ({ label, onPress, variant = 'primary', disabled, loading, style, accessibilityHint }: Props) => (
  <Pressable
    accessibilityRole="button"
    accessibilityLabel={label}
    accessibilityHint={accessibilityHint}
    disabled={disabled || loading}
    onPress={onPress}
    style={({ pressed }) => [styles.base, styles[variant], pressed && styles.pressed, (disabled || loading) && styles.disabled, style]}
  >
    {loading ? <ActivityIndicator color={variant === 'primary' ? colors.background : colors.text} /> : (
      <Text style={[styles.label, variant === 'primary' && styles.primaryLabel, variant === 'danger' && styles.dangerLabel]}>{label}</Text>
    )}
  </Pressable>
);

const styles = StyleSheet.create({
  base: { minHeight: sizes.touch, borderRadius: radius.pill, paddingHorizontal: spacing.lg, alignItems: 'center', justifyContent: 'center' },
  primary: { backgroundColor: colors.text },
  secondary: { backgroundColor: colors.waterSoft },
  ghost: { backgroundColor: 'transparent' },
  danger: { backgroundColor: '#FAECEC' },
  label: { ...typography.button, color: colors.text },
  primaryLabel: { color: colors.background },
  dangerLabel: { color: colors.danger },
  pressed: { opacity: 0.72, transform: [{ scale: 0.985 }] },
  disabled: { opacity: 0.45 },
});
