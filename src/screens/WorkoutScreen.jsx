import React, { useMemo } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { useOnboarding } from '../context/OnboardingContext';
import { selectExercises } from '../constants/exerciseLibrary';
import { KitColors, KitAccents, KitRadius, KitSpacing } from '../constants/brand';
import {
  GradientCard,
  ListCard,
  ListRow,
  Button,
} from '../components/kit';
import { useResponsive, fs, sp } from '../utils/responsive';

/**
 * WorkoutScreen — Workout tab.
 *
 * Uniform layout (matches Dashboard/History/Profile):
 *  - Header row (eyebrow + title)
 *  - Violet hero with today's date + 3 inline stats
 *  - Day strip
 *  - Today's exercises as a list
 *  - Bottom: Start Session CTA
 *
 * Data wiring preserved:
 *  - useOnboarding() for personalized exercise selection
 *  - selectExercises(onboardingData)
 *  - navigation to 'RecoverySession'
 */

const PHASE_TO_ACCENT = {
  Mobility: 'violet', Activation: 'teal', Stability: 'violet',
  Strength:  'pink',  Release:    'avocado', Exposure: 'violet',
};
const PHASE_GLYPH = {
  Mobility: '⌬', Activation: '⚡', Stability: '◇',
  Strength: '⬢', Release: '✿', Exposure: '↦',
};

