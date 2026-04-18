import { BorderRadius, Colors, Shadows } from '@/constants/theme';
import { useLanguage } from '@/context/LanguageContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import {
  getCurrentUser,
  GoogleSigninButton,
  signInWithGoogle,
  signOutGoogle,
} from '@/utils/googleAuth';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
  Modal,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = isDark ? Colors.dark : Colors.light;
  const { language, setLanguage, t } = useLanguage();
  const insets = useSafeAreaInsets();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  useEffect(() => {
    checkCurrentUser();
  }, []);

  const checkCurrentUser = async () => {
    const result = await getCurrentUser();
    if (result.success && result.user) {
      setUserInfo(result.user.user);
      setIsLoggedIn(true);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    const result = await signInWithGoogle();
    setLoading(false);
    
    if (result.success) {
      setUserInfo(result.user.user);
      setIsLoggedIn(true);
    } else {
      Alert.alert('Sign In Failed', result.error || 'Please try again');
    }
  };

  const handleSignOut = async () => {
    setLoading(true);
    const result = await signOutGoogle();
    setLoading(false);
    
    if (result.success) {
      setUserInfo(null);
      setIsLoggedIn(false);
    } else {
      Alert.alert('Sign Out Failed', result.error || 'Please try again');
    }
  };

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
    { icon: 'book', label: t('profile.myCourses'), color: Colors.primary },
    { icon: 'document-text', label: t('profile.testHistory'), color: Colors.secondary },
    { icon: 'calendar', label: t('profile.sessionHistory'), color: Colors.accent },
    { icon: 'chatbubbles', label: t('profile.messages'), color: Colors.warning },
    { icon: 'bookmark', label: t('profile.savedArticles'), color: Colors.info },
  ];

  const settingsMenuItems = [
    { icon: 'language', label: t('profile.language'), color: Colors.primary, onPress: () => setShowLanguageModal(true) },
    { icon: 'notifications', label: t('profile.notifications'), color: Colors.warning },
    { icon: 'shield-checkmark', label: t('profile.privacyPolicy'), color: Colors.info },
    { icon: 'document-text', label: t('profile.termsOfService'), color: Colors.secondary },
  ];

  const authScrollStyle = { flexGrow: 1, paddingBottom: insets.bottom + 20 };

  if (!isLoggedIn) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={authScrollStyle}>
          <View style={styles.authContainer}>
            <LinearGradient
              colors={Colors.gradient.primary as [string, string, ...string[]]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.authHeader}
            >
              <View style={styles.authLogo}>
                <Image
                  source={require('../../assets/mm_images/mind_miracles_logo.png')}
                  style={styles.logoImage}
                />
              </View>
              <Text style={styles.authTitle}>Mind Miracles</Text>
              <Text style={styles.authSubtitle}>Your journey to wellness starts here</Text>
            </LinearGradient>

            <View style={styles.authContent}>
              <Text style={[styles.authHeading, { color: colors.text }]}>
                {t('profile.welcomeBack')}
              </Text>
              <Text style={[styles.authDescription, { color: colors.textSecondary }]}>
                {t('profile.signInDesc')}
              </Text>

              <GoogleSigninButton
                style={styles.googleButton}
                size={GoogleSigninButton.Size.Wide}
                color={GoogleSigninButton.Color.Dark}
                onPress={handleGoogleSignIn}
                disabled={loading}
              />

            </View>

            <View style={styles.settingsSection}>
              <Text style={[styles.settingsTitle, { color: colors.text }]}>
                {t('profile.settings')}
              </Text>
              <TouchableOpacity 
                style={[styles.settingsButton, { backgroundColor: colors.card }]}
                onPress={() => setShowLanguageModal(true)}
              >
                <View style={[styles.settingsIcon, { backgroundColor: Colors.primary + '20' }]}>
                  <Ionicons name="language" size={20} color={Colors.primary} />
                </View>
                <Text style={[styles.settingsLabel, { color: colors.text }]}>
                  {t('profile.language')}
                </Text>
                <View style={styles.settingsRight}>
                  <Text style={[styles.currentLang, { color: colors.textSecondary }]}>
                    {language === 'en' ? 'English' : 'मराठी'}
                  </Text>
                  <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        <Modal
          visible={showLanguageModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowLanguageModal(false)}
        >
          <TouchableOpacity 
            style={styles.modalOverlay} 
            activeOpacity={1} 
            onPress={() => setShowLanguageModal(false)}
          >
            <View style={[styles.languageModal, { backgroundColor: colors.card }]}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                {t('profile.language')}
              </Text>
              
              <TouchableOpacity
                style={[styles.languageOption, { borderBottomColor: colors.border }]}
                onPress={() => { setLanguage('en'); setShowLanguageModal(false); }}
              >
                <Text style={[styles.languageText, { color: colors.text }]}>
                  {t('languages.en')}
                </Text>
                {language === 'en' && (
                  <Ionicons name="checkmark-circle" size={24} color={Colors.primary} />
                )}
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.languageOption, { borderBottomColor: colors.border }]}
                onPress={() => { setLanguage('mr'); setShowLanguageModal(false); }}
              >
                <Text style={[styles.languageText, { color: colors.text }]}>
                  {t('languages.mr')}
                </Text>
                {language === 'mr' && (
                  <Ionicons name="checkmark-circle" size={24} color={Colors.primary} />
                )}
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalCancelButton, { backgroundColor: colors.background }]}
                onPress={() => setShowLanguageModal(false)}
              >
                <Text style={[styles.modalCancelText, { color: colors.text }]}>
                  {t('common.cancel')}
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}>
        <LinearGradient
          colors={Colors.gradient.primary as [string, string, ...string[]]}
          style={styles.headerGradient}
        >
          <View style={styles.header}>
            <Text style={styles.headerGreeting}>{t('home.welcome')}</Text>
          </View>

          <View style={styles.userProfileCard}>
            {userInfo?.photo ? (
              <Image source={{ uri: userInfo.photo }} style={styles.profileAvatar} />
            ) : (
              <View style={[styles.profileAvatar, styles.profileAvatarPlaceholder]}>
                <Ionicons name="person" size={40} color="#fff" />
              </View>
            )}
            <Text style={styles.profileName}>{userInfo?.name || 'Welcome!'}</Text>
            {userInfo?.email && (
              <Text style={styles.profileEmail}>{userInfo.email}</Text>
            )}
          </View>
        </LinearGradient>

        <View style={styles.content}>
          <View style={styles.statsGrid}>
            <View style={[styles.statCard, { backgroundColor: colors.card }]}>
              <View style={[styles.statIcon, { backgroundColor: Colors.primary + '20' }]}>
                <Ionicons name="calendar" size={20} color={Colors.primary} />
              </View>
              <Text style={[styles.statNumber, { color: colors.text }]}>{userStats.sessionsCompleted}</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{t('profile.sessionsCompleted')}</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: colors.card }]}>
              <View style={[styles.statIcon, { backgroundColor: Colors.secondary + '20' }]}>
                <Ionicons name="book" size={20} color={Colors.secondary} />
              </View>
              <Text style={[styles.statNumber, { color: colors.text }]}>{userStats.coursesEnrolled}</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{t('profile.coursesEnrolled')}</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: colors.card }]}>
              <View style={[styles.statIcon, { backgroundColor: Colors.accent + '20' }]}>
                <Ionicons name="clipboard" size={20} color={Colors.accent} />
              </View>
              <Text style={[styles.statNumber, { color: colors.text }]}>{userStats.testsTaken}</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{t('profile.testsTaken')}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('profile.recentActivity')}</Text>
            <View style={[styles.activityCard, { backgroundColor: colors.card }]}>
              {recentActivity.map((activity) => (
                <TouchableOpacity key={activity.id} style={[styles.activityItem, { borderBottomColor: colors.border }]}>
                  <View style={[styles.activityIcon, { backgroundColor: Colors.primary + '15' }]}>
                    <Ionicons name={activity.icon as any} size={18} color={Colors.primary} />
                  </View>
                  <View style={styles.activityContent}>
                    <Text style={[styles.activityTitle, { color: colors.text }]}>{activity.title}</Text>
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
            <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('profile.quickActions')}</Text>
            <View style={styles.quickActionsGrid}>
              {[
                { icon: 'play', label: t('profile.resumeCourse'), bg: Colors.primary + '20', color: Colors.primary },
                { icon: 'chatbox-ellipses', label: t('profile.chatExpert'), bg: Colors.secondary + '20', color: Colors.secondary },
                { icon: 'journal', label: t('profile.moodJournal'), bg: Colors.accent + '20', color: Colors.accent },
                { icon: 'download', label: t('profile.downloads'), bg: Colors.warning + '20', color: Colors.warning },
              ].map((item, index) => (
                <TouchableOpacity key={index} style={[styles.quickAction, { backgroundColor: colors.card }]}>
                  <View style={[styles.quickActionIcon, { backgroundColor: item.bg }]}>
                    <Ionicons name={item.icon as any} size={24} color={item.color} />
                  </View>
                  <Text style={[styles.quickActionLabel, { color: colors.text }]}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Menu</Text>
            <View style={[styles.menuCard, { backgroundColor: colors.card }]}>
              {menuItems.map((item, index) => (
                <TouchableOpacity key={index} style={[styles.menuItem, { borderBottomColor: colors.border }]}>
                  <View style={[styles.menuIcon, { backgroundColor: item.color + '20' }]}>
                    <Ionicons name={item.icon as any} size={20} color={item.color} />
                  </View>
                  <Text style={[styles.menuLabel, { color: colors.text }]}>{item.label}</Text>
                  <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('profile.settings')}</Text>
            <View style={[styles.menuCard, { backgroundColor: colors.card }]}>
              {settingsMenuItems.map((item, index) => (
                <TouchableOpacity key={index} style={[styles.menuItem, { borderBottomColor: colors.border }]} onPress={item.onPress}>
                  <View style={[styles.menuIcon, { backgroundColor: item.color + '20' }]}>
                    <Ionicons name={item.icon as any} size={20} color={item.color} />
                  </View>
                  <Text style={[styles.menuLabel, { color: colors.text }]}>{item.label}</Text>
                  <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity style={[styles.signOutButton, { borderColor: Colors.error }]} onPress={handleSignOut}>
            <Ionicons name="logo-google" size={20} color={Colors.error} />
            <Text style={[styles.signOutText, { color: Colors.error }]}>{t('profile.signOutGoogle')}</Text>
          </TouchableOpacity>

          <View style={styles.bottomPadding}></View>
        </View>
      </ScrollView>

      <Modal visible={showLanguageModal} transparent animationType="fade" onRequestClose={() => setShowLanguageModal(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowLanguageModal(false)}>
          <View style={[styles.languageModal, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>{t('profile.language')}</Text>
            <TouchableOpacity style={[styles.languageOption, { borderBottomColor: colors.border }]} onPress={() => { setLanguage('en'); setShowLanguageModal(false); }}>
              <Text style={[styles.languageText, { color: colors.text }]}>{t('languages.en')}</Text>
              {language === 'en' && <Ionicons name="checkmark-circle" size={24} color={Colors.primary} />}
            </TouchableOpacity>
            <TouchableOpacity style={[styles.languageOption, { borderBottomColor: colors.border }]} onPress={() => { setLanguage('mr'); setShowLanguageModal(false); }}>
              <Text style={[styles.languageText, { color: colors.text }]}>{t('languages.mr')}</Text>
              {language === 'mr' && <Ionicons name="checkmark-circle" size={24} color={Colors.primary} />}
            </TouchableOpacity>
            <TouchableOpacity style={[styles.modalCancelButton, { backgroundColor: colors.background }]} onPress={() => setShowLanguageModal(false)}>
              <Text style={[styles.modalCancelText, { color: colors.text }]}>{t('common.cancel')}</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
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
  logoImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
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
  googleButton: {
    width: '100%',
    height: 52,
    marginBottom: 20,
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
  userAvatarPlaceholder: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
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
  headerGreeting: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  userProfileCard: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  profileAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#fff',
    marginBottom: 16,
  },
  profileAvatarPlaceholder: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
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
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 24,
    paddingVertical: 14,
    borderWidth: 2,
    borderRadius: BorderRadius.lg,
  },
  signOutText: {
    fontSize: 15,
    fontWeight: '600',
  },
  bottomPadding: {
    height: 40,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  languageModal: {
    width: '100%',
    maxWidth: 340,
    borderRadius: BorderRadius.xl,
    padding: 20,
    ...Shadows.large,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
  },
  languageOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  languageText: {
    fontSize: 16,
    fontWeight: '500',
  },
  modalCancelButton: {
    marginTop: 20,
    paddingVertical: 14,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 16,
    fontWeight: '600',
  },
  settingsSection: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  settingsTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  settingsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: BorderRadius.lg,
    ...Shadows.small,
  },
  settingsIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsLabel: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
    fontWeight: '500',
  },
  settingsRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  currentLang: {
    fontSize: 13,
  },
});
