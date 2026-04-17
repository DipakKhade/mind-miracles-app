import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useLanguage } from '@/context/LanguageContext';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = isDark ? Colors.dark : Colors.light;
  const { t } = useLanguage();
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        headerShown: true,
        headerStyle: {
          backgroundColor: colors.surface,
        },
        headerTitleStyle: {
          color: colors.text,
          fontWeight: '600',
        },
        headerShadowVisible: false,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 85 : 65 + insets.bottom,
          paddingBottom: Platform.OS === 'ios' ? 25 : insets.bottom + 10,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('common.home'),
          headerTitle: 'Mind Miracles',
          tabBarIcon: ({ color, size }) => <IconSymbol name="house.fill" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="courses"
        options={{
          title: t('common.courses'),
          headerTitle: t('courses.title'),
          tabBarIcon: ({ color, size }) => <IconSymbol name="book" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="test"
        options={{
          title: t('common.test'),
          headerTitle: t('test.title'),
          tabBarIcon: ({ color, size }) => <IconSymbol name="meditation" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="consult"
        options={{
          title: t('common.consult'),
          headerTitle: t('consult.title'),
          tabBarIcon: ({ color, size }) => <IconSymbol name="chat" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t('common.profile'),
          headerTitle: t('profile.title'),
          tabBarIcon: ({ color, size }) => <IconSymbol name="user" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