function getTodayString() {
  return new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
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

  const { isSmall, isTablet, horizPad, frameWidth, fontScale, gapScale } = useResponsive();
  const dyn = {
    content:    { paddingHorizontal: horizPad, gap: sp(KitSpacing.s5, gapScale) },
    name:       { fontSize: fs(22, fontScale) },
    eyebrow:    { fontSize: fs(13, fontScale) },
    heroNum:    { fontSize: fs(28, fontScale) },
    heroLbl:    { fontSize: fs(11, fontScale) },
    sectionTitle:{ fontSize: fs(16, fontScale) },
    frame:      { width: '100%', alignSelf: 'center', maxWidth: Math.max(frameWidth, 0) },
  };

  const totalMin = exercises.reduce((s, e) => s + (parseInt(e.duration) || 2), 0);
  const phases   = [...new Set(exercises.map(e => e.phase))];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={[styles.content, dyn.content]}
        showsVerticalScrollIndicator={false}
      >
       <View style={dyn.frame}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.eyebrow, dyn.eyebrow]}>Today's plan</Text>
            <Text style={[styles.name, dyn.name]} numberOfLines={1}>Workout</Text>
          </View>
          <View style={styles.dateBadge}>
            <Ionicons name="calendar-outline" size={12} color={KitColors.text2} />
            <Text style={styles.dateBadgeText} numberOfLines={1}>{getTodayString()}</Text>
          </View>
        </View>

        {/* Violet hero with 3 inline stats */}
        <GradientCard variant="violet">
          <Text style={styles.heroEyebrow}>Session ready</Text>
          <View style={styles.heroStatsRow}>
            <View style={styles.heroStat}>
              <Text style={[styles.heroNum, dyn.heroNum]}>{exercises.length}</Text>
              <Text style={[styles.heroLbl, dyn.heroLbl]}>EXERCISES</Text>
            </View>
            <View style={styles.heroDivider} />
            <View style={styles.heroStat}>
              <Text style={[styles.heroNum, dyn.heroNum]}>{totalMin}m</Text>
              <Text style={[styles.heroLbl, dyn.heroLbl]}>DURATION</Text>
            </View>
            <View style={styles.heroDivider} />
            <View style={styles.heroStat}>
              <Text style={[styles.heroNum, dyn.heroNum]}>{phases.length}</Text>
              <Text style={[styles.heroLbl, dyn.heroLbl]}>PHASES</Text>
            </View>
          </View>
        </GradientCard>

        {/* Day strip */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.dayStrip}
        >
          {days.map((d, i) => (
            <View key={i} style={[styles.dayCell, d.isToday && styles.dayCellToday]}>
              <Text style={[styles.dayLabel, d.isToday && styles.dayLabelToday]}>{d.label}</Text>
              <Text style={[styles.dayNum, d.isToday && styles.dayNumToday]}>{d.num}</Text>
            </View>
          ))}
        </ScrollView>

        {/* Today's exercises */}
        <View style={styles.sectionHead}>
          <Text style={[styles.sectionTitle, dyn.sectionTitle]}>Today's exercises</Text>
          <Text style={styles.sectionLink}>{exercises.length} total</Text>
        </View>
        <ListCard>
          {exercises.map((ex, i) => (
            <ListRow
              key={ex.name + i}
              icon={PHASE_GLYPH[ex.phase] || '•'}
              iconColor={PHASE_TO_ACCENT[ex.phase] || 'violet'}
              title={ex.name}
              sub={`${ex.phase} · ${ex.reps || ex.duration}`}
              trailing={`${i + 1}/${exercises.length}`}
            />
          ))}
        </ListCard>

        {/* Tip */}
        <View style={styles.tipCard}>
          <Ionicons name="bulb-outline" size={14} color={KitAccents.avocado} />
          <Text style={styles.tipText}>
            Rest 30–60s between sets. Stop if pain increases beyond baseline.
          </Text>
        </View>

        {/* Start CTA */}
        <View style={{ marginTop: KitSpacing.s2 }}>
          <Button
            label={`Start session · ${totalMin} min`}
            onPress={() => navigation.navigate('RecoverySession')}
          />
        </View>
       </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: KitColors.bg },
  content: { paddingTop: 22, paddingBottom: 120 },

  header: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', gap: 12,
  },
  eyebrow: { color: KitColors.text3, fontSize: 13, fontWeight: '500' },
  name: {
    fontSize: 22, fontWeight: '700', color: KitColors.text1,
    letterSpacing: -0.4, marginTop: 2,
  },
  dateBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: KitColors.surface1,
    borderRadius: 12,
    borderWidth: 1, borderColor: KitColors.hairline,
    paddingHorizontal: 10, paddingVertical: 8,
    flexShrink: 1,
  },
  dateBadgeText: { color: KitColors.text2, fontSize: 12, fontWeight: '600' },

  heroEyebrow: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 12, fontWeight: '600',
    letterSpacing: 1.2, textTransform: 'uppercase',
    marginBottom: 12,
  },
  heroStatsRow: { flexDirection: 'row', alignItems: 'center' },
  heroStat:     { flex: 1, alignItems: 'center' },
  heroDivider:  { width: 1, height: 28, backgroundColor: 'rgba(255,255,255,0.18)' },
  heroNum: {
    color: '#FFFFFF', fontSize: 28, fontWeight: '800',
    letterSpacing: -0.6, lineHeight: 32,
  },
  heroLbl: {
    color: 'rgba(255,255,255,0.75)', fontSize: 11, fontWeight: '700',
    letterSpacing: 1.2, marginTop: 4,
  },

  dayStrip: { gap: 8, paddingVertical: 4 },
  dayCell: {
    width: 48, alignItems: 'center', paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: KitColors.surface1,
    borderWidth: 1, borderColor: KitColors.hairline,
  },
  dayCellToday: { backgroundColor: KitAccents.violet, borderColor: KitAccents.violet },
  dayLabel: { fontSize: 10, fontWeight: '700', color: KitColors.text3, marginBottom: 4 },
  dayLabelToday: { color: 'rgba(255,255,255,0.85)' },
  dayNum: { fontSize: 16, fontWeight: '800', color: KitColors.text2 },
  dayNumToday: { color: '#FFFFFF' },

  sectionHead: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'baseline',
    marginTop: KitSpacing.s3, marginBottom: -KitSpacing.s1, gap: 12,
  },
  sectionTitle: {
    fontSize: 16, fontWeight: '700', color: KitColors.text1,
    letterSpacing: -0.2, flexShrink: 1,
  },
  sectionLink: { fontSize: 13, color: KitColors.text3, fontWeight: '500' },

  tipCard: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 10,
    backgroundColor: KitColors.surface1,
    borderColor: KitColors.hairline, borderWidth: 1,
    borderRadius: KitRadius.md, padding: 14,
  },
  tipText: { flex: 1, fontSize: 12, color: KitColors.text2, lineHeight: 18 },
});
