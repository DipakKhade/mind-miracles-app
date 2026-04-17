import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Colors, Shadows, BorderRadius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useLanguage } from '@/context/LanguageContext';
import { MENTAL_HEALTH_TESTS } from '@/constants/data';

export default function TestScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = isDark ? Colors.dark : Colors.light;
  const { t } = useLanguage();
  const params = useLocalSearchParams();
  const testId = params.testId as string;
  
  const [selectedTest, setSelectedTest] = useState<string | null>(testId || null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [testStarted, setTestStarted] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);

  const activeTest = MENTAL_HEALTH_TESTS.find(t => t.id === selectedTest);

  const startTest = (testId: string) => {
    setSelectedTest(testId);
    setCurrentQuestion(0);
    setAnswers({});
    setTestStarted(true);
    setTestCompleted(false);
  };

  const selectAnswer = (questionIndex: number, optionIndex: number) => {
    setAnswers(prev => ({ ...prev, [questionIndex]: optionIndex }));
  };

  const nextQuestion = () => {
    if (!activeTest) return;
    if (currentQuestion < activeTest.testQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setTestCompleted(true);
    }
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const calculateScore = () => {
    if (!activeTest) return 0;
    const total = Object.values(answers).reduce((sum, val) => sum + val, 0);
    const maxPossible = (activeTest.testQuestions.length) * 3;
    return Math.round((total / maxPossible) * 100);
  };

  const getResultMessage = () => {
    const score = calculateScore();
    if (activeTest?.id === 'anxiety') {
      if (score < 5) return { level: t('test.minimal'), color: Colors.success, message: 'Your anxiety levels appear to be minimal. Keep maintaining your mental wellness!' };
      if (score < 10) return { level: t('test.mild'), color: Colors.warning, message: 'You may be experiencing mild anxiety. Consider incorporating relaxation techniques into your routine.' };
      if (score < 15) return { level: t('test.moderate'), color: '#F97316', message: 'Your anxiety levels are moderate. We recommend speaking with a professional for guidance.' };
      return { level: t('test.severe'), color: Colors.error, message: 'Your anxiety levels are significant. Please consider booking a consultation with our experts.' };
    }
    if (activeTest?.id === 'depression') {
      if (score < 5) return { level: t('test.minimal'), color: Colors.success, message: 'Your mood appears stable with minimal depressive symptoms.' };
      if (score < 10) return { level: t('test.mild'), color: Colors.warning, message: 'You may be experiencing some low mood. Self-care activities could help.' };
      if (score < 15) return { level: t('test.moderate'), color: '#F97316', message: 'Your symptoms suggest moderate depression. Professional support is recommended.' };
      return { level: t('test.severe'), color: Colors.error, message: 'Your symptoms indicate significant depression. Please seek professional help immediately.' };
    }
    return { level: 'In Progress', color: Colors.primary, message: 'Complete the test to see your results.' };
  };

  const resetTest = () => {
    setSelectedTest(null);
    setTestStarted(false);
    setTestCompleted(false);
    setCurrentQuestion(0);
    setAnswers({});
  };

  if (!testStarted) {
    return (
      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            {t('test.title')}
          </Text>
          <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
            {t('test.subtitle')}
          </Text>
        </View>

        <View style={styles.testsList}>
          {MENTAL_HEALTH_TESTS.map((test, index) => (
            <Animated.View
              key={test.id}
              entering={FadeInDown.delay(index * 100)}
            >
              <TouchableOpacity
                style={[styles.testCard, { backgroundColor: colors.card }]}
                onPress={() => startTest(test.id)}
              >
                <View style={[styles.testIconContainer, { backgroundColor: test.color + '20' }]}>
                  <MaterialCommunityIcons name={test.icon as any} size={32} color={test.color} />
                </View>
                <View style={styles.testInfo}>
                  <Text style={[styles.testTitle, { color: colors.text }]}>
                    {test.title}
                  </Text>
                  <Text style={[styles.testDescription, { color: colors.textSecondary }]} numberOfLines={2}>
                    {test.description}
                  </Text>
                    <View style={styles.testMeta}>
                      <View style={styles.testMetaItem}>
                        <Ionicons name="help-circle-outline" size={14} color={colors.textSecondary} />
                        <Text style={[styles.testMetaText, { color: colors.textSecondary }]}>{test.questions} {t('test.questions')}</Text>
                      </View>
                      <View style={styles.testMetaItem}>
                        <Ionicons name="time-outline" size={14} color={colors.textSecondary} />
                        <Text style={[styles.testMetaText, { color: colors.textSecondary }]}>{test.duration} {t('test.duration')}</Text>
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
          <Text style={[styles.disclaimerText, { color: colors.textSecondary }]}>
            {t('test.disclaimer')}
          </Text>
        </View>
      </ScrollView>
    );
  }

  if (testCompleted && activeTest) {
    const result = getResultMessage();
    const score = calculateScore();

    return (
      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.resultContainer}
      >
        <Animated.View entering={FadeInUp} style={[styles.resultCard, { backgroundColor: colors.card }]}>
          <View style={[styles.resultIconContainer, { backgroundColor: result.color + '20' }]}>
            <Ionicons name="checkmark-circle" size={64} color={result.color} />
          </View>
          <Text style={[styles.resultTitle, { color: colors.text }]}>{t('test.assessmentComplete')}</Text>
          <Text style={[styles.resultSubtitle, { color: colors.textSecondary }]}>{activeTest.title}</Text>
          
          <View style={styles.scoreContainer}>
            <View style={[styles.scoreCircle, { borderColor: colors.border }]}>
              <Text style={[styles.scoreValue, { color: result.color }]}>{score}%</Text>
              <Text style={[styles.scoreLabel, { color: colors.textSecondary }]}>{t('test.score')}</Text>
            </View>
          </View>

          <View style={[styles.levelBadge, { backgroundColor: result.color + '20' }]}>
            <Text style={[styles.levelText, { color: result.color }]}>{result.level} Severity</Text>
          </View>

          <Text style={[styles.resultMessage, { color: colors.textSecondary }]}>{result.message}</Text>

          <View style={styles.resultActions}>
            <TouchableOpacity
              style={[styles.retryButton, { borderColor: Colors.primary }]}
              onPress={resetTest}
            >
              <Ionicons name="refresh" size={20} color={Colors.primary} />
              <Text style={[styles.retryButtonText, { color: Colors.primary }]}>{t('test.takeAnotherTest')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.consultButton, { backgroundColor: Colors.primary }]}
              onPress={() => router.push('/(tabs)/consult')}
            >
              <Text style={styles.consultButtonText}>{t('test.bookConsultation')}</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    );
  }

  if (activeTest) {
    const question = activeTest.testQuestions[currentQuestion];
    const progress = ((currentQuestion + 1) / activeTest.testQuestions.length) * 100;
    const selectedAnswer = answers[currentQuestion];

    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.progressContainer}>
          <View style={styles.progressHeader}>
            <TouchableOpacity onPress={resetTest}>
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={[styles.progressText, { color: colors.textSecondary }]}>
              {currentQuestion + 1} of {activeTest.testQuestions.length}
            </Text>
          </View>
          <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
            <View style={[styles.progressFill, { width: `${progress}%`, backgroundColor: activeTest.color }]} />
          </View>
        </View>

        <View style={styles.questionContainer}>
          <Animated.View key={currentQuestion} entering={FadeInUp}>
            <Text style={[styles.questionText, { color: colors.text }]}>
              {question.question}
            </Text>
          </Animated.View>

          <View style={styles.optionsContainer}>
            {question.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              return (
                <Animated.View key={index} entering={FadeInDown.delay(index * 50)}>
                  <TouchableOpacity
                    style={[
                      styles.optionButton,
                      isSelected && { backgroundColor: activeTest.color + '20', borderColor: activeTest.color },
                      { backgroundColor: colors.card, borderColor: colors.border }
                    ]}
                    onPress={() => selectAnswer(currentQuestion, index)}
                  >
                    <View style={[
                      styles.optionCircle,
                      isSelected && { backgroundColor: activeTest.color }
                    ]}>
                      {isSelected && <Ionicons name="checkmark" size={14} color="#fff" />}
                    </View>
                    <Text style={[
                      styles.optionText,
                      { color: colors.text },
                      isSelected && { color: activeTest.color, fontWeight: '600' }
                    ]}>
                      {option}
                    </Text>
                  </TouchableOpacity>
                </Animated.View>
              );
            })}
          </View>
        </View>

        <View style={styles.navigationButtons}>
          <TouchableOpacity
            style={[styles.navButton, currentQuestion === 0 && styles.navButtonDisabled]}
            onPress={previousQuestion}
            disabled={currentQuestion === 0}
          >
            <Ionicons name="arrow-back" size={20} color={currentQuestion === 0 ? colors.textMuted : Colors.primary} />
            <Text style={[styles.navButtonText, { color: currentQuestion === 0 ? colors.textMuted : Colors.primary }]}>
              {t('common.previous')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.navButton,
              styles.navButtonPrimary,
              { backgroundColor: selectedAnswer !== undefined ? Colors.primary : colors.textMuted }
            ]}
            onPress={nextQuestion}
            disabled={selectedAnswer === undefined}
          >
            <Text style={styles.navButtonTextPrimary}>
              {currentQuestion === activeTest.testQuestions.length - 1 ? t('common.finish') : t('common.next')}
            </Text>
            <Ionicons name="arrow-forward" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return null;
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
  testsList: {
    paddingHorizontal: 16,
    gap: 12,
  },
  testCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: BorderRadius.lg,
    marginBottom: 12,
    ...Shadows.small,
  },
  testIconContainer: {
    width: 60,
    height: 60,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  testInfo: {
    flex: 1,
  },
  testTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  testDescription: {
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 8,
  },
  testMeta: {
    flexDirection: 'row',
    gap: 12,
  },
  testMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  testMetaText: {
    fontSize: 11,
  },
  disclaimer: {
    flexDirection: 'row',
    margin: 16,
    padding: 14,
    borderRadius: BorderRadius.md,
    gap: 10,
  },
  disclaimerText: {
    flex: 1,
    fontSize: 11,
    lineHeight: 18,
  },
  progressContainer: {
    padding: 16,
    paddingTop: 10,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  questionContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  questionText: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 30,
    marginBottom: 30,
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    gap: 14,
    ...Shadows.small,
  },
  optionCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 15,
    flex: 1,
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    gap: 12,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: BorderRadius.lg,
    gap: 8,
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  navButtonPrimary: {
    flex: 1,
    justifyContent: 'center',
  },
  navButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
  navButtonTextPrimary: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
  resultContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  resultCard: {
    borderRadius: BorderRadius.xl,
    padding: 30,
    alignItems: 'center',
    ...Shadows.large,
  },
  resultIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  resultSubtitle: {
    fontSize: 14,
    marginBottom: 24,
  },
  scoreContainer: {
    marginBottom: 20,
  },
  scoreCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreValue: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  scoreLabel: {
    fontSize: 12,
  },
  levelBadge: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: BorderRadius.full,
    marginBottom: 20,
  },
  levelText: {
    fontSize: 16,
    fontWeight: '700',
  },
  resultMessage: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 30,
  },
  resultActions: {
    width: '100%',
    gap: 12,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    gap: 8,
  },
  retryButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
  consultButton: {
    paddingVertical: 14,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
  },
  consultButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
});
