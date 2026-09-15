import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '../theme';

export const EmptyState = ({ title, description }: { title: string; description: string }) => (
  <View style={styles.wrap} accessibilityRole="summary">
    <Text style={styles.icon}>○</Text>
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.description}>{description}</Text>
  </View>
);

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', paddingVertical: spacing.lg, gap: spacing.xs },
  icon: { fontSize: 26, color: colors.waterDark },
  title: { ...typography.h2 },
  description: { ...typography.caption, textAlign: 'center', maxWidth: 280 },
});
