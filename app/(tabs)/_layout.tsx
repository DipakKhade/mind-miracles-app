import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = isDark ? Colors.dark : Colors.light;

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
          height: Platform.OS === 'ios' ? 85 : 65,
          paddingBottom: Platform.OS === 'ios' ? 25 : 10,
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
          title: 'Home',
          headerTitle: 'Mind Miracles',
          tabBarIcon: ({ color, size }) => <IconSymbol name="house.fill" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="courses"
        options={{
          title: 'Courses',
          headerTitle: 'Programs',
          tabBarIcon: ({ color, size }) => <IconSymbol name="book" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="test"
        options={{
          title: 'Test',
          headerTitle: 'Mental Health Test',
          tabBarIcon: ({ color, size }) => <IconSymbol name="brain" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="consult"
        options={{
          title: 'Consult',
          headerTitle: 'Consultation',
          tabBarIcon: ({ color, size }) => <IconSymbol name="chat" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          headerTitle: 'My Profile',
          tabBarIcon: ({ color, size }) => <IconSymbol name="user" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
