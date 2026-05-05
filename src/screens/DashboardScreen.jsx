import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import StatsCard from '../components/StatsCard';
import ExerciseCard from '../components/ExerciseCard';
import PainTrackerCard from '../components/PainTrackerCard';
import PostureTipCard from '../components/PostureTipCard';
import RecoveryOverviewCard from '../components/RecoveryOverviewCard';
import PremiumGate from '../components/PremiumGate';
import GradientCard from '../components/GradientCard';
import ScreenFrame from '../components/ScreenFrame';
import CircularProgress from '../components/CircularProgress';
import { useOnboarding } from '../context/OnboardingContext';
import { useSubscription } from '../context/SubscriptionContext';
import { Colors, Shadows, Accents, Gradients, Radius, Spacing, Surfaces } from '../constants/brand';
import { selectExercises, getOutlook } from '../constants/exerciseLibrary';

const LOCATION_LABELS = {
  lower_back: 'Lower Back', upper_back: 'Upper Back', neck: 'Neck',
  shoulder: 'Shoulder', knee: 'Knee', hip: 'Hip', glute: 'Glutes',
  hamstring: 'Hamstring', calf: 'Calf', ankle: 'Ankle',
};

const formatLocation = (raw) =>
  LOCATION_LABELS[raw] || raw.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

