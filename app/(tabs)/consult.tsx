import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Colors, Shadows, BorderRadius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { EXPERTS, TIME_SLOTS } from '@/constants/data';

const { width } = Dimensions.get('window');

export default function ConsultScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = isDark ? Colors.dark : Colors.light;
  const params = useLocalSearchParams();
  const expertId = params.expertId as string;
  
  const [selectedExpert, setSelectedExpert] = useState<string | null>(expertId || null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [consultationType, setConsultationType] = useState<string>('video');

  const activeExpert = EXPERTS.find(e => e.id === selectedExpert);

  const getNextDays = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      days.push(date);
    }
    return days;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' });
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Book a Consultation
        </Text>
        <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
          Connect with our experienced psychologists for personalized guidance
        </Text>
      </View>

      <View style={styles.consultationTypes}>
        {[
          { id: 'video', icon: 'videocam', label: 'Video Call', price: '₹500' },
          { id: 'voice', icon: 'call', label: 'Voice Call', price: '₹300' },
          { id: 'chat', icon: 'chatbubbles', label: 'Chat', price: '₹200' },
          { id: 'inperson', icon: 'person', label: 'In-Person', price: '₹800' },
        ].map((type) => (
          <TouchableOpacity
            key={type.id}
            style={[
              styles.typeCard,
              consultationType === type.id && [styles.typeCardActive, { borderColor: colors.primary }],
              { backgroundColor: colors.card }
            ]}
            onPress={() => setConsultationType(type.id)}
          >
            <Ionicons
              name={type.icon as any}
              size={24}
              color={consultationType === type.id ? colors.primary : colors.textSecondary}
            />
            <Text style={[
              styles.typeLabel,
              { color: colors.text },
              consultationType === type.id && { color: colors.primary }
            ]}>
              {type.label}
            </Text>
            <Text style={[styles.typePrice, { color: colors.textMuted }]}>{type.price}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Our Experts
        </Text>

        {EXPERTS.map((expert, index) => (
          <Animated.View
            key={expert.id}
            entering={FadeInDown.delay(index * 100)}
          >
            <TouchableOpacity
              style={[
                styles.expertCard,
                selectedExpert === expert.id && { borderColor: colors.primary, borderWidth: 2 },
                { backgroundColor: colors.card }
              ]}
              onPress={() => setSelectedExpert(expert.id)}
            >
              <Image source={{ uri: expert.image }} style={styles.expertImage} />
              <View style={styles.expertContent}>
                <View style={styles.expertHeader}>
                  <View>
                    <Text style={[styles.expertName, { color: colors.text }]}>
                      {expert.name}
                    </Text>
                    <Text style={[styles.expertTitle, { color: colors.textSecondary }]}>{expert.title}</Text>
                  </View>
                  {expert.available && (
                    <View style={styles.availableBadge}>
                      <View style={styles.availableDot} />
                      <Text style={styles.availableText}>Available</Text>
                    </View>
                  )}
                </View>
                <View style={styles.expertMeta}>
                  <View style={styles.ratingContainer}>
                    <Ionicons name="star" size={14} color="#F59E0B" />
                    <Text style={[styles.ratingText, { color: colors.text }]}>{expert.rating}</Text>
                    <Text style={[styles.reviewsText, { color: colors.textMuted }]}>({expert.reviews} reviews)</Text>
                  </View>
                  <Text style={[styles.experienceText, { color: colors.textSecondary }]}>{expert.experience}</Text>
                </View>
                <View style={styles.specializations}>
                  {expert.specialization.slice(0, 3).map((spec, i) => (
                    <View key={i} style={[styles.specTag, { backgroundColor: colors.primary + '15' }]}>
                      <Text style={[styles.specTagText, { color: colors.primary }]}>{spec}</Text>
                    </View>
                  ))}
                </View>
              </View>
              {selectedExpert === expert.id && (
                <View style={styles.selectedIndicator}>
                  <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
                </View>
              )}
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>

      {selectedExpert && (
        <Animated.View entering={FadeInDown}>
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Select Date & Time
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.datesScroll}>
              {getNextDays().map((date, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dateCard,
                    selectedDate?.toDateString() === date.toDateString() && { backgroundColor: colors.primary },
                    { backgroundColor: colors.card }
                  ]}
                  onPress={() => setSelectedDate(date)}
                >
                  <Text style={[
                    styles.dateDay,
                    { color: colors.textSecondary }
                  ]}>
                    {date.toLocaleDateString('en-US', { weekday: 'short' })}
                  </Text>
                  <Text style={[
                    styles.dateNumber,
                    { color: colors.text },
                    selectedDate?.toDateString() === date.toDateString() && { color: '#fff' }
                  ]}>
                    {date.getDate()}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {selectedDate && (
              <View style={styles.timesContainer}>
                <Text style={[styles.timesLabel, { color: colors.textSecondary }]}>Available Slots</Text>
                <View style={styles.timesGrid}>
                  {TIME_SLOTS.map((time, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.timeSlot,
                        selectedTime === time && { backgroundColor: colors.primary },
                        { backgroundColor: colors.card }
                      ]}
                      onPress={() => setSelectedTime(time)}
                    >
                      <Text style={[
                        styles.timeSlotText,
                        { color: colors.text },
                        selectedTime === time && { color: '#fff' }
                      ]}>
                        {time}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
          </View>
        </Animated.View>
      )}

      {selectedExpert && selectedDate && selectedTime && (
        <View style={styles.bookingSummary}>
          <View style={[styles.summaryCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.summaryTitle, { color: colors.text }]}>
              Booking Summary
            </Text>
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Expert</Text>
              <Text style={[styles.summaryValue, { color: colors.text }]}>
                {activeExpert?.name}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Date & Time</Text>
              <Text style={[styles.summaryValue, { color: colors.text }]}>
                {formatDate(selectedDate)} at {selectedTime}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Type</Text>
              <Text style={[styles.summaryValue, { color: colors.text }]}>
                {consultationType === 'video' ? 'Video Call' : consultationType === 'voice' ? 'Voice Call' : consultationType === 'chat' ? 'Chat' : 'In-Person'}
              </Text>
            </View>
            <View style={[styles.summaryDivider, { backgroundColor: colors.border }]} />
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Consultation Fee</Text>
              <Text style={[styles.summaryPrice, { color: colors.primary }]}>₹{consultationType === 'video' ? '500' : consultationType === 'voice' ? '300' : consultationType === 'chat' ? '200' : '800'}</Text>
            </View>
          </View>

          <TouchableOpacity style={[styles.confirmButton, { backgroundColor: colors.primary }]}>
            <Text style={styles.confirmButtonText}>Confirm Booking</Text>
            <Ionicons name="arrow-forward" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.bottomPadding} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    lineHeight: 22,
  },
  consultationTypes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 10,
    marginBottom: 10,
  },
  typeCard: {
    width: (width - 42) / 2,
    padding: 14,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    ...Shadows.small,
  },
  typeCardActive: {
    borderWidth: 2,
  },
  typeLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 8,
  },
  typePrice: {
    fontSize: 11,
    marginTop: 4,
  },
  section: {
    paddingHorizontal: 16,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 14,
  },
  expertCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: BorderRadius.lg,
    marginBottom: 12,
    ...Shadows.small,
  },
  expertImage: {
    width: 70,
    height: 70,
    borderRadius: BorderRadius.md,
  },
  expertContent: {
    flex: 1,
    marginLeft: 14,
  },
  expertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  expertName: {
    fontSize: 16,
    fontWeight: '700',
  },
  expertTitle: {
    fontSize: 12,
  },
  availableBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  availableDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.success,
  },
  availableText: {
    fontSize: 11,
    color: Colors.success,
    fontWeight: '600',
  },
  expertMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: '600',
  },
  reviewsText: {
    fontSize: 11,
  },
  experienceText: {
    fontSize: 12,
  },
  specializations: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  specTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  specTagText: {
    fontSize: 10,
    fontWeight: '500',
  },
  selectedIndicator: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  datesScroll: {
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  dateCard: {
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: BorderRadius.lg,
    marginRight: 10,
    minWidth: 60,
    ...Shadows.small,
  },
  dateDay: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  dateNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 4,
  },
  timesContainer: {
    marginTop: 16,
  },
  timesLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
  },
  timesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  timeSlot: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: BorderRadius.md,
    ...Shadows.small,
  },
  timeSlotText: {
    fontSize: 13,
    fontWeight: '600',
  },
  bookingSummary: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  summaryCard: {
    padding: 20,
    borderRadius: BorderRadius.lg,
    ...Shadows.medium,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 13,
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: '600',
  },
  summaryDivider: {
    height: 1,
    marginVertical: 12,
  },
  summaryPrice: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  confirmButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: BorderRadius.lg,
    marginTop: 16,
    ...Shadows.medium,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  bottomPadding: {
    height: 40,
  },
});
