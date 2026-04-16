import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, Layout } from 'react-native-reanimated';
import { Colors, Shadows, BorderRadius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { COURSES, COURSE_CATEGORIES } from '@/constants/data';

export default function CoursesScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = isDark ? Colors.dark : Colors.light;
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCourses = COURSES.filter(course => {
    const matchesCategory = !selectedCategory || course.category === selectedCategory;
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
    >
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

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesScroll}
        contentContainerStyle={styles.categoriesContent}
      >
        <TouchableOpacity
          style={[
            styles.categoryChip,
            !selectedCategory && styles.categoryChipActive,
            { backgroundColor: colors.card }
          ]}
          onPress={() => setSelectedCategory(null)}
        >
          <Text style={[
            styles.categoryChipText,
            !selectedCategory && styles.categoryChipTextActive
          ]}>
            All
          </Text>
        </TouchableOpacity>
        {COURSE_CATEGORIES.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryChip,
              selectedCategory === category.id && [styles.categoryChipActive, { backgroundColor: category.color }],
              { backgroundColor: colors.card }
            ]}
            onPress={() => setSelectedCategory(category.id)}
          >
            <Ionicons
              name={category.icon as any}
              size={16}
              color={selectedCategory === category.id ? '#fff' : category.color}
            />
            <Text style={[
              styles.categoryChipText,
              selectedCategory === category.id && styles.categoryChipTextActive
            ]}>
              {category.title}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.coursesList}>
        <Text style={[styles.resultsCount, { color: colors.textSecondary }]}>
          {filteredCourses.length} {filteredCourses.length === 1 ? 'program' : 'programs'} found
        </Text>
        
        {filteredCourses.map((course, index) => (
          <Animated.View
            key={course.id}
            entering={FadeInDown.delay(index * 100)}
            layout={Layout.springify()}
          >
            <TouchableOpacity
              style={[styles.courseCard, { backgroundColor: colors.card }]}
            >
              <Image source={{ uri: course.image }} style={styles.courseImage} />
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.7)']}
                style={styles.courseImageOverlay}
              >
                <View style={[styles.levelBadge, { backgroundColor: colors.primary }]}>
                  <Text style={styles.levelBadgeText}>{course.level}</Text>
                </View>
              </LinearGradient>
              <View style={styles.courseContent}>
                <View style={styles.courseHeader}>
                  <View style={styles.courseInfo}>
                    <Text style={[styles.courseTitle, { color: colors.text }]}>
                      {course.title}
                    </Text>
                    <View style={styles.courseMeta}>
                      <View style={styles.metaItem}>
                        <Ionicons name="time-outline" size={14} color={colors.textSecondary} />
                        <Text style={[styles.metaText, { color: colors.textSecondary }]}>{course.duration}</Text>
                      </View>
                      <View style={styles.metaItem}>
                        <Ionicons name="layers-outline" size={14} color={colors.textSecondary} />
                        <Text style={[styles.metaText, { color: colors.textSecondary }]}>{course.sessions} sessions</Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.priceContainer}>
                    <Text style={[styles.priceLabel, { color: colors.textMuted }]}>Starting at</Text>
                    <Text style={[styles.price, { color: colors.primary }]}>₹{course.price}</Text>
                  </View>
                </View>
                <Text style={[styles.courseDescription, { color: colors.textSecondary }]} numberOfLines={2}>
                  {course.description}
                </Text>
                <View style={styles.courseFooter}>
                  <View style={styles.featuresPreview}>
                    {course.features.slice(0, 2).map((feature, i) => (
                      <View key={i} style={styles.featureTag}>
                        <Ionicons name="checkmark-circle" size={12} color={Colors.success} />
                        <Text style={[styles.featureTagText, { color: colors.textSecondary }]}>{feature}</Text>
                      </View>
                    ))}
                  </View>
                  <TouchableOpacity style={styles.learnMoreButton}>
                    <Text style={[styles.learnMoreText, { color: colors.primary }]}>Learn More</Text>
                    <Ionicons name="arrow-forward" size={16} color={colors.primary} />
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
  container: {
    flex: 1,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: BorderRadius.lg,
    gap: 10,
    ...Shadows.small,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
  },
  categoriesScroll: {
    maxHeight: 50,
  },
  categoriesContent: {
    paddingHorizontal: 16,
    gap: 10,
    flexDirection: 'row',
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
    gap: 6,
    ...Shadows.small,
  },
  categoryChipActive: {
    backgroundColor: Colors.primary,
  },
  categoryChipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  categoryChipTextActive: {
    color: '#fff',
  },
  coursesList: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  resultsCount: {
    fontSize: 13,
    marginBottom: 16,
  },
  courseCard: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    marginBottom: 16,
    ...Shadows.medium,
  },
  courseImage: {
    width: '100%',
    height: 180,
  },
  courseImageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 180,
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    padding: 12,
  },
  levelBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  levelBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
  courseContent: {
    padding: 16,
  },
  courseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  courseInfo: {
    flex: 1,
    marginRight: 12,
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },
  courseMeta: {
    flexDirection: 'row',
    gap: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  priceLabel: {
    fontSize: 11,
  },
  price: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  courseDescription: {
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 14,
  },
  courseFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  featuresPreview: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    flex: 1,
  },
  featureTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  featureTagText: {
    fontSize: 11,
  },
  learnMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  learnMoreText: {
    fontSize: 14,
    fontWeight: '600',
  },
  bottomPadding: {
    height: 30,
  },
});
