import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { PlusJakartaSans_400Regular } from '@expo-google-fonts/plus-jakarta-sans/400Regular';
import { PlusJakartaSans_500Medium } from '@expo-google-fonts/plus-jakarta-sans/500Medium';
import { PlusJakartaSans_600SemiBold } from '@expo-google-fonts/plus-jakarta-sans/600SemiBold';
import { PlusJakartaSans_700Bold } from '@expo-google-fonts/plus-jakarta-sans/700Bold';
import { HydrationProvider, useHydration } from './src/hooks/HydrationProvider';
import { AppNavigator } from './src/navigation/AppNavigator';
import { OnboardingScreen } from './src/screens/OnboardingScreen';
import { colors } from './src/theme';

const Root = () => {
  const { data, ready } = useHydration();
  if (!ready) return <View style={styles.loading}><ActivityIndicator color={colors.waterDark} /></View>;
  return data.onboardingComplete ? <AppNavigator /> : <OnboardingScreen />;
};

export default function App() {
  const [fontsLoaded] = useFonts({ PlusJakartaSans_400Regular, PlusJakartaSans_500Medium, PlusJakartaSans_600SemiBold, PlusJakartaSans_700Bold });
  if (!fontsLoaded) return <View style={styles.loading}><ActivityIndicator color={colors.waterDark} /></View>;
  return <SafeAreaProvider><HydrationProvider><StatusBar style="dark" /><Root /></HydrationProvider></SafeAreaProvider>;
}

const styles = StyleSheet.create({ loading: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background } });
