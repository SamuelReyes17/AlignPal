import React, { useMemo, useState, useEffect } from 'react';
import { ScrollView, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useQuery, useMutation } from 'convex/react';

import { api } from '../../convex/_generated/api';
import { useOnboarding } from '../context/OnboardingContext';
import { useSubscription } from '../context/SubscriptionContext';
import { selectExercises, getOutlook } from '../constants/exerciseLibrary';
import { KitColors, KitAccents, KitRadius, KitSpacing } from '../constants/brand';
import { useResponsive, fs, sp } from '../utils/responsive';
import {
  GradientCard,
  CircularProgress,
  StatTile,
  ListCard,
  ListRow,
  Button,
} from '../components/kit';

const TODAY = new Date().toISOString().slice(0, 10);

// Three shades of brand purple — lighter = less pain, deeper = more.
const getPainColor = (level) => {
  if (level <= 3) return '#C4B8FF';  // purplePale
  if (level <= 6) return KitAccents.violetSoft;
  return KitAccents.violet;
};

/**
 * DashboardScreen — Home tab.
 *
 * Minimal-dark layout (Variant B). One violet hero, one stat row, one list of
 * today's exercises. PainTracker + PostureTip remain underneath as separate
 * cards — they already match the kit aesthetic.
 *
 * Data wiring (preserved from old Dashboard):
 *  - useOnboarding() for installId, painLocations, painIntensity
 *  - useSubscription() for isPremium gate
 *  - api.stats.getDashboardStats for sessionCount + latestPainLevel
 *  - selectExercises(onboardingData) for today's plan list
 *  - getOutlook(onboardingData) for outlook chip
 */

const LOCATION_LABELS = {
  lower_back: 'Lower Back', upper_back: 'Upper Back', neck: 'Neck',
  shoulder: 'Shoulder', knee: 'Knee', hip: 'Hip', glute: 'Glutes',
  hamstring: 'Hamstring', calf: 'Calf', ankle: 'Ankle',
  achilles: 'Achilles', plantar: 'Plantar Fascia',
  chest: 'Chest', abdomen: 'Core', elbow: 'Elbow',
  quad: 'Quads', shin: 'Shin',
};
const formatLocation = (raw) =>
  LOCATION_LABELS[raw] || raw.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

// Map exerciseLibrary phase → kit accent role.
const PHASE_TO_ACCENT = {
  Mobility:   'violet',
  Activation: 'teal',
  Stability:  'violet',
  Strength:   'pink',
  Release:    'avocado',
  Exposure:   'violet',
};

// Pull a one-glyph icon from the exercise's Ionicon name. Falls back to "•".
const PHASE_GLYPH = {
  Mobility:   '⌬',
  Activation: '⚡',
  Stability:  '◇',
  Strength:   '⬢',
  Release:    '✿',
  Exposure:   '↦',
};

