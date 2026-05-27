import React from 'react';
import { ScrollView, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from 'convex/react';

import { api } from '../../convex/_generated/api';
import { useOnboarding } from '../context/OnboardingContext';
import { getPainCondition } from '../constants/exerciseLibrary';
import { KitColors, KitRadius, KitSpacing } from '../constants/brand';
import { useResponsive, fs, sp } from '../utils/responsive';
import {
  GradientCard,
  BarChart,
  StatTile,
  ListCard,
  ListRow,
  Button,
} from '../components/kit';

/**
 * HistoryScreen — Progress / Pain Journey tab.
 *
 * Minimal-dark layout: avocado hero with a single big number, weekly bar
 * chart, two muted stat tiles, improvements list. Empty state if no sessions.
 *
 * Data wiring (preserved):
 *  - useOnboarding() for installId, painIntensity, painLocations
 *  - api.sessions.getRecentSessions for the bar chart + counts
 *  - getPainCondition(onboardingData) for the condition chip
 */

const LOCATION_LABELS = {
  lower_back: 'Lower Back', upper_back: 'Upper Back', neck: 'Neck',
  shoulder: 'Shoulder', knee: 'Knee', hip: 'Hip', glute: 'Glutes',
  hamstring: 'Hamstring', calf: 'Calf', ankle: 'Ankle',
};
const formatLocation = (raw) =>
  LOCATION_LABELS[raw] || raw.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

// Build a 7-day "this week" bar series from session records.
// session = { date: 'YYYY-MM-DD', durationMinutes, completed }
function buildWeek(sessions = []) {
  const now = new Date();
  const days = [];
  const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const iso = d.toISOString().slice(0, 10);
    const minutes = sessions
      .filter(s => s.date === iso && s.completed)
      .reduce((sum, s) => sum + (s.durationMinutes || 0), 0);
    days.push({
      label: dayLabels[d.getDay()],
      value: minutes,
      dim: minutes === 0,
    });
  }
  return days;
}

