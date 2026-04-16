import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Shadows, BorderRadius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const { width } = Dimensions.get('window');

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = isDark ? Colors.dark : Colors.light;
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const userStats = {
    sessionsCompleted: 12,
    coursesEnrolled: 2,
    testsTaken: 5,
    streakDays: 7,
  };

  const recentActivity = [
    { id: 1, type: 'session', title: 'Anxiety Management Session', date: '2 days ago', icon: 'heart' },
    { id: 2, type: 'test', title: 'Completed Stress Test', date: '1 week ago', score: 75, icon: 'trending-up' },
    { id: 3, type: 'course', title: 'Started Self-Hypnosis Course', date: '2 weeks ago', icon: 'play-circle' },
  ];

  const menuItems = [
    { icon: 'book', label: 'My Courses', color: Colors.primary },
    { icon: 'document-text', label: 'Test History', color: Colors.secondary },
    { icon: 'calendar', label: 'Session History', color: Colors.accent },
    { icon: 'chatbubbles', label: 'Messages', color: Colors.warning },
    { icon: 'bookmark', label: 'Saved Articles', color: Colors.info },
  ];

  if (!isLoggedIn) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.authContainer}>
          <LinearGradient
            colors={Colors.gradient.primary as [string, string, ...string[]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.authHeader}
          >
            <View style={styles.authLogo}>
              <Ionicons name="heart" size={48} color="#fff" />
            </View>
            <Text style={styles.authTitle}>Mind Miracles</Text>
            <Text style={styles.authSubtitle}>Your journey to wellness starts here</Text>
          </LinearGradient>

          <View style={styles.authContent}>
            <Text style={[styles.authHeading, { color: colors.text }]}>
              Welcome Back
            </Text>
            <Text style={[styles.authDescription, { color: colors.textSecondary }]}>
              Sign in to track your progress, access personalized content, and connect with our experts.
            </Text>

            <TouchableOpacity
              style={[styles.authButton, { backgroundColor: Colors.primary }]}
              onPress={() => setIsLoggedIn(true)}
            >
              <Ionicons name="mail" size={20} color="#fff" />
              <Text style={styles.authButtonText}>Continue with Email</Text>
            </TouchableOpacity>

            <View style={styles.authDivider}>
              <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
              <Text style={[styles.dividerText, { color: colors.textMuted }]}>or</Text>
              <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
            </View>

            <TouchableOpacity style={[styles.socialButton, { backgroundColor: colors.card }]}>
              <Ionicons name="logo-google" size={20} color={Colors.error} />
              <Text style={[styles.socialButtonText, { color: colors.text }]}>
                Continue with Google
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.socialButton, { backgroundColor: colors.card }]}>
              <Ionicons name="logo-apple" size={20} color={colors.text} />
              <Text style={[styles.socialButtonText, { color: colors.text }]}>
                Continue with Apple
              </Text>
            </TouchableOpacity>

            <View style={styles.authFooter}>
              <Text style={[styles.authFooterText, { color: colors.textSecondary }]}>Don&apos;t have an account?</Text>
              <TouchableOpacity onPress={() => setIsLoggedIn(true)}>
                <Text style={[styles.authFooterLink, { color: Colors.primary }]}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      <LinearGradient
        colors={Colors.gradient.primary as [string, string, ...string[]]}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications-outline" size={24} color="#fff" />
          </TouchableOpacity>
          <View style={styles.userInfo}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200' }}
              style={styles.userAvatar}
            />
            <View style={styles.userDetails}>
              <Text style={styles.userName}>Welcome!</Text>
              <Text style={styles.userSubtitle}>Your wellness journey continues</Text>
            </View>
          </View>
        </View>

        <View style={styles.streakCard}>
          <View style={styles.streakContent}>
            <Ionicons name="flame" size={28} color="#F59E0B" />
            <View>
              <Text style={styles.streakNumber}>{userStats.streakDays} Day Streak!</Text>
              <Text style={styles.streakText}>Keep up the great work</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.streakButton}>
            <Ionicons name="chevron-forward" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { backgroundColor: colors.card }]}>
            <View style={[styles.statIcon, { backgroundColor: Colors.primary + '20' }]}>
              <Ionicons name="calendar" size={20} color={Colors.primary} />
            </View>
            <Text style={[styles.statNumber, { color: colors.text }]}>
              {userStats.sessionsCompleted}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Sessions</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.card }]}>
            <View style={[styles.statIcon, { backgroundColor: Colors.secondary + '20' }]}>
              <Ionicons name="book" size={20} color={Colors.secondary} />
            </View>
            <Text style={[styles.statNumber, { color: colors.text }]}>
              {userStats.coursesEnrolled}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Courses</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.card }]}>
            <View style={[styles.statIcon, { backgroundColor: Colors.accent + '20' }]}>
              <Ionicons name="clipboard" size={20} color={Colors.accent} />
            </View>
            <Text style={[styles.statNumber, { color: colors.text }]}>
              {userStats.testsTaken}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Tests</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Recent Activity
          </Text>
          <View style={[styles.activityCard, { backgroundColor: colors.card }]}>
            {recentActivity.map((activity) => (
              <TouchableOpacity key={activity.id} style={[styles.activityItem, { borderBottomColor: colors.border }]}>
                <View style={[styles.activityIcon, { backgroundColor: Colors.primary + '15' }]}>
                  <Ionicons name={activity.icon as any} size={18} color={Colors.primary} />
                </View>
                <View style={styles.activityContent}>
                  <Text style={[styles.activityTitle, { color: colors.text }]}>
                    {activity.title}
                  </Text>
                  <Text style={[styles.activityDate, { color: colors.textMuted }]}>{activity.date}</Text>
                </View>
                {activity.score && (
                  <View style={[styles.scoreBadge, { backgroundColor: Colors.success + '20' }]}>
                    <Text style={[styles.scoreText, { color: Colors.success }]}>{activity.score}%</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Quick Actions
          </Text>
          <View style={styles.quickActionsGrid}>
            {[
              { icon: 'play', label: 'Resume Course', bg: Colors.primary + '20', color: Colors.primary },
              { icon: 'chatbox-ellipses', label: 'Chat Expert', bg: Colors.secondary + '20', color: Colors.secondary },
              { icon: 'journal', label: 'Mood Journal', bg: Colors.accent + '20', color: Colors.accent },
              { icon: 'download', label: 'Downloads', bg: Colors.warning + '20', color: Colors.warning },
            ].map((item, index) => (
              <TouchableOpacity key={index} style={[styles.quickAction, { backgroundColor: colors.card }]}>
                <View style={[styles.quickActionIcon, { backgroundColor: item.bg }]}>
                  <Ionicons name={item.icon as any} size={24} color={item.color} />
                </View>
                <Text style={[styles.quickActionLabel, { color: colors.text }]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Menu
          </Text>
          <View style={[styles.menuCard, { backgroundColor: colors.card }]}>
            {menuItems.map((item, index) => (
              <TouchableOpacity key={index} style={[styles.menuItem, { borderBottomColor: colors.border }]}>
                <View style={[styles.menuIcon, { backgroundColor: item.color + '20' }]}>
                  <Ionicons name={item.icon as any} size={20} color={item.color} />
                </View>
                <Text style={[styles.menuLabel, { color: colors.text }]}>
                  {item.label}
                </Text>
                <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={20} color={Colors.error} />
          <Text style={[styles.logoutText, { color: Colors.error }]}>Sign Out</Text>
        </TouchableOpacity>

        <View style={styles.bottomPadding} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  authContainer: {
    flex: 1,
  },
  authHeader: {
    paddingTop: 80,
    paddingBottom: 40,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  authLogo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  authTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  authSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  authContent: {
    padding: 24,
    marginTop: 20,
  },
  authHeading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  authDescription: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 24,
  },
  authButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 16,
    borderRadius: BorderRadius.lg,
    ...Shadows.medium,
  },
  authButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  authDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 13,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 14,
    borderRadius: BorderRadius.lg,
    marginBottom: 12,
    ...Shadows.small,
  },
  socialButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
  authFooter: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginTop: 20,
  },
  authFooterText: {
    fontSize: 14,
  },
  authFooterLink: {
    fontSize: 14,
    fontWeight: '600',
  },
  headerGradient: {
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#fff',
  },
  userDetails: {},
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  userSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },
  streakCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginTop: 20,
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  streakContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  streakNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  streakText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },
  streakButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    paddingHorizontal: 16,
    marginTop: -10,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  statCard: {
    flex: 1,
    padding: 14,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    ...Shadows.small,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 11,
    marginTop: 2,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 14,
  },
  activityCard: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    ...Shadows.small,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: 1,
  },
  activityIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityContent: {
    flex: 1,
    marginLeft: 12,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  activityDate: {
    fontSize: 11,
    marginTop: 2,
  },
  scoreBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  scoreText: {
    fontSize: 12,
    fontWeight: '600',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  quickAction: {
    width: (width - 42) / 2,
    padding: 16,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    ...Shadows.small,
  },
  quickActionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  quickActionLabel: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  menuCard: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    ...Shadows.small,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: 1,
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuLabel: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    fontWeight: '500',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 24,
    paddingVertical: 14,
  },
  logoutText: {
    fontSize: 15,
    fontWeight: '600',
  },
  bottomPadding: {
    height: 40,
  },
});