export default function DashboardScreen({ navigation }) {
  const { onboardingData, installId } = useOnboarding();
  const { isPremium } = useSubscription();
  const dashStats = useQuery(api.stats.getDashboardStats, installId ? { installId } : 'skip');

  const { isSmall, isTablet, horizPad, frameWidth, fontScale, gapScale } = useResponsive();
  const ringSize = isSmall ? 110 : isTablet ? 150 : 132;

  const dyn = {
    content:    { paddingHorizontal: horizPad, gap: sp(KitSpacing.s5, gapScale) },
    name:       { fontSize: fs(22, fontScale) },
    eyebrow:    { fontSize: fs(13, fontScale) },
    heroNum:    { fontSize: fs(36, fontScale), lineHeight: fs(36, fontScale) },
    heroNumSm:  { fontSize: fs(22, fontScale) },
    heroLbl:    { fontSize: fs(12, fontScale) },
    sectionTitle:{ fontSize: fs(16, fontScale) },
    frame:      { width: '100%', alignSelf: 'center', maxWidth: Math.max(frameWidth, 0) },
  };

  const handleUpgradePress = () => navigation.navigate('Upgrade');

  const primaryArea = onboardingData.painLocations?.[0]
    ? formatLocation(onboardingData.painLocations[0])
    : 'Recovery';

  const exercises = useMemo(() => selectExercises(onboardingData), [onboardingData]);
  const outlook   = getOutlook(onboardingData);

  const startingPain = onboardingData.painIntensity ?? 5;
  const currentPain  = dashStats?.latestPainLevel ?? startingPain;
  const goalPain     = 3;
  const sessionCount = dashStats?.sessionCount ?? 0;
  const minutesToday = dashStats?.totalDurationMinutes ?? 0;

  // Recovery progress = how much of the gap from start → goal we've closed.
  const totalGap  = Math.max(1, startingPain - goalPain);
  const closedGap = Math.max(0, startingPain - currentPain);
  const recoveryFraction = Math.min(1, closedGap / totalGap);
  const recoveryPct = Math.round(recoveryFraction * 100);

  const painDelta = startingPain - currentPain;

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
            <Text style={[styles.eyebrow, dyn.eyebrow]}>Recovery focus</Text>
            <Text style={[styles.name, dyn.name]}>{primaryArea}</Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.iconBtn}
            onPress={() => navigation.navigate('Me')}
          >
            <Ionicons name="person-circle-outline" size={22} color={KitColors.text1} />
          </TouchableOpacity>
        </View>

        {/* Hero — violet, single ring */}
        <GradientCard variant="violet">
          <Text style={styles.heroEyebrow}>Today's alignment</Text>
          <View style={styles.heroRow}>
            <CircularProgress
              value={recoveryFraction}
              size={ringSize}
              centerTop={`${recoveryPct}%`}
              centerBottom="recovery"
            />
            <View style={styles.heroStats}>
              <Text
                style={[styles.heroNum, dyn.heroNum]}
                numberOfLines={1}
                adjustsFontSizeToFit
              >
                {minutesToday}
              </Text>
              <Text style={[styles.heroLbl, dyn.heroLbl]} numberOfLines={1}>
                min mobility today
              </Text>
              <View style={{ height: 14 }} />
              <Text
                style={[styles.heroNum, dyn.heroNumSm]}
                numberOfLines={1}
                adjustsFontSizeToFit
              >
                Day {sessionCount + 1}
              </Text>
              <Text style={[styles.heroLbl, dyn.heroLbl]} numberOfLines={1}>
                {outlook.label} outlook
              </Text>
            </View>
          </View>
        </GradientCard>

        {/* Stat row — pain on calm surface (number does the talking),
                       streak/sessions on avocado (reward role) */}
        <View style={styles.statRow}>
          <StatTile
            label="Pain level"
            value={`${currentPain}/10`}
            delta={
              painDelta > 0
                ? `↓ ${painDelta.toFixed(1)} since start`
                : painDelta < 0
                  ? `↑ ${Math.abs(painDelta).toFixed(1)} since start`
                  : 'Tracking'
            }
          />
          <View style={{ width: 12 }} />
          <StatTile
            label="Sessions"
            value={String(sessionCount)}
            delta={sessionCount > 0 ? 'Keep going' : 'Start today'}
            variant={sessionCount > 0 ? 'avocado' : undefined}
          />
        </View>

        {/* Today's plan */}
        <View style={styles.sectionHead}>
          <Text style={[styles.sectionTitle, dyn.sectionTitle]}>Today's plan</Text>
          <TouchableOpacity onPress={() => navigation.navigate('RecoverySession')}>
            <Text style={styles.sectionLink}>Start →</Text>
          </TouchableOpacity>
        </View>

        <ListCard>
          {exercises.slice(0, isPremium ? 5 : 3).map((ex, i) => (
            <ListRow
              key={`${ex.name}-${i}`}
              icon={PHASE_GLYPH[ex.phase] || '•'}
              iconColor={PHASE_TO_ACCENT[ex.phase] || 'violet'}
              title={ex.name}
              sub={`${ex.duration || 30}s · ${ex.phase}`}
              trailing={ex.reps ? `${ex.reps}r` : '—'}
              onPress={() => navigation.navigate('RecoverySession')}
            />
          ))}
        </ListCard>

        {!isPremium && exercises.length > 3 && (
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.unlockNote}
            onPress={handleUpgradePress}
          >
            <Ionicons name="lock-closed" size={14} color={KitColors.text2} />
            <Text style={styles.unlockText}>
              {exercises.length - 3} more exercises with AlignPal Pro
            </Text>
            <Ionicons name="chevron-forward" size={14} color={KitColors.text2} />
          </TouchableOpacity>
        )}

        {/* Daily check-in — kit-styled inline */}
        <DailyCheckIn />

        {/* Posture tip — kit-styled gated card */}
        {!isPremium && (
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.gatedCard}
            onPress={handleUpgradePress}
          >
            <View style={styles.gatedIcon}>
              <Ionicons name="lock-closed" size={18} color={KitAccents.violet} />
            </View>
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text style={styles.gatedTitle}>Posture tips</Text>
              <Text style={styles.gatedSub} numberOfLines={2}>
                Daily evidence-based posture cues with AlignPal Pro
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={KitColors.text3} />
          </TouchableOpacity>
        )}
       </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── DailyCheckIn (inline kit version) ──────────────────────────────────────
