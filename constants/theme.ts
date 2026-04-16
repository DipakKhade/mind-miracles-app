import { Platform } from 'react-native';

export const Colors = {
  light: {
    primary: '#1e3a5f',
    primaryLight: '#2563eb',
    primaryDark: '#1e3a8a',
    secondary: '#f1f5f9',
    secondaryLight: '#e2e8f0',
    accent: '#14B8A6',
    accentLight: '#2DD4BF',
    background: '#FFFFFF',
    surface: '#FFFFFF',
    card: '#FFFFFF',
    text: '#020617',
    textSecondary: '#64748b',
    textMuted: '#94a3b8',
    success: '#22C55E',
    warning: '#F59E0B',
    error: '#ef4444',
    info: '#3B82F6',
    border: '#e2e8f0',
    input: '#e2e8f0',
    ring: '#020617',
    icon: '#64748b',
    tint: '#1e3a5f',
    tabIconDefault: '#64748b',
    tabIconSelected: '#1e3a5f',
    overlay: 'rgba(0, 0, 0, 0.5)',
    destructive: '#ef4444',
    destructiveForeground: '#ffffff',
    popover: '#FFFFFF',
    popoverForeground: '#020617',
    chart: ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6'],
  },
  dark: {
    primary: '#f8fafc',
    primaryLight: '#e2e8f0',
    primaryDark: '#cbd5e1',
    secondary: '#1e293b',
    secondaryLight: '#334155',
    accent: '#2DD4BF',
    accentLight: '#14B8A6',
    background: '#020617',
    surface: '#0f172a',
    card: '#1e293b',
    text: '#f8fafc',
    textSecondary: '#94a3b8',
    textMuted: '#64748b',
    success: '#22C55E',
    warning: '#F59E0B',
    error: '#f87171',
    info: '#60a5fa',
    border: '#1e293b',
    input: '#1e293b',
    ring: '#94a3b8',
    icon: '#94a3b8',
    tint: '#f8fafc',
    tabIconDefault: '#94a3b8',
    tabIconSelected: '#f8fafc',
    overlay: 'rgba(0, 0, 0, 0.7)',
    destructive: '#991b1b',
    destructiveForeground: '#f8fafc',
    popover: '#1e293b',
    popoverForeground: '#f8fafc',
    chart: ['#60a5fa', '#4ade80', '#fbbf24', '#f87171', '#a78bfa'],
  },
  primary: '#1e3a5f',
  primaryLight: '#2563eb',
  primaryDark: '#1e3a8a',
  secondary: '#f1f5f9',
  secondaryLight: '#e2e8f0',
  accent: '#14B8A6',
  accentLight: '#2DD4BF',
  success: '#22C55E',
  warning: '#F59E0B',
  error: '#ef4444',
  info: '#3B82F6',
  gradient: {
    primary: ['#1e3a5f', '#2563eb'],
    secondary: ['#14B8A6', '#06B6D4'],
    sunset: ['#F59E0B', '#EF4444'],
    calm: ['#1e3a5f', '#14B8A6'],
  },
  text: {
    primary: {
      light: '#020617',
      dark: '#f8fafc',
    },
    secondary: {
      light: '#64748b',
      dark: '#94a3b8',
    },
    muted: {
      light: '#94a3b8',
      dark: '#64748b',
    },
  },
  background: {
    light: '#FFFFFF',
    dark: '#020617',
  },
  surface: {
    light: '#FFFFFF',
    dark: '#1e293b',
  },
  card: {
    light: '#FFFFFF',
    dark: '#1e293b',
  },
  border: {
    light: '#e2e8f0',
    dark: '#1e293b',
  },
  overlay: 'rgba(0, 0, 0, 0.5)',
  icon: '#64748b',
  iconDark: '#94a3b8',
  tint: '#1e3a5f',
  tintDark: '#f8fafc',
  tabIconDefault: '#64748b',
  tabIconSelected: '#1e3a5f',
};

export const Shadows = {
  small: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
    },
    android: {
      elevation: 1,
    },
  }),
  medium: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    android: {
      elevation: 2,
    },
  }),
  large: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
    },
    android: {
      elevation: 4,
    },
  }),
};

export const BorderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
