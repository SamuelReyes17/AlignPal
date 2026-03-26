import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useOnboarding } from '../../context/OnboardingContext';

export default function ResultsScreen({ navigation }) {
  const { generatePersonalizedPlan } = useOnboarding();
  const plan = generatePersonalizedPlan();

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: '85%' }]} />
        </View>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        <View style={styles.iconContainer}>
          <Ionicons name="sparkles" size={48} color="#5B8DFF" />
        </View>

        <Text style={styles.title}>Your Personalized Plan</Text>
        <Text style={styles.subtitle}>Based on your responses, here's what we found:</Text>

        {/* Pain Patterns */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pain Pattern Analysis</Text>
          <View style={styles.patternsContainer}>
            {plan.patterns.map((pattern, index) => (
              <View key={index} style={styles.patternItem}>
                <Ionicons name="checkmark-circle" size={20} color="#5B8DFF" />
                <Text style={styles.patternText}>{pattern}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Exercise Routine Preview */}
        <View style={styles.section}>
          <View style={styles.routineHeader}>
            <Text style={styles.sectionTitle}>7-Minute Reset Routine</Text>
            <View style={styles.durationBadge}>
              <Ionicons name="time-outline" size={14} color="#5B8DFF" />
              <Text style={styles.durationText}>{plan.totalDuration} min</Text>
            </View>
          </View>

          <Text style={styles.routineSubtitle}>Preview your personalized exercises:</Text>

          {plan.exercises.map((exercise, index) => (
            <View key={index} style={styles.exerciseCard}>
              <View style={styles.exerciseNumber}>
                <Text style={styles.exerciseNumberText}>{index + 1}</Text>
              </View>
              <View style={styles.exerciseContent}>
                <Text style={styles.exerciseName}>{exercise.name}</Text>
                <View style={styles.exerciseMeta}>
                  <View style={styles.exerciseTag}>
                    <Text style={styles.exerciseTagText}>{exercise.duration}</Text>
                  </View>
                  <Text style={styles.exerciseFocus}>{exercise.focus}</Text>
                </View>
              </View>
              <Ionicons name="play-circle-outline" size={24} color="#5B8DFF" />
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={() => navigation.navigate('Upgrade')}
          activeOpacity={0.8}
        >
          <Text style={styles.continueButtonText}>Continue to Routine</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0E1625',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },
  progressBar: {
    height: 3,
    backgroundColor: '#1F2A3D',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#5B8DFF',
    borderRadius: 2,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  iconContainer: {
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#7F8FA9',
    textAlign: 'center',
    marginBottom: 32,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  patternsContainer: {
    backgroundColor: '#1F2A3D',
    borderRadius: 16,
    padding: 20,
    gap: 12,
  },
  patternItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  patternText: {
    fontSize: 15,
    color: '#B8C5D6',
    lineHeight: 22,
    flex: 1,
  },
  routineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  durationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F3A5F',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  durationText: {
    fontSize: 14,
    color: '#5B8DFF',
    fontWeight: '600',
  },
  routineSubtitle: {
    fontSize: 14,
    color: '#7F8FA9',
    marginBottom: 16,
  },
  exerciseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F2A3D',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2A3547',
  },
  exerciseNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1F3A5F',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  exerciseNumberText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#5B8DFF',
  },
  exerciseContent: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  exerciseMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  exerciseTag: {
    backgroundColor: '#1F3A5F',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  exerciseTagText: {
    fontSize: 12,
    color: '#5B8DFF',
    fontWeight: '500',
  },
  exerciseFocus: {
    fontSize: 12,
    color: '#7F8FA9',
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#1F2A3D',
  },
  continueButton: {
    backgroundColor: '#5B8DFF',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0E1625',
  },
});
