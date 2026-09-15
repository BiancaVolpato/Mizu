import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, Text } from 'react-native';
import { colors, typography } from '../theme';
import { CatScreen } from '../screens/CatScreen';
import { HistoryScreen } from '../screens/HistoryScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { TodayScreen } from '../screens/TodayScreen';

export type RootTabParamList = { Hoje: undefined; Histórico: undefined; Gatinho: undefined; Perfil: undefined; };
const Tab = createBottomTabNavigator<RootTabParamList>();
const icons: Record<keyof RootTabParamList, string> = { Hoje: '◒', Histórico: '▥', Gatinho: '◉', Perfil: '○' };

export const AppNavigator = () => (
  <NavigationContainer>
    <Tab.Navigator screenOptions={({ route }) => ({
      headerShown: false,
      tabBarHideOnKeyboard: true,
      tabBarActiveTintColor: colors.text,
      tabBarInactiveTintColor: colors.textMuted,
      tabBarStyle: styles.tabBar,
      tabBarLabelStyle: styles.label,
      tabBarIcon: ({ color }) => <Text style={[styles.icon, { color }]}>{icons[route.name]}</Text>,
    })}>
      <Tab.Screen name="Hoje" component={TodayScreen} options={{ tabBarAccessibilityLabel: 'Hoje, tela principal' }} />
      <Tab.Screen name="Histórico" component={HistoryScreen} options={{ tabBarAccessibilityLabel: 'Histórico de hidratação' }} />
      <Tab.Screen name="Gatinho" component={CatScreen} options={{ tabBarAccessibilityLabel: 'Personalizar gatinho' }} />
      <Tab.Screen name="Perfil" component={ProfileScreen} options={{ tabBarAccessibilityLabel: 'Perfil e configurações' }} />
    </Tab.Navigator>
  </NavigationContainer>
);

const styles = StyleSheet.create({
  tabBar: { height: 78, paddingTop: 8, paddingBottom: 10, backgroundColor: colors.surface, borderTopColor: colors.border },
  label: { ...typography.caption, fontSize: 11 },
  icon: { fontSize: 23, lineHeight: 26 },
});
