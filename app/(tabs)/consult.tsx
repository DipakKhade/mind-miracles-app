import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Colors, Shadows, BorderRadius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useLanguage } from '@/context/LanguageContext';
import { EXPERTS } from '@/constants/data';
import Animated, { FadeInDown } from 'react-native-reanimated';

const PHONE_NUMBER = '+917020053425';

export default function ConsultScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = isDark ? Colors.dark : Colors.light;
  const { t } = useLanguage();

  const handleBookSession = () => {
    Alert.alert(
      t('consult.bookSession'),
      'Call +91 70200 53425 for booking a consultation?',
      [
        { text: t('common.cancel'), style: 'cancel' },
        { 
          text: 'Call Now', 
          onPress: () => Link.open(`tel:${PHONE_NUMBER}`)
        },
      ]
    );
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{t('consult.title')}</Text>
        <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>{t('consult.subtitle')}</Text>
      </View>

      <Animated.View entering={FadeInDown.delay(100)}>
        <TouchableOpacity style={[styles.bookButton, { backgroundColor: colors.primary }]} onPress={handleBookSession}>
          <Ionicons name="call" size={24} color="#fff" />
          <Text style={styles.bookButtonText}>{t('consult.bookSession')}</Text>
          <Text style={styles.bookButtonSubtext}>+91 70200 53425</Text>
        </TouchableOpacity>
      </Animated.View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('home.ourExperts')}</Text>
        <View style={[styles.expertCard, { backgroundColor: colors.card }]}>
          <LinearGradient
            colors={[Colors.primary + '30', 'transparent']}
            style={styles.expertGradient}
          >
            <View style={styles.expertInfo}>
              <Text style={[styles.expertName, { color: colors.text }]}>{EXPERTS[0].name}</Text>
              <Text style={styles.expertTitle}>{EXPERTS[0].title}</Text>
              <View style={styles.expertMeta}>
                <View style={styles.expertRating}>
                  <Ionicons name="star" size={14} color="#F59E0B" />
                  <Text style={[styles.expertRatingText, { color: colors.text }]}>{EXPERTS[0].rating}</Text>
                </View>
                <Text style={[styles.expertReviews, { color: colors.textSecondary }]}>{EXPERTS[0].reviews} reviews</Text>
              </View>
            </View>
            <TouchableOpacity style={[styles.callButton, { backgroundColor: colors.primary }]} onPress={handleBookSession}>
              <Ionicons name="call" size={20} color="#fff" />
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Why Choose Us?</Text>
        <View style={styles.featuresGrid}>
          {[
            { icon: 'shield-checkmark', title: 'Certified Experts', color: Colors.primary },
            { icon: 'time', title: 'Flexible Sessions', color: Colors.secondary },
            { icon: 'heart', title: 'Personalized Care', color: Colors.accent },
            { icon: 'lock-closed', title: 'Confidential', color: Colors.warning },
          ].map((feature, index) => (
            <View key={index} style={[styles.featureCard, { backgroundColor: colors.card }]}>
              <View style={[styles.featureIcon, { backgroundColor: feature.color + '20' }]}>
                <Ionicons name={feature.icon as any} size={24} color={feature.color} />
              </View>
              <Text style={[styles.featureTitle, { color: colors.text }]}>{feature.title}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.bottomPadding} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 20, paddingTop: 10 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  headerSubtitle: { fontSize: 14, lineHeight: 22 },
  bookButton: { marginHorizontal: 20, padding: 20, borderRadius: BorderRadius.xl, alignItems: 'center', ...Shadows.medium },
  bookButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginTop: 10 },
  bookButtonSubtext: { color: 'rgba(255,255,255,0.8)', fontSize: 14, marginTop: 4 },
  section: { padding: 20, paddingTop: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 14 },
  expertCard: { borderRadius: BorderRadius.lg, overflow: 'hidden', ...Shadows.small },
  expertGradient: { flexDirection: 'row', padding: 16, alignItems: 'center' },
  expertInfo: { flex: 1 },
  expertName: { fontSize: 18, fontWeight: '700', marginBottom: 2 },
  expertTitle: { fontSize: 13, color: '#64748B', marginBottom: 8 },
  expertMeta: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  expertRating: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  expertRatingText: { fontSize: 13, fontWeight: '600' },
  expertReviews: { fontSize: 13 },
  callButton: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center' },
  featuresGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  featureCard: { width: '47%', padding: 16, borderRadius: BorderRadius.lg, alignItems: 'center', ...Shadows.small },
  featureIcon: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  featureTitle: { fontSize: 13, fontWeight: '600', textAlign: 'center' },
  bottomPadding: { height: 40 },
});