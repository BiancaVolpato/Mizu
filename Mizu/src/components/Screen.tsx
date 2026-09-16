import React, { useEffect, useRef } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, ScrollView, ScrollViewProps, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, sizes, spacing } from '../theme';

export const Screen = ({ children, contentContainerStyle, ...props }: ScrollViewProps) => {
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    const eventName = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const subscription = Keyboard.addListener(eventName, () => {
      setTimeout(() => {
        const focusedInput = TextInput.State.currentlyFocusedInput();
        if (focusedInput) {
          scrollRef.current?.scrollResponderScrollNativeHandleToKeyboard(focusedInput, 28, true);
        }
      }, Platform.OS === 'ios' ? 40 : 120);
    });
    return () => subscription.remove();
  }, []);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <KeyboardAvoidingView style={styles.keyboard} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          {...props}
          ref={scrollRef}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
          automaticallyAdjustKeyboardInsets={Platform.OS === 'ios'}
          contentContainerStyle={[styles.content, contentContainerStyle]}
        >
          <View style={styles.inner}>{children}</View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  keyboard: { flex: 1 },
  content: { paddingHorizontal: spacing.md, paddingTop: spacing.md, paddingBottom: 110 },
  inner: { width: '100%', maxWidth: sizes.contentMax, alignSelf: 'center' },
});
