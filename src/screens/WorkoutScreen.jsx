import React, { useMemo } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Colors, Shadows } from '../constants/brand';
import { useOnboarding } from '../context/OnboardingContext';
import { selectExercises } from '../constants/exerciseLibrary';

const PHASE = {
  Mobility:   { color: '#7C5CF0', icon: 'sync-outline',    label: 'Mobility'   },
  Activation: { color: '#34D399', icon: 'flash-outline',   label: 'Activation' },
  Stability:  { color: '#FBBF24', icon: 'shield-outline',  label: 'Stability'  },
  Strength:   { color: '#FF6B9D', icon: 'barbell-outline', label: 'Strength'   },
  Release:    { color: '#C4B8FF', icon: 'leaf-outline',    label: 'Release'    },
};
const getPhase = (name) => PHASE[name] || PHASE.Mobility;

function getTodayString() {
  return new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
}

function getDayStrip() {
  const today = new Date();
  const days = [];
  for (let i = -2; i <= 4; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push({
      label: d.toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 2),
      num:   d.getDate(),
      isToday: i === 0,
    });
  }
  return days;
}

export default function WorkoutScreen() {
  const navigation = useNavigation();
  const { onboardingData } = useOnboarding();
  const exercises = useMemo(() => selectExercises(onboardingData), [onboardingData]);
  const days = getDayStrip();

  const totalMin  = exercises.reduce((s, e) => s + (parseInt(e.duration) || 2), 0);
  const phases    = [...new Set(exercises.map(e => e.phase))];

  return (
    <SafeAreaView style={st.container} edges={['top']}>
      {/* Header */}
      <View style={st.header}>
        <View>
          <Text style={st.eyebrow}>Today's</Text>
          <Text style={st.title}>Workout</Text>
        </View>
        <View style={st.dateBadge}>
          <Ionicons name="calendar-outline" size={13} color={Colors.purple} />
          <Text style={st.dateBadgeText}>{getTodayString().split(',')[0]}</Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={st.content}
      >
        {/* Day strip */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={st.dayStrip}
        >
          {days.map((d, i) => (
            <View key={i} style={[st.dayCell, d.isToday && st.dayCellToday]}>
              <Text style={[st.dayLabel, d.isToday && st.dayLabelToday]}>{d.label}</Text>
              <Text style={[st.dayNum,   d.isToday && st.dayNumToday]}>{d.num}</Text>
              {d.isToday && <View style={st.dayDot} />}
            </View>
          ))}
        </ScrollView>

        {/* Summary card */}
        <View style={st.summaryCard}>
          <View style={st.summaryRow}>
            <View style={st.statItem}>
              <Ionicons name="barbell-outline" size={18} color={Colors.purple} />
              <Text style={st.statVal}>{exercises.length}</Text>
              <Text style={st.statLbl}>Exercises</Text>
            </View>
            <View style={st.statDivider} />
            <View style={st.statItem}>
              <Ionicons name="time-outline" size={18} color={Colors.amber} />
              <Text style={st.statVal}>{totalMin}m</Text>
              <Text style={st.statLbl}>Duration</Text>
            </View>
            <View style={st.statDivider} />
            <View style={st.statItem}>
              <Ionicons name="layers-outline" size={18} color={Colors.green} />
              <Text style={st.statVal}>{phases.length}</Text>
              <Text style={st.statLbl}>Phases</Text>
            </View>
          </View>
        </View>

        {/* Exercise list */}
        <View style={st.section}>
          <Text style={st.sectionTitle}>Today's Exercises</Text>
          {exercises.map((ex, i) => {
            const ph = getPhase(ex.phase);
            return (
              <View key={ex.name + i} style={st.exCard}>
                <View style={[st.exNumBadge, { backgroundColor: ph.color + '22', borderColor: ph.color + '50' }]}>
                  <Text style={[st.exNum, { color: ph.color }]}>{i + 1}</Text>
                </View>
                <View style={st.exInfo}>
                  <Text style={st.exName}>{ex.name}</Text>
                  <View style={st.exMeta}>
                    <View style={[st.phasePill, { backgroundColor: ph.color + '18', borderColor: ph.color + '40' }]}>
                      <Ionicons name={ph.icon} size={9} color={ph.color} />
                      <Text style={[st.phaseText, { color: ph.color }]}>{ph.label}</Text>
                    </View>
                    <Text style={st.exReps}>{ex.reps || ex.duration}</Text>
                  </View>
                </View>
                <View style={[st.focusDot, { backgroundColor: ph.color }]} />
              </View>
            );
          })}
        </View>

        {/* Tip */}
        <View style={st.tipCard}>
          <Ionicons name="bulb-outline" size={16} color={Colors.amber} />
          <Text style={st.tipText}>
            Complete each set at your own pace. Rest 30–60 seconds between sets. Stop if pain increases beyond baseline.
          </Text>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Start button */}
      <View style={st.footer}>
        <TouchableOpacity
          style={st.startBtn}
          onPress={() => navigation.navigate('RecoverySession')}
          activeOpacity={0.88}
        >
          <Ionicons name="play-circle" size={22} color="#fff" />
          <Text style={st.startBtnText}>Start Session</Text>
          <Text style={st.startBtnSub}>{totalMin} min</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const st = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  content:   { paddingBottom: 20 },

  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingTop: 14, paddingBottom: 16,
  },
  eyebrow:     { fontSize: 12, color: Colors.textSecondary, fontWeight: '600', letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 3 },
  title:       { fontSize: 30, fontWeight: '800', color: Colors.textPrimary },
  dateBadge:   { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: Colors.purpleDim, borderRadius: 12, paddingHorizontal: 11, paddingVertical: 6, borderWidth: 1, borderColor: Colors.purple + '40' },
  dateBadgeText: { fontSize: 12, fontWeight: '700', color: Colors.purple },

  dayStrip:   { paddingHorizontal: 16, paddingBottom: 12, gap: 8 },
  dayCell:    { width: 44, alignItems: 'center', paddingVertical: 10, borderRadius: 14, backgroundColor: Colors.bgCard, borderWidth: 1, borderColor: Colors.border },
  dayCellToday: { backgroundColor: Colors.purple, borderColor: Colors.purple },
  dayLabel:   { fontSize: 10, fontWeight: '700', color: Colors.textMuted, marginBottom: 4 },
  dayLabelToday: { color: 'rgba(255,255,255,0.7)' },
  dayNum:     { fontSize: 16, fontWeight: '800', color: Colors.textSecondary },
  dayNumToday: { color: '#fff' },
  dayDot:     { width: 5, height: 5, borderRadius: 2.5, backgroundColor: 'rgba(255,255,255,0.6)', marginTop: 4 },

  summaryCard: {
    marginHorizontal: 20, marginBottom: 16, backgroundColor: Colors.bgCard,
    borderRadius: 20, padding: 18, borderWidth: 1, borderColor: Colors.border, ...Shadows.card,
  },
  summaryRow:  { flexDirection: 'row', alignItems: 'center' },
  statItem:    { flex: 1, alignItems: 'center', gap: 4 },
  statVal:     { fontSize: 22, fontWeight: '800', color: Colors.textPrimary },
  statLbl:     { fontSize: 11, color: Colors.textMuted, fontWeight: '600' },
  statDivider: { width: 1, height: 40, backgroundColor: Colors.border },

  section:      { paddingHorizontal: 20, marginBottom: 12 },
  sectionTitle: { fontSize: 17, fontWeight: '800', color: Colors.textPrimary, marginBottom: 12, letterSpacing: -0.3 },

  exCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: Colors.bgCard, borderRadius: 18, padding: 14,
    marginBottom: 8, borderWidth: 1, borderColor: Colors.border,
  },
  exNumBadge: { width: 34, height: 34, borderRadius: 17, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  exNum:      { fontSize: 14, fontWeight: '800' },
  exInfo:     { flex: 1, gap: 5 },
  exName:     { fontSize: 15, fontWeight: '700', color: Colors.textPrimary },
  exMeta:     { flexDirection: 'row', alignItems: 'center', gap: 7 },
  phasePill:  { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 7, paddingVertical: 3, borderRadius: 7, borderWidth: 1 },
  phaseText:  { fontSize: 10, fontWeight: '700' },
  exReps:     { fontSize: 11, color: Colors.textMuted, fontWeight: '500' },
  focusDot:   { width: 8, height: 8, borderRadius: 4 },

  tipCard: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 10,
    marginHorizontal: 20, backgroundColor: Colors.amber + '10',
    borderRadius: 16, padding: 14, borderWidth: 1, borderColor: Colors.amber + '30',
  },
  tipText: { flex: 1, fontSize: 12, color: Colors.amber, lineHeight: 19 },

  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    paddingHorizontal: 20, paddingBottom: 32, paddingTop: 12,
    backgroundColor: Colors.bg + 'EE',
    borderTopWidth: 1, borderTopColor: Colors.borderSubtle,
  },
  startBtn: {
    backgroundColor: Colors.purple, borderRadius: 20,
    paddingVertical: 18, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'center', gap: 10,
    ...Shadows.purple,
  },
  startBtnText: { fontSize: 17, fontWeight: '800', color: '#fff' },
  startBtnSub:  { fontSize: 13, color: 'rgba(255,255,255,0.65)', fontWeight: '600' },
});