export default function DashboardScreen({ navigation }) {
  const { onboardingData, installId } = useOnboarding();
  const { isPremium } = useSubscription();
  const dashStats = useQuery(api.stats.getDashboardStats, installId ? { installId } : 'skip');
  const insets = useSafeAreaInsets();

  const handleUpgradePress = () => navigation.navigate('Upgrade');

  const primaryArea = onboardingData.painLocations[0]
    ? formatLocation(onboardingData.painLocations[0])
    : 'Recovery';

  const exercises = useMemo(() => selectExercises(onboardingData), [onboardingData]);
  const outlook   = getOutlook(onboardingData);

  const startingPain = onboardingData.painIntensity ?? 5;
  const currentPain  = dashStats?.latestPainLevel ?? startingPain;
  const goalPain     = 3;
  const sessionCount = dashStats?.sessionCount ?? 0;

  // Progress = how far we've come from start to goal (0..1)
  const totalGap = Math.max(1, startingPain - goalPain);
  const closedGap = Math.max(0, startingPain - currentPain);
  const recoveryProgress = Math.min(1, closedGap / totalGap);
  const recoveryPct = Math.round(recoveryProgress * 100);

  return (
    <SafeAreaView style={styles.container} edges={[]}>
     <ScreenFrame>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        scrollEnabled
        bounces
        keyboardShouldPersistTaps="handled"
      >

        {/* ═══ Full-bleed hero — contains app title + progress ring ═══════════ */}
        <View style={{ marginBottom: 12 }}>
          <GradientCard
            colors={Gradients.purpleHero}
            radius={Radius.hero}
            corners="bottom"
            blobs={[
              { x: '88%', y: '15%', r: 90, color: Colors.white, opacity: 0.10 },
              { x: '15%', y: '92%', r: 60, color: Colors.white, opacity: 0.06 },
            ]}
            style={[Shadows.purple, { paddingTop: insets.top }]}
          >
            {/* Title row inside the hero */}
            <View style={styles.heroAppBar}>
              <View>
                <Text style={styles.heroAppEyebrow}>DAILY RECOVERY</Text>
                <Text style={styles.heroAppTitle}>{primaryArea}</Text>
              </View>
              <TouchableOpacity style={styles.heroProfileBtn} onPress={() => navigation.navigate('Me')} activeOpacity={0.85}>
                <Ionicons name="person-circle-outline" size={26} color={Colors.white} />
              </TouchableOpacity>
            </View>

            <View style={styles.heroTop}>
              <View>
                <Text style={styles.heroEyebrow}>YOUR PROGRESS</Text>
                <Text style={styles.heroTitle}>Day {sessionCount + 1}</Text>
              </View>
              <View style={styles.heroBadge}>
                <View style={[styles.heroBadgeDot, { backgroundColor: Accents.avocado }]} />
                <Text style={styles.heroBadgeText}>{outlook.label} potential</Text>
              </View>
            </View>

            <View style={styles.heroRingWrap}>
              <CircularProgress
                size={170}
                strokeWidth={14}
                progress={recoveryProgress}
                trackColor={Surfaces.onNavy08}
                gradient={[Colors.purpleLight, Colors.purple]}
                centerLabel="Recovery"
                centerValue={`${recoveryPct}%`}
                centerValueColor={Colors.white}
                centerSub={`${currentPain}/10 → ${goalPain}/10`}
              />
            </View>

            <View style={styles.heroFooterRow}>
              <View style={styles.heroFooterItem}>
                <Text style={styles.heroFooterLabel}>SESSIONS</Text>
                <Text style={styles.heroFooterValue}>{sessionCount}</Text>
              </View>
              <View style={styles.heroFooterDivider} />
              <View style={styles.heroFooterItem}>
                <Text style={styles.heroFooterLabel}>EXERCISES</Text>
                <Text style={styles.heroFooterValue}>{exercises.length}</Text>
              </View>
              <View style={styles.heroFooterDivider} />
              <View style={styles.heroFooterItem}>
                <Text style={styles.heroFooterLabel}>OUTLOOK</Text>
                <Text style={styles.heroFooterValue}>{outlook.weeks.split(' ')[0]}</Text>
              </View>
            </View>
          </GradientCard>
        </View>

        {/* ── Quick action: pain check + start session ── */}
        <View style={styles.quickRow}>
          <TouchableOpacity
            style={[styles.quickCard, { backgroundColor: Accents.coral }]}
            onPress={() => navigation.navigate('RecoverySession')}
            activeOpacity={0.85}
          >
            <Ionicons name="play-circle" size={22} color={Colors.white} />
            <Text style={styles.quickCardLabel}>Today's Session</Text>
            <Text style={styles.quickCardSub}>{exercises.length} exercises</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.quickCard, { backgroundColor: Accents.teal }]}
            onPress={() => navigation.navigate('Progress')}
            activeOpacity={0.85}
          >
            <Ionicons name="trending-down" size={22} color={Colors.white} />
            <Text style={styles.quickCardLabel}>Pain Journey</Text>
            <Text style={styles.quickCardSub}>{currentPain}/10 today</Text>
          </TouchableOpacity>
        </View>

        {/* 1. Today's exercises */}
        <ExerciseCard previewOnly={!isPremium} onUpgrade={handleUpgradePress} />

        {/* 2. Daily check-in */}
        <PainTrackerCard />

        {/* 3. Condition overview */}
        <RecoveryOverviewCard />

        {/* 4. Progress stats */}
        <StatsCard />

        {/* 5. Posture tip — premium */}
        <PremiumGate label="Posture Tips" onUpgrade={handleUpgradePress}>
          <PostureTipCard />
        </PremiumGate>

      </ScrollView>
     </ScreenFrame>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:    { flex: 1, backgroundColor: Colors.bg },
  scrollView:   { flex: 1 },
  scrollContent:{ paddingBottom: Spacing.tabBarClearance, flexGrow: 1 },

  // Hero in-card app bar (replaces the old SafeArea-level header)
  heroAppBar:       { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 },
  heroAppEyebrow:   { fontSize: 11, color: Surfaces.onNavy75, letterSpacing: 1.4, fontWeight: '700' },
  heroAppTitle:     { fontSize: 22, fontWeight: '800', color: Colors.white, letterSpacing: -0.4, marginTop: 2 },
  heroProfileBtn:   { width: 44, height: 44, borderRadius: 14, backgroundColor: Surfaces.onNavy18, alignItems: 'center', justifyContent: 'center' },

  // Hero
  heroTop:           { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  heroEyebrow:       { fontSize: 11, fontWeight: '800', color: Surfaces.onNavy85, letterSpacing: 1.4 },
  heroTitle:         { fontSize: 28, fontWeight: '800', color: Colors.white, letterSpacing: -0.6, marginTop: 4 },
  heroBadge:         { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: Surfaces.onNavy18, borderRadius: Radius.pill, paddingHorizontal: 10, paddingVertical: Spacing.xs },
  heroBadgeDot:      { width: 6, height: 6, borderRadius: 3 },
  heroBadgeText:     { color: Colors.white, fontSize: 11, fontWeight: '700' },
  heroRingWrap:      { alignItems: 'center', marginVertical: 18 },
  heroFooterRow:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: Surfaces.onNavy10, borderRadius: Radius.lg, padding: Spacing.sm },
  heroFooterItem:    { flex: 1, alignItems: 'center' },
  heroFooterLabel:   { fontSize: 9, fontWeight: '800', color: Surfaces.onNavy75, letterSpacing: 1.2 },
  heroFooterValue:   { fontSize: 18, fontWeight: '800', color: Colors.white, marginTop: 4, letterSpacing: -0.4 },
  heroFooterDivider: { width: 1, height: 24, backgroundColor: Surfaces.onNavy18 },

  // Quick action row
  quickRow:        { flexDirection: 'row', gap: 10, paddingHorizontal: 20, marginBottom: 14 },
  quickCard:       { flex: 1, borderRadius: Radius.xl, padding: 16, gap: 6, ...Shadows.card },
  quickCardLabel:  { color: Colors.white, fontSize: 14, fontWeight: '800', marginTop: 6, letterSpacing: -0.2 },
  quickCardSub:    { color: Surfaces.onNavy92, fontSize: 12, fontWeight: '600' },
});
