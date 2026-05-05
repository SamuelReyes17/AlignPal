import React, { useMemo } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Colors, Shadows, Accents, Gradients, Radius, Spacing, Surfaces, PhasePalette, getPhaseMeta } from '../constants/brand';
import { useOnboarding } from '../context/OnboardingContext';
import { selectExercises } from '../constants/exerciseLibrary';
import GradientCard from '../components/GradientCard';
import ScreenFrame from '../components/ScreenFrame';
import { useResponsive, fs, sp } from '../utils/responsive';


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
  const insets = useSafeAreaInsets();
  const { onboardingData } = useOnboarding();
  const exercises = useMemo(() => selectExercises(onboardingData), [onboardingData]);
  const days = getDayStrip();
  const { isSmall, isTablet, horizPad, fontScale, gapScale, width } = useResponsive();
  const frameWidth = Math.min(width - horizPad * 2, 640);

  const dyn = {
    frame:        { width: '100%', alignSelf: 'center', maxWidth: 640, paddingHorizontal: horizPad, paddingTop: sp(8, gapScale) },
    heroWrap:     { paddingBottom: 4 }, // full-bleed: no horizontal padding
    heroTitle:    { fontSize: fs(30, fontScale) },
    heroEyebrow:  { fontSize: fs(11, fontScale) },
    heroQuickValue:{ fontSize: fs(20, fontScale) },
    heroQuickLabel:{ fontSize: fs(9, fontScale) },
    cardWrap:     { marginHorizontal: horizPad },
    sectionWrap:  { paddingHorizontal: horizPad },
    sectionTitle: { fontSize: fs(17, fontScale) },
    statVal:      { fontSize: fs(22, fontScale) },
    statLbl:      { fontSize: fs(11, fontScale) },
    exName:       { fontSize: fs(15, fontScale) },
    footer:       { paddingHorizontal: horizPad },
    footerInner:  { maxWidth: frameWidth, width: '100%', alignSelf: 'center' },
    startBtnText: { fontSize: fs(17, fontScale) },
  };

  const totalMin  = exercises.reduce((s, e) => s + (parseInt(e.duration) || 2), 0);
  const phases    = [...new Set(exercises.map(e => e.phase))];

  return (
    <SafeAreaView style={st.container} edges={[]}>
     <ScreenFrame>
      {/* ═══ Full-bleed gradient hero header ═══════════════════════════════ */}
      <View style={dyn.heroWrap}>
        <GradientCard
          colors={Gradients.purpleHero}
          radius={Radius.hero}
          corners="bottom"
          blobs={[
            { x: '88%', y: '20%', r: 70, color: Colors.white, opacity: 0.10 },
            { x: '15%', y: '90%', r: 50, color: Colors.white, opacity: 0.06 },
          ]}
          style={[Shadows.purpleSoft, { paddingTop: insets.top }]}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View>
              <Text style={[st.heroEyebrow, dyn.heroEyebrow]}>TODAY'S</Text>
              <Text style={[st.heroTitle, dyn.heroTitle]}>Workout</Text>
            </View>
            <View style={st.heroDateBadge}>
              <Ionicons name="calendar" size={13} color={Colors.white} />
              <Text style={st.heroDateBadgeText}>{getTodayString().split(',')[0]}</Text>
            </View>
          </View>
          <View style={st.heroQuickStats}>
            <View style={st.heroQuickStat}>
              <Text style={[st.heroQuickValue, dyn.heroQuickValue]}>{exercises.length}</Text>
              <Text style={[st.heroQuickLabel, dyn.heroQuickLabel]}>EXERCISES</Text>
            </View>
            <View style={st.heroQuickStatDivider} />
            <View style={st.heroQuickStat}>
              <Text style={[st.heroQuickValue, dyn.heroQuickValue]}>{totalMin}m</Text>
              <Text style={[st.heroQuickLabel, dyn.heroQuickLabel]}>DURATION</Text>
            </View>
            <View style={st.heroQuickStatDivider} />
            <View style={st.heroQuickStat}>
              <Text style={[st.heroQuickValue, dyn.heroQuickValue]}>{phases.length}</Text>
              <Text style={[st.heroQuickLabel, dyn.heroQuickLabel]}>PHASES</Text>
            </View>
          </View>
        </GradientCard>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={st.content}
      >
        <View style={[st.frame, dyn.frame]}>
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
        <View style={[st.summaryCard, undefined]}>
          <View style={st.summaryRow}>
            <View style={st.statItem}>
              <Ionicons name="barbell-outline" size={18} color={Colors.purple} />
              <Text style={[st.statVal, dyn.statVal]}>{exercises.length}</Text>
              <Text style={[st.statLbl, dyn.statLbl]}>Exercises</Text>
            </View>
            <View style={st.statDivider} />
            <View style={st.statItem}>
              <Ionicons name="time-outline" size={18} color={Colors.amber} />
              <Text style={[st.statVal, dyn.statVal]}>{totalMin}m</Text>
              <Text style={[st.statLbl, dyn.statLbl]}>Duration</Text>
            </View>
            <View style={st.statDivider} />
            <View style={st.statItem}>
              <Ionicons name="layers-outline" size={18} color={Colors.green} />
              <Text style={[st.statVal, dyn.statVal]}>{phases.length}</Text>
              <Text style={[st.statLbl, dyn.statLbl]}>Phases</Text>
            </View>
          </View>
        </View>

        {/* Exercise list */}
        <View style={[st.section, dyn.sectionWrap]}>
          <Text style={[st.sectionTitle, dyn.sectionTitle]}>Today's Exercises</Text>
          {exercises.map((ex, i) => {
            const ph = getPhaseMeta(ex.phase);
            return (
              <View key={ex.name + i} style={st.exCard}>
                <View style={[st.exNumBadge, { backgroundColor: ph.color + '22', borderColor: ph.color + '50' }]}>
                  <Text style={[st.exNum, { color: ph.color }]}>{i + 1}</Text>
                </View>
                <View style={st.exInfo}>
                  <Text style={[st.exName, dyn.exName]}>{ex.name}</Text>
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
        <View style={[st.tipCard, undefined]}>
          <Ionicons name="bulb-outline" size={16} color={Colors.amber} />
          <Text style={st.tipText}>
            Complete each set at your own pace. Rest 30–60 seconds between sets. Stop if pain increases beyond baseline.
          </Text>
        </View>

        <View style={{ height: 120 }} />
        </View>
      </ScrollView>

      {/* Start button */}
      <View style={[st.footer, dyn.footer]}>
        <View style={dyn.footerInner}>
          <TouchableOpacity
            style={st.startBtn}
            onPress={() => navigation.navigate('RecoverySession')}
            activeOpacity={0.88}
          >
            <Ionicons name="play-circle" size={22} color={Colors.white} />
            <Text style={[st.startBtnText, dyn.startBtnText]}>Start Session</Text>
            <Text style={st.startBtnSub}>{totalMin} min</Text>
          </TouchableOpacity>
        </View>
      </View>
     </ScreenFrame>
    </SafeAreaView>
  );
}

const st = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  content:   { paddingBottom: Spacing.tabBarClearance },
  frame:     { width: '100%', alignSelf: 'center' },

  // Hero
  heroEyebrow:           { fontSize: 11, color: Surfaces.onNavy85, fontWeight: '800', letterSpacing: 1.4 },
  heroTitle:             { fontSize: 30, fontWeight: '800', color: Colors.white, letterSpacing: -0.6, marginTop: 3 },
  heroDateBadge:         { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: Surfaces.onNavy22, borderRadius: Radius.pill, paddingHorizontal: Spacing.sm, paddingVertical: Spacing.xs },
  heroDateBadgeText:     { fontSize: 12, fontWeight: '800', color: Colors.white },
  heroQuickStats:        { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: Surfaces.onNavy14, borderRadius: Radius.lg, padding: Spacing.sm, marginTop: Spacing.md },
  heroQuickStat:         { flex: 1, alignItems: 'center' },
  heroQuickValue:        { color: Colors.white, fontSize: 20, fontWeight: '800', letterSpacing: -0.4 },
  heroQuickLabel:        { color: Surfaces.onNavy85, fontSize: 9, fontWeight: '800', letterSpacing: 1.2, marginTop: 4 },
  heroQuickStatDivider:  { width: 1, height: 24, backgroundColor: Surfaces.onNavy22 },

  dayStrip:   { paddingHorizontal: 16, paddingBottom: 12, gap: 8 },
  dayCell:    { width: 44, alignItems: 'center', paddingVertical: 10, borderRadius: 14, backgroundColor: Colors.bgCard, borderWidth: 1, borderColor: Colors.border },
  dayCellToday: { backgroundColor: Colors.purple, borderColor: Colors.purple },
  dayLabel:   { fontSize: 10, fontWeight: '700', color: Colors.textMuted, marginBottom: 4 },
  dayLabelToday: { color: Surfaces.onNavy75 },
  dayNum:     { fontSize: 16, fontWeight: '800', color: Colors.textSecondary },
  dayNumToday: { color: Colors.white },
  dayDot:     { width: 5, height: 5, borderRadius: 2.5, backgroundColor: Surfaces.onNavy65, marginTop: 4 },

  summaryCard: {
    marginBottom: 16, backgroundColor: Colors.bgCard,
    borderRadius: 20, padding: 18, borderWidth: 1, borderColor: Colors.border, ...Shadows.card,
  },
  summaryRow:  { flexDirection: 'row', alignItems: 'center' },
  statItem:    { flex: 1, alignItems: 'center', gap: 4 },
  statVal:     { fontSize: 22, fontWeight: '800', color: Colors.textPrimary },
  statLbl:     { fontSize: 11, color: Colors.textMuted, fontWeight: '600' },
  statDivider: { width: 1, height: 40, backgroundColor: Colors.border },

  section:      { marginBottom: 12 },
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
    backgroundColor: Colors.amber + '10',
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
    backgroundColor: Colors.purple, borderRadius: Radius.lg,
    paddingVertical: 18, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'center', gap: 10,
    ...Shadows.purple,
  },
  startBtnText: { fontSize: 17, fontWeight: '800', color: Colors.white },
  startBtnSub:  { fontSize: 13, color: Surfaces.onNavy65, fontWeight: '600' },
});
