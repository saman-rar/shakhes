import { useColorScheme } from 'react-native';
import { Platform, ViewStyle } from 'react-native';
import { MD3DarkTheme, MD3LightTheme, MD3Theme } from 'react-native-paper';

export const lightColors = {
  background: '#F5F7FA',
  primary: '#F28B0C',
  primarySoft: '#FDEBD2',
  card: '#FFFFFF',
  inputBackground: '#F0F2F5',
  text: '#1B2430',
  textSecondary: '#8A94A6',
  textMuted: '#B0B8C4',
  border: '#E8ECF0',
  success: '#22A06B',
  successSoft: '#E3F5ED',
  danger: '#E5484D',
  dangerSoft: '#FDECEC',
  info: '#208AEF',
  infoSoft: '#E3F1FD',
  overlay: 'rgba(20, 30, 45, 0.35)',
};

export const darkColors = {
  background: '#0F1317',
  primary: '#F28B0C',
  primarySoft: '#2A1D0A',
  card: '#181C21',
  inputBackground: '#1F252C',
  text: '#F2F4F7',
  textSecondary: '#B0B4BA',
  textMuted: '#7C828A',
  border: '#262B33',
  success: '#2FBF71',
  successSoft: '#12291F',
  danger: '#FF6B5B',
  dangerSoft: '#2E1512',
  info: '#4AA6FF',
  infoSoft: '#0F2233',
  overlay: 'rgba(0, 0, 0, 0.5)',
};

export type ColorScheme = 'light' | 'dark';
export type ThemeColors = typeof lightColors | typeof darkColors;

export const Blubank = {
  colors: lightColors,
  radius: {
    input: 8,
    card: 12,
    tab: 20,
    pill: 999,
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
  },
} as const;

export function getBlubank(scheme: ColorScheme) {
  return {
    ...Blubank,
    colors: scheme === 'dark' ? darkColors : lightColors,
  };
}

export type BlubankTheme = ReturnType<typeof getBlubank>;

export function useBlubank(): BlubankTheme {
  const scheme = (useColorScheme() ?? 'light') as ColorScheme;
  return getBlubank(scheme === 'dark' ? 'dark' : 'light');
}

export const softShadow: ViewStyle = Platform.select<ViewStyle>({
  ios: {
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  default: {
    elevation: 3,
  },
}) as ViewStyle;

export const darkShadow: ViewStyle = Platform.select<ViewStyle>({
  ios: {
    shadowColor: '#000',
    shadowOpacity: 0.45,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  default: {
    elevation: 6,
  },
}) as ViewStyle;

export function getSoftShadow(scheme: ColorScheme): ViewStyle {
  return scheme === 'dark' ? darkShadow : softShadow;
}

export function useSoftShadow(): ViewStyle {
  const scheme = (useColorScheme() ?? 'light') as ColorScheme;
  return getSoftShadow(scheme);
}

export function getPaperTheme(scheme: ColorScheme): MD3Theme {
  const base = scheme === 'dark' ? MD3DarkTheme : MD3LightTheme;
  const c = scheme === 'dark' ? darkColors : lightColors;
  return {
    ...base,
    roundness: Blubank.radius.card,
    colors: {
      ...base.colors,
      primary: c.primary,
      onPrimary: '#FFFFFF',
      primaryContainer: c.primarySoft,
      onPrimaryContainer: scheme === 'dark' ? c.primary : c.primary,
      secondary: c.info,
      background: c.background,
      surface: c.card,
      surfaceVariant: c.inputBackground,
      onSurface: c.text,
      onSurfaceVariant: c.textSecondary,
      outline: c.border,
      error: c.danger,
    },
  };
}

export const paperTheme: MD3Theme = getPaperTheme('light');

export function usePaperTheme(): MD3Theme {
  const scheme = (useColorScheme() ?? 'light') as ColorScheme;
  return getPaperTheme(scheme);
}

export const typography = {
  regular: 'Vazir',
  medium: 'Vazir-Medium',
  bold: 'Vazir-Bold',
} as const;
