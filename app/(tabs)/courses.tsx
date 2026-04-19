import { BorderRadius, Colors, Shadows } from '@/constants/theme';
import { useLanguage } from '@/context/LanguageContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { api, Course } from '@/utils/api';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, { FadeInDown, Layout } from 'react-native-reanimated';

export default function CoursesScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = isDark ? Colors.dark : Colors.light;
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const data = await api.courses.getAll();
      setCourses(data || []);
      console.log('courses----==', courses)
    } catch (err: any) {
      console.log('[Courses] Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getCourseId = (course: any) => {
    if (!course) return '';
    if (typeof course._id === 'string') return course._id;
    if (course._id && course._id.$oid) return course._id.$oid;
    if (typeof course.id === 'string') return course.id;
    return '';
  };

  const filteredCourses = courses.filter((course: any) =>
    course.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading courses...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} showsVerticalScrollIndicator={false}>
      <View style={styles.searchContainer}>
        <View style={[styles.searchBar, { backgroundColor: colors.card }]}>
          <Ionicons name="search" size={20} color={colors.textMuted} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search programs..."
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {error && (
        <View style={[styles.errorContainer, { backgroundColor: Colors.error + '15' }]}>
          <Text style={[styles.errorText, { color: Colors.error }]}>{error}</Text>
          <TouchableOpacity onPress={fetchCourses}>
            <Text style={[styles.retryText, { color: colors.primary }]}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.coursesList}>
        <Text style={[styles.resultsCount, { color: colors.textSecondary }]}>
          {filteredCourses.length} programs found
        </Text>
        
        {filteredCourses.map((course: any, index: number) => (
          <Animated.View
            key={getCourseId(course) || index}
            entering={FadeInDown.delay(index * 100)}
            layout={Layout.springify()}
          >
            <TouchableOpacity 
              style={[styles.courseCard, { backgroundColor: colors.card }]}
              onPress={() => router.push(`/courses/${getCourseId(course)}`)}
            >
              <Image 
                source={{ uri: course.thumbnailURL || 'https://via.placeholder.com/300x150' }} 
                style={styles.courseImage} 
              />
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.7)']}
                style={styles.courseImageOverlay}
              >
                <View style={[styles.levelBadge, { backgroundColor: colors.primary }]}>
                  <Text style={styles.levelBadgeText}>{(course.isPaid || course.price > 0) ? 'Premium' : 'Free'}</Text>
                </View>
              </LinearGradient>
              <View style={styles.courseContent}>
                <Text style={[styles.courseTitle, { color: colors.text }]}>{course.title}</Text>
                <Text style={[styles.courseDescription, { color: colors.textSecondary }]} numberOfLines={2}>
                  {course.description}
                </Text>
                <View style={styles.courseFooter}>
                  <Text style={styles.coursePrice}>₹{course.price}</Text>
                  <TouchableOpacity style={[styles.enrollButton, { backgroundColor: colors.primary }]}>
                    <Text style={styles.enrollButtonText}>Enroll</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>

      <View style={styles.bottomPadding} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 12, fontSize: 14 },
  searchContainer: { paddingHorizontal: 16, paddingTop: 10, paddingBottom: 16 },
  searchBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 12, borderRadius: BorderRadius.lg, gap: 10, ...Shadows.small },
  searchInput: { flex: 1, fontSize: 15 },
  errorContainer: { marginHorizontal: 16, padding: 14, borderRadius: BorderRadius.md, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  errorText: { fontSize: 13, flex: 1 },
  retryText: { fontSize: 13, fontWeight: '600', marginLeft: 10 },
  coursesList: { paddingHorizontal: 16 },
  resultsCount: { fontSize: 13, marginBottom: 16 },
  courseCard: { borderRadius: BorderRadius.lg, overflow: 'hidden', marginBottom: 16, ...Shadows.medium },
  courseImage: { width: '100%', height: 180, resizeMode: 'cover' },
  courseImageOverlay: { position: 'absolute', top: 0, left: 0, right: 0, height: 60, justifyContent: 'flex-start', padding: 10 },
  levelBadge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: BorderRadius.sm },
  levelBadgeText: { fontSize: 11, fontWeight: '600', color: '#fff' },
  courseContent: { padding: 14 },
  courseTitle: { fontSize: 18, fontWeight: '700', marginBottom: 6 },
  courseDescription: { fontSize: 13, lineHeight: 20, marginBottom: 12 },
  courseFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  coursePrice: { fontSize: 20, fontWeight: 'bold', color: Colors.primary },
  enrollButton: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: BorderRadius.md },
  enrollButtonText: { color: '#fff', fontWeight: '600', fontSize: 14 },
  bottomPadding: { height: 40 },
});