import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ComponentProps } from 'react';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

type IconMapping = {
  [key: string]: ComponentProps<typeof MaterialIcons>['name'];
};

const MAPPING: IconMapping = {
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
  'brain': 'psychology',
  'heart': 'favorite',
  'users': 'groups',
  'zap': 'flash-on',
  'book': 'menu-book',
  'user': 'person',
  'settings': 'settings',
  'chat': 'chat',
  'phone': 'phone',
  'video': 'videocam',
  'calendar': 'calendar-today',
  'clock': 'access-time',
  'star': 'star',
  'check': 'check-circle',
  'close': 'close',
  'menu': 'menu',
  'search': 'search',
  'filter': 'filter-list',
  'share': 'share',
  'bookmark': 'bookmark',
  'download': 'download',
  'play': 'play-arrow',
  'pause': 'pause',
  'forward': 'fast-forward',
  'backward': 'fast-rewind',
  'volume': 'volume-up',
  'mic': 'mic',
  'camera': 'camera-alt',
  'image': 'image',
  'location': 'location-on',
  'email': 'email',
  'lock': 'lock',
  'unlock': 'lock-open',
  'eye': 'visibility',
  'eye-off': 'visibility-off',
  'arrow-left': 'arrow-back',
  'arrow-right': 'arrow-forward',
  'arrow-up': 'arrow-upward',
  'arrow-down': 'arrow-downward',
  'plus': 'add',
  'minus': 'remove',
  'refresh': 'refresh',
  'more': 'more-horiz',
  'info': 'info',
  'help': 'help-outline',
  'warning': 'warning',
  'error': 'error',
  'success': 'check-circle',
  'shield': 'verified-user',
  'trending-up': 'trending-up',
  'trending-down': 'trending-down',
  'activity': 'show-chart',
  'award': 'emoji-events',
  'target': 'gps-fixed',
  'sun': 'wb-sunny',
  'moon': 'nightlight-round',
  'cloud': 'cloud',
  'fire': 'local-fire-department',
  'leaf': 'eco',
  'water': 'water-drop',
  'balance': 'balance',
  'meditation': 'self-improvement',
};

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: string;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
}) {
  const iconName = MAPPING[name] || 'help-outline';
  return <MaterialIcons color={color} size={size} name={iconName} style={style} />;
}
