import React from 'react';
import { ScrollView, ScrollViewProps, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, sizes, spacing } from '../theme';

export const Screen = ({ children, contentContainerStyle, ...props }: ScrollViewProps) => (
  <SafeAreaView style={styles.safe} edges={['top']}>
    <ScrollView {...props} keyboardShouldPersistTaps="handled" contentContainerStyle={[styles.content, contentContainerStyle]}>
      <View style={styles.inner}>{children}</View>
    </ScrollView>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: spacing.md, paddingTop: spacing.md, paddingBottom: 110 },
  inner: { width: '100%', maxWidth: sizes.contentMax, alignSelf: 'center' },
});
