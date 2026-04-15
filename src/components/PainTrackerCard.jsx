/**
 * PainTrackerCard — Daily check-in loop
 *
 * The core habit loop of AlignPal. Every day the user:
 *   1. Rates their pain (1–10)
 *   2. Confirms whether they did their exercises
 *   3. Gets a contextual response from the "AI coach"
 *
 * State is kept in component for now. Wire to Convex/AsyncStorage for persistence.
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// ─── Coach responses based on pain + exercise combo ──────────────────────────
const getCoachResponse = (pain, didExercise) => {
  if (didExercise && pain <= 3) return { emoji: '🎯', msg: 'Pain is low and you showed up — that\'s the combo that creates lasting recovery. Keep this going.' };
  if (didExercise && pain <= 6) return { emoji: '💪', msg: 'You did the work even through discomfort. That consistency is exactly what breaks the pain cycle.' };
  if (didExercise && pain > 6)  return { emoji: '🧊', msg: 'High pain today — consider backing off intensity. Rest and gentle movement is still progress.' };
  if (!didExercise && pain <= 3) return { emoji: '✨', msg: 'Feeling better today! Don\'t skip tomorrow though — the improvement comes from staying consistent.' };
  if (!didExercise && pain <= 6) return { emoji: '⏰', msg: 'Even 5 minutes of your exercises would help right now. Small sessions beat skipping every time.' };
  return { emoji: '💙', msg: 'High pain days are hard. Rest is valid. When you\'re ready, your exercises will be here.' };
};

// ─── Pain color scale ─────────────────────────────────────────────────────────
const getPainColor = (level) => {
  if (level <= 3) return '#4CAF50';
  if (level <= 6) return '#F4A426';
  return '#EF4444';
};

const getPainLabel = (level) => {
  if (!level) return '';
  if (level <= 2) return 'Minimal';
  if (level <= 4) return 'Mild';
  if (level <= 6) return 'Moderate';
  if (level <= 8) return 'Significant';
  return 'Severe';
};

// ─── Main Component ───────────────────────────────────────────────────────────
export default function PainTrackerCard() {
  const [selectedPain, setSelectedPain] = useState(null);
  const [didExercise, setDidExercise] = useState(null); // true | false | null
  const [submitted, setSubmitted] = useState(false);

  const canSubmit = selectedPain !== null && didExercise !== null;
  const coachResponse = submitted ? getCoachResponse(selectedPain, didExercise) : null;

  const handleSubmit = () => {
    if (canSubmit) setSubmitted(true);
  };

  const handleReset = () => {
    setSelectedPain(null);
    setDidExercise(null);
    setSubmitted(false);
  };

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.cardTitle}>Daily Check-in</Text>
          <Text style={styles.cardSubtitle}>Track your recovery progress</Text>
        </View>
        <View style={styles.streakBadge}>
          <Ionicons name="flame" size={14} color="#F4A426" />
          <Text style={styles.streakText}>3 day streak</Text>
        </View>
      </View>

      {!submitted ? (
        <>
          {/* Pain rating */}
          <Text style={styles.sectionLabel}>
            How's your pain today?
            {selectedPain && (
              <Text style={[styles.painLabelInline, { color: getPainColor(selectedPain) }]}>
                {'  '}{getPainLabel(selectedPain)} ({selectedPain}/10)
              </Text>
            )}
          </Text>

          <View style={styles.painScale}>
            {[1,2,3,4,5,6,7,8,9,10].map((level) => {
              const isSelected = selectedPain === level;
              const color = getPainColor(level);
              return (
                <TouchableOpacity
                  key={level}
                  style={[
                    styles.painButton,
                    { borderColor: isSelected ? color : '#1F2A3D' },
                    isSelected && { backgroundColor: color + '22' },
                  ]}
                  onPress={() => setSelectedPain(level)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.painButtonText, isSelected && { color }]}>
                    {level}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.scaleLabels}>
            <Text style={styles.scaleLabel}>No pain</Text>
            <Text style={styles.scaleLabel}>Worst</Text>
          </View>

          {/* Did you exercise? */}
          <Text style={styles.sectionLabel}>Did you do your exercises?</Text>
          <View style={styles.exerciseRow}>
            <TouchableOpacity
              style={[
                styles.exerciseBtn,
                didExercise === true && styles.exerciseBtnYes,
              ]}
              onPress={() => setDidExercise(true)}
              activeOpacity={0.8}
            >
              <Ionicons
                name="checkmark-circle"
                size={20}
                color={didExercise === true ? '#0E1625' : '#4CAF50'}
              />
              <Text style={[styles.exerciseBtnText, didExercise === true && styles.exerciseBtnTextYes]}>
                Yes, I did
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.exerciseBtn,
                didExercise === false && styles.exerciseBtnNo,
              ]}
              onPress={() => setDidExercise(false)}
              activeOpacity={0.8}
            >
              <Ionicons
                name="close-circle"
                size={20}
                color={didExercise === false ? '#0E1625' : '#EF4444'}
              />
              <Text style={[styles.exerciseBtnText, didExercise === false && styles.exerciseBtnTextNo]}>
                Not today
              </Text>
            </TouchableOpacity>
          </View>

          {/* Submit */}
          <TouchableOpacity
            style={[styles.submitButton, !canSubmit && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={!canSubmit}
            activeOpacity={0.85}
          >
            <Text style={[styles.submitButtonText, !canSubmit && styles.submitButtonTextDisabled]}>
              Log Check-in
            </Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          {/* Logged state */}
          <View style={styles.loggedRow}>
            <View style={styles.loggedStat}>
              <Text style={[styles.loggedValue, { color: getPainColor(selectedPain) }]}>
                {selectedPain}/10
              </Text>
              <Text style={styles.loggedStatLabel}>Pain level</Text>
            </View>
            <View style={styles.loggedDivider} />
            <View style={styles.loggedStat}>
              <Text style={[styles.loggedValue, { color: didExercise ? '#4CAF50' : '#EF4444' }]}>
                {didExercise ? 'Done' : 'Skipped'}
              </Text>
              <Text style={styles.loggedStatLabel}>Exercises</Text>
            </View>
          </View>

          {/* AI coach response */}
          <View style={styles.coachBox}>
            <Text style={styles.coachEmoji}>{coachResponse.emoji}</Text>
            <Text style={styles.coachMsg}>{coachResponse.msg}</Text>
          </View>

          <TouchableOpacity style={styles.editButton} onPress={handleReset}>
            <Text style={styles.editButtonText}>Edit today's entry</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  card: {
    backgroundColor: '#101B31',
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: '#263554',
    shadowColor: '#02060E',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.26,
    shadowRadius: 15,
    elevation: 6,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  cardTitle:    { fontSize: 18, fontWeight: '700', color: '#E6EDFF', marginBottom: 2 },
  cardSubtitle: { fontSize: 13, color: '#4A5A72' },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A2335',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
    gap: 4,
    borderWidth: 1,
    borderColor: '#2A3547',
  },
  streakText: { fontSize: 12, color: '#F4A426', fontWeight: '600' },

  sectionLabel: { fontSize: 14, fontWeight: '600', color: '#94A3B8', marginBottom: 12 },
  painLabelInline: { fontSize: 14, fontWeight: '700' },

  painScale: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  painButton: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 2,
    borderWidth: 1.5,
    borderColor: '#1F2A3D',
    backgroundColor: '#0E1625',
  },
  painButtonText: { fontSize: 13, fontWeight: '600', color: '#4A5A72' },

  scaleLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  scaleLabel: { fontSize: 11, color: '#3A4B62' },

  exerciseRow:       { flexDirection: 'row', gap: 10, marginBottom: 20 },
  exerciseBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#0E1625',
    borderWidth: 1.5,
    borderColor: '#1F2A3D',
  },
  exerciseBtnYes:     { backgroundColor: '#4CAF5022', borderColor: '#4CAF50' },
  exerciseBtnNo:      { backgroundColor: '#EF444422', borderColor: '#EF4444' },
  exerciseBtnText:    { fontSize: 14, fontWeight: '600', color: '#4A5A72' },
  exerciseBtnTextYes: { color: '#0E1625' },
  exerciseBtnTextNo:  { color: '#0E1625' },

  submitButton: {
    backgroundColor: '#5B8DFF',
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
  },
  submitButtonDisabled:     { backgroundColor: '#1F2A3D' },
  submitButtonText:         { fontSize: 15, fontWeight: '700', color: '#0E1625' },
  submitButtonTextDisabled: { color: '#3A4B62' },

  // Logged state
  loggedRow: {
    flexDirection: 'row',
    backgroundColor: '#0E1625',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#1F2A3D',
  },
  loggedStat:      { flex: 1, alignItems: 'center' },
  loggedValue:     { fontSize: 22, fontWeight: '700', marginBottom: 4 },
  loggedStatLabel: { fontSize: 12, color: '#4A5A72' },
  loggedDivider:   { width: 1, backgroundColor: '#1F2A3D', marginHorizontal: 8 },

  coachBox: {
    backgroundColor: '#111E33',
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#1F3A5F',
  },
  coachEmoji: { fontSize: 24 },
  coachMsg:   { fontSize: 14, color: '#94A3B8', lineHeight: 22, flex: 1 },

  editButton:     { alignItems: 'center' },
  editButtonText: { fontSize: 13, color: '#3A4B62', textDecorationLine: 'underline' },
});
