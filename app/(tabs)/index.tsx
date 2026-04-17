import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Colors, Shadows, BorderRadius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useLanguage } from '@/context/LanguageContext';
import { COURSES, EXPERTS, MENTAL_HEALTH_TESTS } from '@/constants/data';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = isDark ? Colors.dark : Colors.light;
  const { t } = useLanguage();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };

  const featuredCourses = COURSES.slice(0, 1);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
      }
    >
      <LinearGradient
        colors={Colors.gradient.primary as [string, string, ...string[]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.heroSection}
      >
        <View style={styles.heroContent}>
          <Animated.View entering={FadeInDown.delay(100)}>
            <Text style={styles.heroGreeting}>{t('home.welcome')}</Text>
            <Text style={styles.heroTitle}>Mind Miracles</Text>
            <Text style={styles.heroSubtitle}>
              {t('home.subtitle')}
            </Text>
          </Animated.View>
          
          <Animated.View entering={FadeInUp.delay(300)} style={styles.heroButtons}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => router.push('/(tabs)/test')}
            >
              <Ionicons name="heart" size={20} color="#fff" />
              <Text style={styles.primaryButtonText}>{t('test.title')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => router.push('/(tabs)/consult')}
            >
              <Ionicons name="calendar" size={20} color="#fff" />
              <Text style={styles.secondaryButtonText}>{t('consult.bookSession')}</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>

        <View style={styles.heroStats}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>5+</Text>
            <Text style={styles.statLabel}>Years Experience</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>500+</Text>
            <Text style={styles.statLabel}>Lives Transformed</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>4.9</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.content}>
          <Animated.View entering={FadeInDown.delay(200)}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {t('home.quickActions')}
            </Text>
          </View>
          <View style={styles.quickActions}>
            {MENTAL_HEALTH_TESTS.slice(0, 4).map((test) => (
              <TouchableOpacity
                key={test.id}
                style={[styles.quickActionCard, { backgroundColor: colors.card }]}
                onPress={() => router.push({ pathname: '/(tabs)/test', params: { testId: test.id } })}
              >
                <View style={[styles.quickActionIcon, { backgroundColor: test.color + '20' }]}>
                  <Ionicons name={test.icon as any} size={24} color={test.color} />
                </View>
                <Text style={[styles.quickActionText, { color: colors.text }]}>
                  {test.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(400)}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {t('home.featuredProgram')}
            </Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/courses')}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.coursesScroll}>
            {featuredCourses.map((course) => (
              <TouchableOpacity
                key={course.id}
                style={[styles.courseCard, { backgroundColor: colors.card }]}
                onPress={() => router.push({ pathname: '/(tabs)/courses', params: { courseId: course.id } })}
              >
                <Image source={{ uri: course.image }} style={styles.courseImage} />
                <View style={styles.courseContent}>
                  <View style={[styles.courseBadge, { backgroundColor: colors.primary + '20' }]}>
                    <Text style={[styles.courseBadgeText, { color: colors.primary }]}>{course.category}</Text>
                  </View>
                  <Text style={[styles.courseTitle, { color: colors.text }]}>
                    {course.title}
                  </Text>
                  <Text style={styles.courseDescription} numberOfLines={2}>
                    {course.description}
                  </Text>
                  <View style={styles.courseMeta}>
                    <View style={styles.courseMetaItem}>
                      <Ionicons name="time-outline" size={14} color={colors.textSecondary} />
                      <Text style={styles.courseMetaText}>{course.duration}</Text>
                    </View>
                    <View style={styles.courseMetaItem}>
                      <Ionicons name="layers-outline" size={14} color={colors.textSecondary} />
                      <Text style={styles.courseMetaText}>{course.sessions} sessions</Text>
                    </View>
                  </View>
                  <View style={styles.courseFooter}>
                    <Text style={styles.coursePrice}>₹{course.price}</Text>
                    <TouchableOpacity style={[styles.enrollButton, { backgroundColor: colors.primary }]}>
                      <Text style={styles.enrollButtonText}>Enroll</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(500)}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {t('home.ourExperts')}
            </Text>
          </View>
          <View style={[styles.expertCard, { backgroundColor: colors.card }]}>
            <Image source={{ uri: EXPERTS[0].image }} style={styles.expertImage} />
            <View style={styles.expertContent}>
              <View style={styles.expertInfo}>
                <Text style={[styles.expertName, { color: colors.text }]}>
                  {EXPERTS[0].name}
                </Text>
                <Text style={styles.expertTitle}>{EXPERTS[0].title}</Text>
                <View style={styles.expertMeta}>
                  <View style={styles.expertRating}>
                    <Ionicons name="star" size={14} color="#F59E0B" />
                    <Text style={[styles.expertRatingText, { color: colors.text }]}>{EXPERTS[0].rating}</Text>
                  </View>
                  <Text style={[styles.expertReviews, { color: colors.textSecondary }]}>{EXPERTS[0].reviews} reviews</Text>
                </View>
              </View>
              <TouchableOpacity
                style={[styles.bookExpertButton, { backgroundColor: colors.primary }]}
                onPress={() => router.push({ pathname: '/(tabs)/consult', params: { expertId: EXPERTS[0].id } })}
              >
                <Text style={styles.bookExpertButtonText}>Book Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(600)} style={styles.emergencySection}>
          <View style={[styles.emergencyCard, { backgroundColor: colors.card }]}>
            <View style={styles.emergencyHeader}>
              <View style={[styles.emergencyIcon, { backgroundColor: Colors.error + '20' }]}>
                <Ionicons name="call" size={20} color={Colors.error} />
              </View>
              <Text style={[styles.emergencyTitle, { color: colors.text }]}>
                Need Immediate Help?
              </Text>
            </View>
            <Text style={[styles.emergencyText, { color: colors.textSecondary }]}>
              If you&apos;re in crisis, please reach out to professional helpline services available 24/7.
            </Text>
            <TouchableOpacity style={styles.emergencyButton}>
              <Ionicons name="logo-whatsapp" size={18} color="#fff" />
              <Text style={styles.emergencyButtonText}>Contact Helpline</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        <View style={styles.bottomPadding} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heroSection: {
    paddingTop: 60,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  heroContent: {
    paddingHorizontal: 20,
  },
  heroGreeting: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 22,
    marginBottom: 20,
  },
  heroButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: BorderRadius.lg,
    ...Shadows.medium,
  },
  primaryButtonText: {
    color: Colors.primary,
    fontWeight: '600',
    fontSize: 15,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  secondaryButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
  heroStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 30,
    paddingHorizontal: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  content: {
    paddingHorizontal: 16,
    marginTop: -10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  seeAll: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickActionCard: {
    width: (width - 44) / 2,
    padding: 16,
    borderRadius: BorderRadius.lg,
    ...Shadows.small,
  },
  quickActionIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  quickActionText: {
    fontSize: 13,
    fontWeight: '600',
  },
  coursesScroll: {
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  courseCard: {
    width: width * 0.7,
    marginRight: 16,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    ...Shadows.medium,
  },
  courseImage: {
    width: '100%',
    height: 140,
  },
  courseContent: {
    padding: 14,
  },
  courseBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
    marginBottom: 8,
  },
  courseBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  courseDescription: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 18,
    marginBottom: 10,
  },
  courseMeta: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  courseMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  courseMetaText: {
    fontSize: 12,
    color: '#64748B',
  },
  courseFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  coursePrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  enrollButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: BorderRadius.md,
  },
  enrollButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
  },
  expertCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: BorderRadius.lg,
    ...Shadows.small,
  },
  expertImage: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.lg,
  },
  expertContent: {
    flex: 1,
    marginLeft: 14,
    justifyContent: 'space-between',
  },
  expertInfo: {},
  expertName: {
    fontSize: 16,
    fontWeight: '700',
  },
  expertTitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  expertMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 6,
  },
  expertRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  expertRatingText: {
    fontSize: 12,
    fontWeight: '600',
  },
  expertReviews: {
    fontSize: 12,
    color: '#64748B',
  },
  bookExpertButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: BorderRadius.md,
    alignSelf: 'flex-start',
  },
  bookExpertButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
  },
  emergencySection: {
    marginTop: 24,
  },
  emergencyCard: {
    padding: 16,
    borderRadius: BorderRadius.lg,
    ...Shadows.small,
  },
  emergencyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  emergencyIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emergencyTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  emergencyText: {
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 14,
  },
  emergencyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#25D366',
    paddingVertical: 12,
    borderRadius: BorderRadius.md,
  },
  emergencyButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  bottomPadding: {
    height: 30,
  },
});