export default function HistoryScreen() {
  const navigation = useNavigation();
  const { onboardingData, installId } = useOnboarding();
  const { painLocations = [], painIntensity = 5 } = onboardingData;

  const { isSmall, isTablet, horizPad, frameWidth, fontScale, gapScale } = useResponsive();
  const dyn = {
    content:    { paddingHorizontal: horizPad, gap: sp(KitSpacing.s5, gapScale) },
    name:       { fontSize: fs(22, fontScale) },
    eyebrow:    { fontSize: fs(13, fontScale) },
    heroBigNum: { fontSize: fs(42, fontScale), lineHeight: fs(42, fontScale) },
    heroSub:    { fontSize: fs(13, fontScale) },
    sectionTitle: { fontSize: fs(16, fontScale) },
    chartTitle:   { fontSize: fs(14, fontScale) },
    frame:        { width: '100%', alignSelf: 'center', maxWidth: Math.max(frameWidth, 0) },
  };

  const recentSessions = useQuery(
    api.sessions.getRecentSessions,
    installId ? { installId } : 'skip'
  );
  const condition = getPainCondition(onboardingData);

  const completed = recentSessions?.filter(s => s.completed) ?? [];
  const totalSessions = completed.length;
  const totalMinutes  = completed.reduce((sum, s) => sum + (s.durationMinutes || 0), 0);
  const avgMinutes    = totalSessions > 0 ? Math.round(totalMinutes / totalSessions) : 0;

  const weekData = buildWeek(recentSessions ?? []);
  const weekMinutes = weekData.reduce((s, d) => s + d.value, 0);
  const sessionsThisWeek = weekData.filter(d => d.value > 0).length;

  // Friendly "X% ahead of last week" — placeholder until we track previous week.
  const aheadCopy = sessionsThisWeek > 0
    ? `${sessionsThisWeek} session${sessionsThisWeek === 1 ? '' : 's'} this week`
    : 'No sessions yet this week';

  const primaryArea = painLocations[0] ? formatLocation(painLocations[0]) : null;

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
            <Text style={[styles.eyebrow, dyn.eyebrow]}>Your week</Text>
            <Text style={[styles.name, dyn.name]}>Progress</Text>
          </View>
          <TouchableOpacity activeOpacity={0.7} style={styles.iconBtn}>
            <Ionicons name="ellipsis-horizontal" size={18} color={KitColors.text1} />
          </TouchableOpacity>
        </View>

        {/* Violet hero — brand purple, single big number */}
        <GradientCard variant="violet">
          <Text style={styles.heroEyebrow}>This week</Text>
          <Text style={[styles.heroBigNumber, dyn.heroBigNum]}>{weekMinutes} min</Text>
          <Text style={[styles.heroSub, dyn.heroSub]}>
            {aheadCopy}
            {primaryArea ? ` · Focused on ${primaryArea.toLowerCase()}` : ''}
          </Text>
        </GradientCard>

        {/* Bar chart */}
        <View style={styles.chartCard}>
          <View style={styles.chartHead}>
            <Text style={[styles.chartTitle, dyn.chartTitle]}>Daily mobility</Text>
            <Text style={styles.chartPeriod}>This week</Text>
          </View>
          <BarChart data={weekData} />
        </View>

        {/* Stat tiles */}
        <View style={styles.statRow}>
          <StatTile
            label="Avg. session"
            value={avgMinutes > 0 ? `${avgMinutes}m` : '—'}
          />
          <View style={{ width: 12 }} />
          <StatTile
            label="Pain at start"
            value={`${painIntensity}/10`}
          />
        </View>

        {/* Condition / improvements */}
        <View style={styles.sectionHead}>
          <Text style={[styles.sectionTitle, dyn.sectionTitle]}>Your recovery</Text>
        </View>
        <ListCard>
          <ListRow
            icon="◇"
            iconColor="violet"
            title={condition.name}
            sub={condition.description}
          />
          {totalSessions > 0 && (
            <ListRow
              icon="↗"
              iconColor="avocado"
              title="Sessions completed"
              sub={`${totalMinutes} minutes total`}
              trailing={String(totalSessions)}
            />
          )}
        </ListCard>

        {/* Empty state if no sessions yet */}
        {totalSessions === 0 && (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>No sessions yet</Text>
            <Text style={styles.emptySubtitle}>
              Once you complete your first session, your weekly mobility minutes
              and improvements will show up here.
            </Text>
            <View style={{ height: 16 }} />
            <Button
              label="Start today's session"
              onPress={() => navigation.navigate('RecoverySession')}
            />
          </View>
        )}
       </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: KitColors.bg },
  content: {
    paddingTop: 22,
    paddingBottom: 120,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  eyebrow: { color: KitColors.text3, fontSize: 13, fontWeight: '500' },
  name: {
    fontSize: 22, fontWeight: '700', color: KitColors.text1,
    letterSpacing: -0.4, marginTop: 2,
  },
  iconBtn: {
    width: 40, height: 40,
    backgroundColor: KitColors.surface1,
    borderRadius: 12,
    borderWidth: 1, borderColor: KitColors.hairline,
    alignItems: 'center', justifyContent: 'center',
  },
  heroEyebrow: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 12, fontWeight: '600',
    letterSpacing: 1.2, textTransform: 'uppercase',
    marginBottom: 4,
  },
  heroBigNumber: {
    color: '#FFFFFF', fontSize: 42, fontWeight: '800',
    letterSpacing: -1, lineHeight: 42, marginBottom: 8,
  },
  heroSub: { color: 'rgba(255,255,255,0.85)', fontSize: 13, lineHeight: 18 },
  chartCard: {
    backgroundColor: KitColors.surface1,
    borderColor: KitColors.hairline, borderWidth: 1,
    borderRadius: KitRadius.lg,
    padding: 18, paddingBottom: 14,
  },
  chartHead: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline',
    marginBottom: 14,
  },
  chartTitle:  { fontSize: 14, fontWeight: '600', color: KitColors.text1 },
  chartPeriod: { fontSize: 12, color: KitColors.text3 },
  statRow: { flexDirection: 'row' },
  sectionHead: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline',
    marginTop: KitSpacing.s3, marginBottom: -KitSpacing.s1, gap: 12,
  },
  sectionTitle: {
    fontSize: 16, fontWeight: '700', color: KitColors.text1, letterSpacing: -0.2,
    flexShrink: 1,
  },
  emptyCard: {
    backgroundColor: KitColors.surface1,
    borderColor: KitColors.hairline,
    borderWidth: 1,
    borderRadius: KitRadius.lg,
    padding: 22,
    alignItems: 'stretch',
  },
  emptyTitle: {
    color: KitColors.text1, fontSize: 16, fontWeight: '700',
    letterSpacing: -0.2, marginBottom: 6,
  },
  emptySubtitle: {
    color: KitColors.text2, fontSize: 13, lineHeight: 18,
  },
});
