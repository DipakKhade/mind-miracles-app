import { BorderRadius, Colors } from '@/constants/theme';
import { useLanguage } from '@/context/LanguageContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { api, CourseWithFeatures } from '@/utils/api';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function CourseDetailScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = isDark ? Colors.dark : Colors.light;
  const { t } = useLanguage();
  const params = useLocalSearchParams();
  const courseId = params.courseId as string;

  const [course, setCourse] = useState<CourseWithFeatures | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [enrolling, setEnrolling] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);

  useEffect(() => {
    if (courseId) {
      fetchCourseDetails();
      checkEnrollment();
    }
  }, [courseId]);

  const fetchCourseDetails = async () => {
    try {
      setLoading(true);
      const data = await api.courses.getById(courseId);
      console.log('[Course] Course data:', JSON.stringify(data)?.slice(0, 200));
      
      // Server returns course directly or wrapped in { course }
      const courseData = data?.course || data;
      setCourse({
        course: courseData,
        features: data?.features || [],
      });
    } catch (err: any) {
      console.log('[Course] Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const checkEnrollment = async () => {
    try {
      const userId = await AsyncStorage.getItem('server_user_id');
      console.log('[Course] User ID from storage:', userId);
      if (userId && courseId) {
        await api.enrollments.check(userId, courseId);
        setIsEnrolled(true);
      }
    } catch (err: any) {
      console.log('[Course] Not enrolled or error:', err?.message || err);
    }
  };

  const handleEnroll = async () => {
    const courseData = course?.course || course;
    console.log('course data is this----', courseData)
    if (!courseData) return;

    if (isEnrolled) {
      Alert.alert('Already Enrolled', 'You are already enrolled in this course.');
      return;
    }

    try {
      setEnrolling(true);
      let userId = await AsyncStorage.getItem('server_user_id');
      console.log('[Course] User ID:', userId);

      if (!userId) {
        // Also check for Google user session
        const googleUser = await GoogleSignin.getCurrentUser();
        if (googleUser?.user) {
          userId = googleUser.user.id;
        }
      }

      console.log('[Course] Final userId:', userId);

      if (!userId) {
        Alert.alert('Sign In Required', 'Please sign in to enroll in courses.');
        router.push('/(tabs)/profile');
        return;
      }

      // For free courses, enroll directly
      if (!courseData.isPaid) {
        try {
          await api.enrollments.create(userId, courseId);
          setIsEnrolled(true);
          Alert.alert('Success!', 'You have been enrolled in this course.');
        } catch (enrollErr: any) {
          // If enrollment already exists, consider enrolled
          if (enrollErr.message?.includes('already enrolled')) {
            setIsEnrolled(true);
            Alert.alert('Success!', 'You are already enrolled.');
            return;
          }
          throw enrollErr;
        }
        return;
      }

      // For paid courses, create payment order
      const order = await api.payments.createOrder(
        courseData.price,
        userId,
        courseId
      );

      const razorpayOptions = {
        description: `Enrollment for ${courseData.title}`,
        image: courseData.thumbnailURL || undefined,
        currency: 'INR',
        amount: (courseData.price * 100).toString(),
        name: 'Mind Miracles',
        order_id: order.orderId,
        theme: {
          color: Colors.primary,
          hide_topbar: false,
        },
      };

      const paymentResult = await RazorpayCheckout.open(razorpayOptions);

      if (paymentResult) {
        await api.payments.verify(
          paymentResult.razorpay_order_id,
          paymentResult.razorpay_payment_id,
          paymentResult.razorpay_signature
        );
        setIsEnrolled(true);
        Alert.alert('Payment Successful!', 'You have been enrolled in this course.');
      }
    } catch (err: any) {
      console.log('[Course] Enroll error:', err);
      Alert.alert('Enrollment Error', err.message || 'Failed to enroll. Please try again.');
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading course...</Text>
      </View>
    );
  }

  if (error || (!course && !loading)) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: Colors.error }]}>{error || 'Course not found'}</Text>
        <TouchableOpacity style={[styles.retryButton, { backgroundColor: colors.primary }]} onPress={fetchCourseDetails}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const courseData = course?.course || course;
  const features = course?.features || [];

  if (!courseData) {
    return null;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        <Image
          source={{ uri: courseData?.thumbnailURL || '' }}
          style={styles.courseImage}
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.imageOverlay}
        >
          <View style={[styles.badge, { backgroundColor: courseData?.isPaid ? Colors.primary : Colors.success }]}>
            <Text style={styles.badgeText}>{courseData?.isPaid ? 'Premium' : 'Free'}</Text>
          </View>
        </LinearGradient>

        <View style={styles.content}>
          <Text style={[styles.courseTitle, { color: colors.text }]}>{courseData?.title || 'Course'}</Text>
          
          <View style={styles.priceContainer}>
            <Text style={styles.price}>₹{courseData?.price || 0}</Text>
            {courseData?.isPaid && (
              <Text style={styles.originalPrice}>₹{Math.round((courseData?.price || 0) * 2)}</Text>
            )}
          </View>

          <Text style={[styles.description, { color: colors.textSecondary }]}>
            {courseData?.description || ''}
          </Text>

          <View style={[styles.section, { borderBottomColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>What you'll learn</Text>
            {features.map((feature: any, index: number) => (
              <View key={index} style={styles.featureItem}>
                <Ionicons name="checkmark-circle" size={20} color={Colors.success} />
                <Text style={[styles.featureText, { color: colors.text }]}>{feature.feature}</Text>
              </View>
            ))}
            {features.length === 0 && (
              <Text style={[styles.noFeatures, { color: colors.textMuted }]}>
                This course includes video lessons and practical exercises.
              </Text>
            )}
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Ionicons name="play-circle" size={20} color={colors.primary} />
              <Text style={[styles.statText, { color: colors.text }]}>Video Lessons</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="time" size={20} color={colors.primary} />
              <Text style={[styles.statText, { color: colors.text }]}>Lifetime Access</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="certificate" size={20} color={colors.primary} />
              <Text style={[styles.statText, { color: colors.text }]}>Certificate</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
        <View style={styles.footerPrice}>
          <Text style={[styles.footerPriceLabel, { color: colors.textSecondary }]}>Total</Text>
          <Text style={[styles.footerPriceAmount, { color: colors.text }]}>₹{courseData?.price || 0}</Text>
        </View>
        
        {isEnrolled ? (
          <TouchableOpacity
            style={[styles.enrollButton, { backgroundColor: Colors.success }]}
            onPress={() => router.push({ pathname: '/(tabs)/courses', params: { courseId } })}
          >
            <Ionicons name="play" size={20} color="#fff" />
            <Text style={styles.enrollButtonText}>Start Learning</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[
              styles.enrollButton,
              { backgroundColor: enrolling ? colors.textMuted : colors.primary }
            ]}
            onPress={handleEnroll}
            disabled={enrolling}
          >
            {enrolling ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <Ionicons name="card" size={20} color="#fff" />
                <Text style={styles.enrollButtonText}>
                  {courseData.price === 0 ? 'Enroll for Free' : 'Buy Now'}
                </Text>
              </>
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 12, fontSize: 14 },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  errorText: { fontSize: 16, textAlign: 'center', marginBottom: 20 },
  retryButton: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: BorderRadius.md },
  retryButtonText: { color: '#fff', fontWeight: '600' },
  backButton: { position: 'absolute', top: 50, left: 16, zIndex: 10, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  courseImage: { width: '100%', height: 250 },
  imageOverlay: { position: 'absolute', top: 0, left: 0, right: 0, height: 250, justifyContent: 'flex-end', padding: 16 },
  badge: { alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 6, borderRadius: BorderRadius.sm },
  badgeText: { color: '#fff', fontWeight: '600', fontSize: 12 },
  content: { padding: 20 },
  courseTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  priceContainer: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 },
  price: { fontSize: 28, fontWeight: 'bold', color: Colors.primary },
  originalPrice: { fontSize: 18, color: Colors.textMuted, textDecorationLine: 'line-through' },
  description: { fontSize: 15, lineHeight: 24, marginBottom: 24 },
  section: { paddingVertical: 16, borderBottomWidth: 1 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 16 },
  featureItem: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  featureText: { flex: 1, fontSize: 14 },
  noFeatures: { fontSize: 14 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 20 },
  statItem: { alignItems: 'center' },
  statText: { fontSize: 12, marginTop: 4 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderTopWidth: 1 },
  footerPrice: {},
  footerPriceLabel: { fontSize: 12 },
  footerPriceAmount: { fontSize: 24, fontWeight: 'bold' },
  enrollButton: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 14, paddingHorizontal: 24, borderRadius: BorderRadius.lg },
  enrollButtonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
});