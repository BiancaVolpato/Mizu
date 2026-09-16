import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { tabBarMetrics } from '../utils/layout';
import { MizuIcon, MizuIconName } from '../components/MizuIcon';
import { colors, typography } from '../theme';
import { CatScreen } from '../screens/CatScreen';
import { HistoryScreen } from '../screens/HistoryScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { TodayScreen } from '../screens/TodayScreen';

export type RootTabParamList = { Hoje: undefined; Histórico: undefined; Gatinho: undefined; Perfil: undefined; };
const Tab = createBottomTabNavigator<RootTabParamList>();
const icons: Record<keyof RootTabParamList, MizuIconName> = { Hoje: 'droplets', Histórico: 'calendar', Gatinho: 'cat', Perfil: 'user' };

export const AppNavigator = () => {
  const insets = useSafeAreaInsets();
  const { fontScale } = useWindowDimensions();
  const metrics = tabBarMetrics(insets.bottom, fontScale);
  return (
  <NavigationContainer>
    <Tab.Navigator screenOptions={({ route }) => ({
      headerShown: false,
      tabBarHideOnKeyboard: true,
      tabBarActiveTintColor: colors.text,
      tabBarInactiveTintColor: colors.textMuted,
      tabBarStyle: [styles.tabBar, metrics],
      tabBarLabelPosition: 'below-icon',
      tabBarLabelStyle: styles.label,
      tabBarIcon: ({ color, focused }) => {
        return <View style={[styles.iconWrap, focused && styles.iconActive]}><MizuIcon name={icons[route.name]} color={color} size={22} strokeWidth={focused ? 2.2 : 1.7} /></View>;
      },
    })}>
      <Tab.Screen name="Hoje" component={TodayScreen} options={{ tabBarAccessibilityLabel: 'Hoje, tela principal' }} />
      <Tab.Screen name="Histórico" component={HistoryScreen} options={{ tabBarAccessibilityLabel: 'Histórico de hidratação' }} />
      <Tab.Screen name="Gatinho" component={CatScreen} options={{ tabBarAccessibilityLabel: 'Personalizar gatinho' }} />
      <Tab.Screen name="Perfil" component={ProfileScreen} options={{ tabBarAccessibilityLabel: 'Perfil e configurações' }} />
    </Tab.Navigator>
  </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  tabBar: { paddingTop: 7, backgroundColor: colors.surface, borderTopColor: colors.border },
  label: { ...typography.caption, fontSize: 10.5, marginTop: 1 },
  iconWrap: { width: 42, height: 31, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  iconActive: { backgroundColor: colors.waterSoft },
});
