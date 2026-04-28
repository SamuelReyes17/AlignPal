import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Colors, Shadows } from '../constants/brand';
import { useOnboarding } from '../context/OnboardingContext';
import { selectExercises } from '../constants/exerciseLibrary';

const PHASE_COLORS = {
  Mobility:   Colors.purple,
  Activation: Colors.green,
  Stability:  Colors.amber,
  Strength:   Colors.red,
  Release:    Colors.purpleLight,
};

export default function ExerciseCard({ previewOnly, onUpgrade }) {
  const navigation = useNavigation();
  const { onboardingData } = useOnboarding();
  const exercises = selectExercises(onboardingData).slice(0, 3);

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>Today's Exercises</Text>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{exercises.length} exercises</Text>
        </View>
      </View>

      {exercises.map((exercise) => {
        const phaseColor = PHASE_COLORS[exercise.phase] || Colors.purple;
        return (
          <View key={exercise.name} style={styles.exerciseItem}>
            <View style={[styles.iconContainer, { backgroundColor: phaseColor + '22', borderColor: phaseColor + '40' }]}>
              <Ionicons name={exercise.icon || 'body-outline'} size={20} color={phaseColor} />
            </View>
            <View style={styles.exerciseInfo}>
              <Text style={styles.exerciseName}>{exercise.name}</Text>
              <Text style={styles.exerciseMeta}>{exercise.reps || exercise.duration}</Text>
            </View>
            <View style={[styles.phaseBadge, { backgroundColor: phaseColor + '22', borderColor: phaseColor + '50' }]}>
              <Text style={[styles.phaseText, { color: phaseColor }]}>{exercise.phase}</Text>
            </View>
          </View>
        );
      })}

      {previewOnly ? (
        <TouchableOpacity style={styles.upgradeButton} onPress={onUpgrade} activeOpacity={0.85}>
          <Ionicons name="lock-closed" size={16} color={Colors.white} />
          <Text style={styles.upgradeButtonText}>Unlock Full Plan</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.startButton}
          onPress={() => navigation.navigate('RecoverySession')}
          activeOpacity={0.85}
        >
          <Ionicons name="play-circle-outline" size={20} color={Colors.white} />
          <Text style={styles.startButtonText}>Start Recovery Session</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.bgCard,
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.card,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  countBadge: {
    backgroundColor: Colors.purpleDim,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  countText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.purpleLight,
  },
  exerciseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderSubtle,
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 14,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  exerciseInfo: {
    flex: 1,
    gap: 3,
  },
  exerciseName: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  exerciseMeta: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  phaseBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 7,
    borderWidth: 1,
  },
  phaseText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  startButton: {
    flexDirection: 'row',
    backgroundColor: Colors.purple,
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    gap: 8,
    ...Shadows.purple,
  },
  startButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  upgradeButton: {
    flexDirection: 'row',
    backgroundColor: Colors.purpleDim,
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.purple + '60',
  },
  upgradeButtonText: {
    color: Colors.purpleLight,
    fontSize: 16,
    fontWeight: '700',
  },
});
