import React from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { colors, radius, sizes, spacing, typography } from '../theme';

interface Props extends TextInputProps {
  label: string;
  suffix?: string;
  error?: string;
}

export const Input = ({ label, suffix, error, style, ...props }: Props) => (
  <View style={styles.wrapper}>
    <Text style={styles.label}>{label}</Text>
    <View style={[styles.inputWrap, error && styles.inputError]}>
      <TextInput
        {...props}
        accessibilityLabel={props.accessibilityLabel ?? label}
        placeholderTextColor={colors.textMuted}
        style={[styles.input, style]}
        selectionColor={colors.waterDark}
      />
      {suffix ? <Text style={styles.suffix}>{suffix}</Text> : null}
    </View>
    {error ? <Text style={styles.error}>{error}</Text> : null}
  </View>
);

const styles = StyleSheet.create({
  wrapper: { gap: spacing.xs },
  label: { ...typography.caption, color: colors.text, fontFamily: 'PlusJakartaSans_600SemiBold' },
  inputWrap: { minHeight: sizes.touch + 6, flexDirection: 'row', alignItems: 'center', borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, paddingHorizontal: spacing.md },
  input: { ...typography.body, flex: 1, paddingVertical: spacing.sm, color: colors.text },
  suffix: { ...typography.body, color: colors.textMuted },
  inputError: { borderColor: colors.danger },
  error: { ...typography.caption, color: colors.danger },
});
