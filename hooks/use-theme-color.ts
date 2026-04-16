/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type ColorName = 'background' | 'text' | 'textSecondary' | 'textMuted' | 'primary' | 'secondary' | 
                 'border' | 'icon' | 'card' | 'surface' | 'success' | 'warning' | 'error' | 'info' |
                 'primaryLight' | 'primaryDark' | 'secondaryLight' | 'accent' | 'accentLight' |
                 'tabIconDefault' | 'tabIconSelected' | 'tint' | 'overlay' | 'destructive' |
                 'destructiveForeground' | 'popover' | 'popoverForeground' | 'input' | 'ring';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: ColorName
): string {
  const theme = useColorScheme() ?? 'light';
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    const color = Colors[theme][colorName];
    return typeof color === 'string' ? color : color[0];
  }
}