function DailyCheckIn() {
  const { installId } = useOnboarding();
  const logCheckIn = useMutation(api.checkIns.logCheckIn);
  const saved = useQuery(
    api.checkIns.getTodayCheckIn,
    installId ? { installId, date: TODAY } : 'skip'
  );

  const [pain, setPain] = useState(null);
  const [exercisesDone, setExercisesDone] = useState(null);
  const [logging, setLogging] = useState(false);

  useEffect(() => {
    if (saved) {
      if (typeof saved.painLevel === 'number') setPain(saved.painLevel);
      if (typeof saved.exercisesDone === 'boolean') setExercisesDone(saved.exercisesDone);
    }
  }, [saved]);

  const canSubmit = pain !== null && exercisesDone !== null && !logging;
  const submit = async () => {
    if (!installId || pain === null || exercisesDone === null) return;
    setLogging(true);
    try {
      await logCheckIn({ installId, date: TODAY, painLevel: pain, exercisesDone });
    } finally {
      setLogging(false);
    }
  };

  const isLogged = saved !== undefined && saved !== null;

  return (
    <View style={styles.checkInCard}>
      <View style={styles.checkInHead}>
        <View style={{ flexShrink: 1 }}>
          <Text style={styles.checkInTitle}>Daily check-in</Text>
          <Text style={styles.checkInSub}>
            {isLogged ? 'Logged for today' : 'Track today in 5 seconds'}
          </Text>
        </View>
        <View
          style={[
            styles.checkInBadge,
            isLogged && { backgroundColor: KitAccents.violet + '22', borderColor: KitAccents.violet + '60' },
          ]}
        >
          <Text style={[styles.checkInBadgeText, isLogged && { color: KitAccents.violet }]}>
            {isLogged ? 'Done' : 'New'}
          </Text>
        </View>
      </View>

      {/* Pain scale */}
      <Text style={styles.checkInLabel}>How's your pain today?</Text>
      <View style={styles.painScale}>
        {Array.from({ length: 10 }).map((_, i) => {
          const v = i + 1;
          const active = pain === v;
          return (
            <TouchableOpacity
              key={v}
              activeOpacity={0.7}
              onPress={() => setPain(v)}
              style={[
                styles.painDot,
                active && {
                  backgroundColor: getPainColor(v),
                  borderColor: getPainColor(v),
                },
              ]}
            >
              <Text style={[styles.painDotText, active && { color: '#FFFFFF' }]}>
                {v}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <View style={styles.scaleLegend}>
        <Text style={styles.scaleLegendText}>No pain</Text>
        <Text style={styles.scaleLegendText}>Worst</Text>
      </View>

      {/* Exercises yes / no */}
      <Text style={[styles.checkInLabel, { marginTop: 16 }]}>Did you do your exercises?</Text>
      <View style={styles.yesNoRow}>
        <TouchableOpacity
          activeOpacity={0.85}
          style={[
            styles.yesNoBtn,
            exercisesDone === true && {
              backgroundColor: KitAccents.violet + '22',
              borderColor: KitAccents.violet + '88',
            },
          ]}
          onPress={() => setExercisesDone(true)}
        >
          <Ionicons
            name="checkmark-circle"
            size={16}
            color={exercisesDone === true ? KitAccents.violet : KitColors.text3}
          />
          <Text style={[
            styles.yesNoText,
            exercisesDone === true && { color: KitAccents.violet },
          ]}>
            Yes, I did
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.85}
          style={[
            styles.yesNoBtn,
            exercisesDone === false && {
              backgroundColor: KitAccents.violetSoft + '22',
              borderColor: KitAccents.violetSoft + '88',
            },
          ]}
          onPress={() => setExercisesDone(false)}
        >
          <Ionicons
            name="close-circle"
            size={16}
            color={exercisesDone === false ? KitAccents.violetSoft : KitColors.text3}
          />
          <Text style={[
            styles.yesNoText,
            exercisesDone === false && { color: KitAccents.violetSoft },
          ]}>
            Not today
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{ marginTop: 16 }}>
        <Button
          label={logging ? 'Saving…' : isLogged ? 'Update check-in' : 'Log check-in'}
          disabled={!canSubmit}
          onPress={submit}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: KitColors.bg },
  content: {
    paddingTop: 22,
    paddingBottom: 120, // tab bar clearance
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  eyebrow: {
    color: KitColors.text3,
    fontSize: 13,
    fontWeight: '500',
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: KitColors.text1,
    letterSpacing: -0.4,
    marginTop: 2,
  },
  iconBtn: {
    width: 40, height: 40,
    backgroundColor: KitColors.surface1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: KitColors.hairline,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroEyebrow: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
    marginTop: 8,
  },
  heroStats: { flex: 1, minWidth: 0, flexShrink: 1 },
  heroNum: {
    fontSize: 36,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -1,
    lineHeight: 36,
  },
  heroLbl: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 4,
  },
  statRow: { flexDirection: 'row' },
  sectionHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginTop: KitSpacing.s3,
    marginBottom: -KitSpacing.s1,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: KitColors.text1,
    letterSpacing: -0.2,
    flexShrink: 1,
  },
  sectionLink: {
    fontSize: 13,
    color: KitColors.text3,
    fontWeight: '500',
  },
  unlockNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: KitColors.surface1,
    borderColor: KitColors.hairline,
    borderWidth: 1,
    borderRadius: 14,
    marginTop: -KitSpacing.s2,
  },
  unlockText: {
    flex: 1,
    color: KitColors.text2,
    fontSize: 13,
    fontWeight: '500',
  },

  // ─── DailyCheckIn ─────────────────────────────────────────────────────────
  checkInCard: {
    backgroundColor: KitColors.surface1,
    borderColor: KitColors.hairline,
    borderWidth: 1,
    borderRadius: KitRadius.lg,
    padding: 18,
  },
  checkInHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  checkInTitle: {
    color: KitColors.text1,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  checkInSub: {
    color: KitColors.text3,
    fontSize: 12,
    marginTop: 2,
  },
  checkInBadge: {
    backgroundColor: KitColors.surface2,
    borderColor: KitColors.hairline,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  checkInBadgeText: {
    color: KitColors.text2,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  checkInLabel: {
    color: KitColors.text2,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 10,
  },
  painScale: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 4,
  },
  painDot: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 10,
    backgroundColor: KitColors.surface2,
    borderColor: KitColors.hairline,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  painDotText: {
    color: KitColors.text2,
    fontSize: 12,
    fontWeight: '700',
  },
  scaleLegend: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  scaleLegendText: {
    color: KitColors.text3,
    fontSize: 11,
    fontWeight: '500',
  },
  yesNoRow: {
    flexDirection: 'row',
    gap: 10,
  },
  yesNoBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: KitRadius.md,
    backgroundColor: KitColors.surface2,
    borderColor: KitColors.hairline,
    borderWidth: 1,
  },
  yesNoText: {
    color: KitColors.text2,
    fontSize: 13,
    fontWeight: '700',
  },

  // ─── Premium gate (kit-styled) ────────────────────────────────────────────
  gatedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 16,
    backgroundColor: KitColors.surface1,
    borderColor: KitColors.hairline,
    borderWidth: 1,
    borderRadius: KitRadius.lg,
  },
  gatedIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: KitAccents.violet + '22',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gatedTitle: {
    color: KitColors.text1,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  gatedSub: {
    color: KitColors.text3,
    fontSize: 12,
    lineHeight: 16,
  },
});
