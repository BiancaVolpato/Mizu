import { Platform, TextStyle } from 'react-native';

export const colors = {
  background: '#FAF9F6',
  surface: '#FFFFFF',
  text: '#242424',
  textMuted: '#706E69',
  water: '#A8DADC',
  waterDark: '#649EA1',
  waterSoft: '#E5F3F3',
  beige: '#D8C4B6',
  beigeSoft: '#F1E9E3',
  border: '#E9E6E0',
  success: '#5F8E7D',
  danger: '#A45B5B',
  overlay: 'rgba(36,36,36,0.30)',
} as const;

export const spacing = { xxs: 4, xs: 8, sm: 12, md: 16, lg: 24, xl: 32, xxl: 48 } as const;
export const radius = { sm: 12, md: 18, lg: 26, pill: 999 } as const;
export const sizes = { touch: 48, icon: 24, contentMax: 640 } as const;
export const shadows = {
  soft: Platform.select({
    ios: { shadowColor: '#242424', shadowOpacity: 0.06, shadowRadius: 14, shadowOffset: { width: 0, height: 5 } },
    android: { elevation: 2 },
    default: {},
  }),
};

const family = {
  regular: 'PlusJakartaSans_400Regular',
  medium: 'PlusJakartaSans_500Medium',
  semibold: 'PlusJakartaSans_600SemiBold',
  bold: 'PlusJakartaSans_700Bold',
};

export const typography: Record<'display' | 'h1' | 'h2' | 'body' | 'caption' | 'button', TextStyle> = {
  display: { fontFamily: family.bold, fontSize: 38, lineHeight: 46, color: colors.text, letterSpacing: -1.2 },
  h1: { fontFamily: family.bold, fontSize: 28, lineHeight: 35, color: colors.text, letterSpacing: -0.6 },
  h2: { fontFamily: family.semibold, fontSize: 18, lineHeight: 25, color: colors.text },
  body: { fontFamily: family.regular, fontSize: 16, lineHeight: 24, color: colors.text },
  caption: { fontFamily: family.regular, fontSize: 13, lineHeight: 18, color: colors.textMuted },
  button: { fontFamily: family.semibold, fontSize: 15, lineHeight: 20 },
};
