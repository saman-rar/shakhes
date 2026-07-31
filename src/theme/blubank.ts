import { Platform, ViewStyle } from 'react-native';
import { MD3LightTheme, MD3Theme } from 'react-native-paper';

export const Blubank = {
  colors: {
    background: '#F5F7FA',
    primary: '#F28B0C',
    primarySoft: '#FDF0DC',
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
  },
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

export const paperTheme: MD3Theme = {
  ...MD3LightTheme,
  roundness: Blubank.radius.card,
  colors: {
    ...MD3LightTheme.colors,
    primary: Blubank.colors.primary,
    onPrimary: '#FFFFFF',
    primaryContainer: Blubank.colors.primarySoft,
    onPrimaryContainer: Blubank.colors.primary,
    secondary: Blubank.colors.info,
    background: Blubank.colors.background,
    surface: Blubank.colors.card,
    surfaceVariant: Blubank.colors.inputBackground,
    onSurface: Blubank.colors.text,
    onSurfaceVariant: Blubank.colors.textSecondary,
    outline: Blubank.colors.border,
    error: Blubank.colors.danger,
  },
};
