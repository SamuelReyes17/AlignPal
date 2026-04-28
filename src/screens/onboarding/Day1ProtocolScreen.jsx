import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useOnboarding } from '../../context/OnboardingContext';
import { Colors, Shadows } from '../../constants/brand';
import { selectExercises } from '../../constants/exerciseLibrary';

const PHASE_COLORS = {
  Mobility:   Colors.purple,
  Activation: Colors.green,
  Stability:  Colors.amber,
  Strength:   Colors.red,
  Release:    Colors.purpleLight,
};

function parseRepsShort(ex) {
  const reps = (ex.reps || '').trim();
  if (reps) return reps;
  return ex.duration || '';
}

export default function Day1ProtocolScreen({ navigation }) {
  const { onboardingData } = useOnboarding();
  const exercises = selectExercises(onboardingData);
  const totalMinutes = exercises.reduce((sum, e) => sum + (parseInt(e.duration) || 2), 0);

  return (
    <SafeAreaView style={s.container} edges={['top', 'bottom']}>

      {/* Progress bar */}
      <View style={s.progressHeader}>
        <View style={s.progressBar}>
          <View style={[s.progressFill, { width: '95%' }]} />
        </View>
      </View>

      <ScrollView style={s.scroll} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={s.header}>
          <View style={s.badge}>
            <Ionicons name="today-outline" size={14} color={Colors.purple} />
            <Text style={s.badgeText}>Day 1 Protocol</Text>
          </View>
          <Text style={s.title}>Your first session</Text>
          <View style={s.statsRow}>
            <View style={s.statPill}>
              <Ionicons name="barbell-outline" size={13} color={Colors.purple} />
              <Text style={s.statText}>{exercises.length} exercises</Text>
            </View>
            <View style={s.statPill}>
              <Ionicons name="time-outline" size={13} color={Colors.purple} />
              <Text style={s.statText}>~{totalMinutes} min</Text>
            </View>
            <View style={s.statPill}>
              <Ionicons name="checkmark-circle-outline" size={13} color={Colors.purple} />
              <Text style={s.statText}>No equipment</Text>
            </View>
          </View>
        </View>

        {/* Exercise list */}
        <View style={s.list}>
          {exercises.map((ex, i) => {
            const phaseColor = PHASE_COLORS[ex.phase] || Colors.purple;
            return (
              <View key={i} style={s.row}>
                <View style={s.number}>
                  <Text style={s.numberText}>{i + 1}</Text>
                </View>
                <View style={s.rowInfo}>
                  <Text style={s.rowName}>{ex.name}</Text>
                  <View style={s.rowMeta}>
                    <View style={[s.phaseBadge, { backgroundColor: phaseColor + '22', borderColor: phaseColor + '50' }]}>
                      <Text style={[s.phaseText, { color: phaseColor }]}>{ex.phase}</Text>
                    </View>
                    <Text style={s.rowReps}>{parseRepsShort(ex)}</Text>
                  </View>
                </View>
                <View style={s.durationTag}>
                  <Text style={s.durationText}>{ex.duration}</Text>
                </View>
              </View>
            );
          })}
        </View>

        <View style={{ height: 12 }} />
      </ScrollView>

      {/* Footer */}
      <View style={s.footer}>
        <TouchableOpacity
          style={s.startBtn}
          onPress={() => navigation.navigate('RecoverySession')}
          activeOpacity={0.85}
        >
          <Ionicons name="play-circle" size={22} color={Colors.white} />
          <Text style={s.startBtnText}>Start Recovery Session</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={s.skipBtn}
          onPress={() => navigation.navigate('Upgrade')}
          activeOpacity={0.75}
        >
          <Text style={s.skipBtnText}>Skip to Full Plan</Text>
          <Ionicons name="arrow-forward" size={14} color={Colors.textMuted} />
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container:      { flex: 1, backgroundColor: Colors.bg },
  progressHeader: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12 },
  progressBar:    { height: 3, backgroundColor: Colors.border, borderRadius: 2, overflow: 'hidden' },
  progressFill:   { height: '100%', backgroundColor: Colors.purple, borderRadius: 2 },
  scroll:         { flex: 1 },
  content:        { paddingHorizontal: 20, paddingTop: 4, paddingBottom: 16 },

  header:     { marginBottom: 24 },
  badge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: Colors.purpleDim, alignSelf: 'flex-start',
    paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20, marginBottom: 12,
  },
  badgeText:  { fontSize: 12, color: Colors.purple, fontWeight: '700' },
  title:      { fontSize: 28, fontWeight: '800', color: Colors.textPrimary, letterSpacing: -0.5, marginBottom: 16 },
  statsRow:   { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  statPill:   { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: Colors.bgCard, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 6, borderWidth: 1, borderColor: Colors.border },
  statText:   { fontSize: 12, color: Colors.textSecondary, fontWeight: '600' },

  list:       { gap: 10 },
  row: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: Colors.bgCard, borderRadius: 18,
    padding: 14, borderWidth: 1, borderColor: Colors.border,
  },
  number: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: Colors.purpleDim,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  numberText:  { fontSize: 14, fontWeight: '700', color: Colors.purple },
  rowInfo:     { flex: 1, gap: 6 },
  rowName:     { fontSize: 15, fontWeight: '700', color: Colors.textPrimary },
  rowMeta:     { flexDirection: 'row', alignItems: 'center', gap: 8 },
  phaseBadge:  { paddingHorizontal: 7, paddingVertical: 2, borderRadius: 6, borderWidth: 1 },
  phaseText:   { fontSize: 10, fontWeight: '700', letterSpacing: 0.3 },
  rowReps:     { fontSize: 11, color: Colors.textMuted },
  durationTag: { backgroundColor: Colors.bgInput, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  durationText: { fontSize: 11, fontWeight: '600', color: Colors.textSecondary },

  footer:      { paddingHorizontal: 20, paddingBottom: 28, paddingTop: 12, borderTopWidth: 1, borderTopColor: Colors.borderSubtle, gap: 10 },
  startBtn: {
    backgroundColor: Colors.purple, borderRadius: 20,
    paddingVertical: 18, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 10, ...Shadows.purple,
  },
  startBtnText: { fontSize: 17, fontWeight: '700', color: Colors.white },
  skipBtn:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 4 },
  skipBtnText:  { fontSize: 13, color: Colors.textMuted },
});
