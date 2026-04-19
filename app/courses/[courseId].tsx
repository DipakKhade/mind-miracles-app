import { BorderRadius, Colors } from '@/constants/theme';
import { useLanguage } from '@/context/LanguageContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { api, CourseWithFeatures, RazorpayOrder } from '@/utils/api';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRazorpay } from '@codearcade/expo-razorpay';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

function CourseEnrollButton({
  courseData,
  courseId,
  onEnrolled,
}: {
  courseData: any;
  courseId: string;
  onEnrolled: () => void;
}) {
  const { openCheckout, RazorpayUI } = useRazorpay();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = isDark ? Colors.dark : Colors.light;
  const [enrolling, setEnrolling] = useState(false);

  const handleEnroll = async () => {
    if (!courseData) return;

    try {
      setEnrolling(true);
      let userId = await AsyncStorage.getItem('server_user_id');
      console.log('[Course] User ID:', userId);

      if (!userId) {
        const googleUser = await GoogleSignin.getCurrentUser();
        if (googleUser?.user) {
          userId = googleUser.user.id;
        }
      }

      if (!userId) {
        Alert.alert('Sign In Required', 'Please sign in to enroll in courses.');
        router.push('/(tabs)/profile');
        return;
      }

      const isFreeCourse = courseData.price === 0 || courseData.isPaid === false;

      if (isFreeCourse) {
        try {
          await api.enrollments.create(userId, courseId);
          onEnrolled();
          Alert.alert('Success!', 'You have been enrolled in this course.');
        } catch (enrollErr: any) {
          if (enrollErr.message?.includes('already enrolled')) {
            onEnrolled();
            Alert.alert('Success!', 'You are already enrolled.');
            return;
          }
          throw enrollErr;
        }
        return;
      }

      console.log('[Course] Creating payment order for:', courseData.price, userId, courseId);
      
      const order: RazorpayOrder = await api.payments.createOrder(
        courseData.price,
        userId,
        courseId
      );
      
      console.log('[Course] Order response:', order);

      if (!order || !order.order_id) {
        throw new Error('Failed to create payment order');
      }

      const amountInPaise = Math.round(order.amount * 100);

      openCheckout(
        {
          key: order.key_id,
          amount: amountInPaise,
          currency: order.currency || 'INR',
          name: 'Mind Miracles',
          description: `Payment for ${courseData.title}`,
          order_id: order.order_id,
          prefill: {
            contact: '',
            email: '',
          },
          theme: {
            color: Colors.primary,
          },
        },
        {
          onSuccess: async (paymentData) => {
            try {
              const verifyResult = await api.payments.verify(
                paymentData.razorpay_order_id,
                paymentData.razorpay_payment_id,
                paymentData.razorpay_signature
              );

              if (verifyResult && verifyResult.razorpayPaymentId) {
                await api.enrollments.create(userId, courseId);
                onEnrolled();
                Alert.alert('Success!', 'Payment successful. You have been enrolled.');
              } else {
                Alert.alert('Payment Failed', 'Payment verification failed.');
              }
            } catch (verifyErr: any) {
              Alert.alert('Error', verifyErr.message || 'Failed to verify payment');
            }
            setEnrolling(false);
          },
          onFailure: (error: any) => {
            Alert.alert('Payment Failed', error.description || 'Payment was not completed');
            setEnrolling(false);
          },
          onClose: () => {
            setEnrolling(false);
          },
        }
      );
    } catch (err: any) {
      setEnrolling(false);
      Alert.alert('Error', err.message || 'Failed to process enrollment');
    }
  };

  return (
    <>
      <TouchableOpacity
        style={[
          styles.enrollButton,
          { backgroundColor: enrolling ? colors.textMuted : colors.primary },
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
      {RazorpayUI}
    </>
  );
}

export default function CourseDetailScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const courseId = params.courseId as string;

  const [course, setCourse] = useState<CourseWithFeatures | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEnrolled, setIsEnrolled] = useState(false);

  useEffect(() => {
    if (courseId) {
      setIsEnrolled(false);
      setLoading(true);
      fetchCourseDetails().then(() => {
        setTimeout(() => checkEnrollment(), 50);
      });
    }
  }, [courseId]);

  const fetchCourseDetails = async () => {
    try {
      setLoading(true);
      const data = await api.courses.getById(courseId);
      const courseData = data?.course || data;
      setCourse({
        course: courseData,
        features: data?.features || [],
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const checkEnrollment = async () => {
    const userId = await AsyncStorage.getItem('server_user_id');
    if (!userId || !courseId) return;

    try {
      const enrollments = await api.enrollments.getUserEnrollments(userId);
      if (enrollments && enrollments.length > 0) {
        const isEnrolledCourse = enrollments.some((e: any) => {
          const eCourseId = e.courseId || e.course_id;
          return eCourseId === courseId;
        });
        setIsEnrolled(isEnrolledCourse);
      }
    } catch (err: any) {
      console.log('Check enrollments error:', err?.message);
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

  if (error || !course) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: Colors.error }]}>{error || 'Course not found'}</Text>
        <TouchableOpacity style={[styles.retryButton, { backgroundColor: colors.primary }]} onPress={fetchCourseDetails}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const courseData = course?.course;
  const features = course?.features || [];

  if (!courseData) return null;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={{ flex: 1, paddingTop: insets.top }}>
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
          <CourseEnrollButton
            courseData={courseData}
            courseId={courseId}
            onEnrolled={() => setIsEnrolled(true)}
          />
        )}
        </View>
      </View>
    </SafeAreaView>
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