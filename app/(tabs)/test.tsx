import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Colors, Shadows, BorderRadius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useLanguage } from '@/context/LanguageContext';
import { api, TestSummary, MentalHealthTest, UserTestAnswer } from '@/utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

function TestListScreen({ onSelectTest }: { onSelectTest: (testType: string) => void }) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = isDark ? Colors.dark : Colors.light;
  const { t } = useLanguage();
  const [tests, setTests] = useState<TestSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    try {
      setLoading(true);
      const data = await api.tests.getAll();
      setTests(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading tests...</Text>
      </View>
    );
  }

  const testIcons: Record<string, string> = {
    anxiety: 'alert-circle',
    depression: 'sad',
    stress: 'flash',
    wellness: 'heart',
  };

  const testColors: Record<string, string> = {
    anxiety: '#EF4444',
    depression: '#8B5CF6',
    stress: '#F59E0B',
    wellness: '#10B981',
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{t('test.title')}</Text>
        <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>{t('test.subtitle')}</Text>
      </View>

      {error && (
        <View style={[styles.errorContainer, { backgroundColor: Colors.error + '15' }]}>
          <Text style={[styles.errorText, { color: Colors.error }]}>{error}</Text>
          <TouchableOpacity onPress={fetchTests}>
            <Text style={[styles.retryText, { color: colors.primary }]}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.testsList}>
        {tests.map((test, index) => (
          <Animated.View key={test.testType} entering={FadeInDown.delay(index * 100)}>
            <TouchableOpacity
              style={[styles.testCard, { backgroundColor: colors.card }]}
              onPress={() => onSelectTest(test.testType)}
            >
              <View style={[styles.testIconContainer, { backgroundColor: (testColors[test.testType] || Colors.primary) + '20' }]}>
                <Ionicons name={(testIcons[test.testType] || 'help-circle') as any} size={32} color={testColors[test.testType] || Colors.primary} />
              </View>
              <View style={styles.testInfo}>
                <Text style={[styles.testTitle, { color: colors.text }]}>{test.title}</Text>
                <Text style={[styles.testDescription, { color: colors.textSecondary }]} numberOfLines={2}>{test.description}</Text>
                <View style={styles.testMeta}>
                  <View style={styles.testMetaItem}>
                    <Ionicons name="help-circle-outline" size={14} color={colors.textSecondary} />
                    <Text style={[styles.testMetaText, { color: colors.textSecondary }]}>{test.questionCount} {t('test.questions')}</Text>
                  </View>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={24} color={colors.textMuted} />
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>

      <View style={[styles.disclaimer, { backgroundColor: Colors.warning + '15' }]}>
        <Ionicons name="information-circle-outline" size={20} color={colors.textSecondary} />
        <Text style={[styles.disclaimerText, { color: colors.textSecondary }]}>{t('test.disclaimer')}</Text>
      </View>
    </ScrollView>
  );
}

function TestQuestionsScreen({ testType, onBack, testData }: { testType: string; onBack: () => void; testData: MentalHealthTest }) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = isDark ? Colors.dark : Colors.light;
  const { t } = useLanguage();
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [testCompleted, setTestCompleted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);

  const questions = testData.questions || [];
  const selectedAnswer = answers[currentQuestion];
  const hasSelected = selectedAnswer !== undefined && selectedAnswer !== null;

  const selectAnswer = (value: number) => {
    console.log('[Test] Select answer:', value, 'for question:', currentQuestion);
    setAnswers(prev => ({ ...prev, [currentQuestion]: value }));
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      submitTest();
    }
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

const submitTest = async () => {
    try {
      setSubmitting(true);
      const answerList: UserTestAnswer[] = Object.entries(answers).map(([qId, value]) => ({
        questionId: parseInt(qId),
        selectedValue: value,
      }));

      const saveResult = async () => {
        try {
          await api.tests.submitResult({
            testType,
            userId: await AsyncStorage.getItem('server_user_id'),
            answers: answerList,
          });
          console.log('[Test] Result saved to server');
        } catch (err: any) {
          console.log('[Test] Could not save to server, result shown locally only');
        }
      };
      
      const totalScore = Object.values(answers).reduce((sum: number, val: any) => sum + val, 0);
      const maxScore = testData.maxScore;
      const percentage = Math.round((totalScore / maxScore) * 100);
      
      const scoreRanges = testData.scoreRanges || [];
      const resultData = scoreRanges.find((r: any) => 
        percentage >= r.minScore && percentage <= r.maxScore
      );
      
      const calculatedResult = {
        testType,
        score: totalScore,
        totalScore: maxScore,
        percentage,
        level: resultData?.level || 'Unknown',
        description: resultData?.description || 'Unable to determine result',
        recommendation: resultData?.recommendation,
};

      console.log('[Test] Calculated result:', calculatedResult);
      
      saveResult();
      setResult(calculatedResult);
      setTestCompleted(true);
    } catch (err: any) {
      console.log('[Test] Submit error:', err);
      setTestCompleted(true);
    } finally {
      setSubmitting(false);
    }
  };

  const resetTest = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setTestCompleted(false);
    setResult(null);
  };

  const getScore = () => {
    const total = Object.values(answers).reduce((sum: number, val: any) => sum + val, 0);
    return Math.round((total / testData.maxScore) * 100);
  };

  if (testCompleted && result) {
    const score = getScore();
    return (
      <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.resultContainer}>
        <Animated.View entering={FadeInUp} style={[styles.resultCard, { backgroundColor: colors.card }]}>
          <View style={[styles.resultIconContainer, { backgroundColor: Colors.primary + '20' }]}>
            <Ionicons name="checkmark-circle" size={64} color={Colors.primary} />
          </View>
          <Text style={[styles.resultTitle, { color: colors.text }]}>{t('test.assessmentComplete')}</Text>
          <Text style={[styles.resultSubtitle, { color: colors.textSecondary }]}>{testData.title}</Text>
          
          <View style={styles.scoreContainer}>
            <View style={[styles.scoreCircle, { borderColor: colors.border }]}>
              <Text style={[styles.scoreValue, { color: Colors.primary }]}>{score}%</Text>
              <Text style={[styles.scoreLabel, { color: colors.textSecondary }]}>{t('test.score')}</Text>
            </View>
          </View>

          <View style={[styles.levelBadge, { backgroundColor: Colors.primary + '20' }]}>
            <Text style={[styles.levelText, { color: Colors.primary }]}>{result.level}</Text>
          </View>

          <Text style={[styles.resultMessage, { color: colors.textSecondary }]}>{result.description}</Text>

          <View style={styles.resultActions}>
            <TouchableOpacity style={[styles.retryButton, { borderColor: Colors.primary }]} onPress={resetTest}>
              <Ionicons name="refresh" size={20} color={Colors.primary} />
              <Text style={[styles.retryButtonText, { color: Colors.primary }]}>{t('test.takeAnotherTest')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.consultButton, { backgroundColor: Colors.primary }]} onPress={() => router.push('/(tabs)/consult')}>
              <Text style={styles.consultButtonText}>{t('test.bookConsultation')}</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    );
  }

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.progressContainer}>
        <View style={styles.progressHeader}>
          <TouchableOpacity onPress={onBack}>
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.progressText, { color: colors.textSecondary }]}>{currentQuestion + 1} of {questions.length}</Text>
        </View>
        <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
          <View style={[styles.progressFill, { width: `${progress}%`, backgroundColor: Colors.primary }]} />
        </View>
      </View>

      <View style={styles.questionContainer}>
        <Animated.View key={currentQuestion} entering={FadeInUp}>
          <Text style={[styles.questionText, { color: colors.text }]}>{question?.question}</Text>
        </Animated.View>

        <View style={styles.optionsContainer}>
          {question?.options.map((option, index) => {
            const isSelected = selectedAnswer === option.value;
            return (
              <Animated.View key={index} entering={FadeInDown.delay(index * 50)}>
                <TouchableOpacity
                  style={[styles.optionButton, isSelected && { backgroundColor: Colors.primary + '20', borderColor: Colors.primary }, { backgroundColor: colors.card, borderColor: colors.border }]}
                  onPress={() => selectAnswer(option.value)}
                >
                  <View style={[styles.optionCircle, isSelected && { backgroundColor: Colors.primary }]}>
                    {isSelected && <Ionicons name="checkmark" size={14} color="#fff" />}
                  </View>
                  <Text style={[styles.optionText, { color: colors.text }, isSelected && { color: Colors.primary, fontWeight: '600' }]}>{option.text}</Text>
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>
      </View>

      <View style={styles.navigationButtons}>
        <TouchableOpacity style={[styles.navButton, currentQuestion === 0 && styles.navButtonDisabled]} onPress={previousQuestion} disabled={currentQuestion === 0}>
          <Ionicons name="arrow-back" size={20} color={currentQuestion === 0 ? colors.textMuted : Colors.primary} />
          <Text style={[styles.navButtonText, { color: currentQuestion === 0 ? colors.textMuted : Colors.primary }]}>{t('common.previous')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.navButton, styles.navButtonPrimary, { backgroundColor: hasSelected ? Colors.primary : colors.textMuted }]} onPress={nextQuestion} disabled={!hasSelected || submitting}>
          <Text style={styles.navButtonTextPrimary}>{submitting ? '...' : currentQuestion === questions.length - 1 ? t('common.finish') : t('common.next')}</Text>
          <Ionicons name="arrow-forward" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function TestScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = isDark ? Colors.dark : Colors.light;
  const { t } = useLanguage();
  const params = useLocalSearchParams();
  const testId = params.testId as string;
  
  const [selectedTestType, setSelectedTestType] = useState<string | null>(testId || null);
  const [testData, setTestData] = useState<MentalHealthTest | null>(null);
  const [loading, setLoading] = useState(false);

  const startTest = async (testType: string) => {
    try {
      setLoading(true);
      const data = await api.tests.getByType(testType);
      setTestData(data);
      setSelectedTestType(testType);
    } catch (err: any) {
      console.log('[Test] Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    setSelectedTestType(null);
    setTestData(null);
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: Colors.background.light }]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (selectedTestType && testData) {
    return <TestQuestionsScreen testType={selectedTestType} onBack={goBack} testData={testData} />;
  }

  return <TestListScreen onSelectTest={startTest} />;
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 12, fontSize: 14 },
  header: { padding: 20, paddingTop: 10 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  headerSubtitle: { fontSize: 14, lineHeight: 22 },
  errorContainer: { margin: 16, padding: 14, borderRadius: BorderRadius.md, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  errorText: { fontSize: 13, flex: 1, color: Colors.error },
  retryText: { fontSize: 13, fontWeight: '600', marginLeft: 10, color: Colors.primary },
  testsList: { paddingHorizontal: 16, gap: 12 },
  testCard: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: BorderRadius.lg, marginBottom: 12, ...Shadows.small },
  testIconContainer: { width: 60, height: 60, borderRadius: BorderRadius.md, justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  testInfo: { flex: 1 },
  testTitle: { fontSize: 16, fontWeight: '700', marginBottom: 4 },
  testDescription: { fontSize: 12, lineHeight: 18, marginBottom: 8 },
  testMeta: { flexDirection: 'row', gap: 12 },
  testMetaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  testMetaText: { fontSize: 11 },
  disclaimer: { flexDirection: 'row', margin: 16, padding: 14, borderRadius: BorderRadius.md, gap: 10 },
  disclaimerText: { flex: 1, fontSize: 11, lineHeight: 18 },
  progressContainer: { padding: 16, paddingTop: 10 },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  progressText: { fontSize: 14, fontWeight: '600' },
  progressBar: { height: 6, borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 3 },
  questionContainer: { flex: 1, paddingHorizontal: 20, paddingTop: 30 },
  questionText: { fontSize: 20, fontWeight: '600', lineHeight: 30, marginBottom: 30 },
  optionsContainer: { gap: 12 },
  optionButton: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: BorderRadius.lg, borderWidth: 2, gap: 14, ...Shadows.small },
  optionCircle: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, justifyContent: 'center', alignItems: 'center' },
  optionText: { fontSize: 15, flex: 1 },
  navigationButtons: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, gap: 12 },
  navButton: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 20, borderRadius: BorderRadius.lg, gap: 8 },
  navButtonDisabled: { opacity: 0.5 },
  navButtonPrimary: { flex: 1, justifyContent: 'center' },
  navButtonText: { fontSize: 15, fontWeight: '600' },
  navButtonTextPrimary: { fontSize: 15, fontWeight: '600', color: '#fff' },
  resultContainer: { flexGrow: 1, justifyContent: 'center', padding: 20 },
  resultCard: { borderRadius: BorderRadius.xl, padding: 30, alignItems: 'center', ...Shadows.large },
  resultIconContainer: { width: 100, height: 100, borderRadius: 50, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  resultTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 4 },
  resultSubtitle: { fontSize: 14, marginBottom: 24 },
  scoreContainer: { marginBottom: 20 },
  scoreCircle: { width: 120, height: 120, borderRadius: 60, borderWidth: 8, justifyContent: 'center', alignItems: 'center' },
  scoreValue: { fontSize: 36, fontWeight: 'bold' },
  scoreLabel: { fontSize: 12 },
  levelBadge: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: BorderRadius.full, marginBottom: 20 },
  levelText: { fontSize: 16, fontWeight: '700' },
  resultMessage: { fontSize: 14, textAlign: 'center', lineHeight: 22, marginBottom: 30 },
  resultActions: { width: '100%', gap: 12 },
  retryButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, borderRadius: BorderRadius.lg, borderWidth: 2, gap: 8 },
  retryButtonText: { fontSize: 15, fontWeight: '600' },
  consultButton: { paddingVertical: 14, borderRadius: BorderRadius.lg, alignItems: 'center' },
  consultButtonText: { fontSize: 15, fontWeight: '600', color: '#fff' },
});