import React from 'react';
import { ScrollView, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Colors, Shadows, Accents, Gradients, Radius, Spacing, Surfaces, PainTypePalette } from '../constants/brand';
import { useOnboarding } from '../context/OnboardingContext';
import { getPainCondition } from '../constants/exerciseLibrary';
import GradientCard from '../components/GradientCard';
import ScreenFrame from '../components/ScreenFrame';
import CircularProgress from '../components/CircularProgress';
import { useResponsive, fs, sp } from '../utils/responsive';

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

const getPainColor = (level) => {
  if (level <= 3) return Colors.green;
  if (level <= 6) return Colors.amber;
  return Colors.red;
};

const MILESTONES = [
  { sessions: 1,  label: 'First session',    icon: 'star-outline' },
  { sessions: 7,  label: '7 day streak',     icon: 'flame-outline' },
  { sessions: 14, label: '2 weeks strong',   icon: 'trending-up-outline' },
  { sessions: 30, label: '1 month in',       icon: 'trophy-outline' },
];

export default function HistoryScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { onboardingData, installId } = useOnboarding();
  const { painLocations = [], painIntensity = 5, painTypes = [] } = onboardingData;
  const { isSmall, isTablet, horizPad, fontScale, gapScale, width } = useResponsive();
  const frameWidth = Math.min(width - horizPad * 2, 640);
  const ringSize = isSmall ? 130 : isTablet ? 170 : 150;

  const dyn = {
    frame:        { width: '100%', alignSelf: 'center', maxWidth: 640, paddingHorizontal: horizPad, paddingTop: sp(12, gapScale) },
    heroWrap:     {}, // full-bleed: no horizontal padding
    heroTitle:    { fontSize: fs(30, fontScale) },
    heroEyebrow:  { fontSize: fs(11, fontScale) },
    cardWrap:     { marginHorizontal: horizPad },
    sectionWrap:  { paddingHorizontal: horizPad },
    sectionTitle: { fontSize: fs(17, fontScale) },
    profileCondition: { fontSize: fs(17, fontScale) },
    goalCardTitle:    { fontSize: fs(15, fontScale) },
    goalCardSub:      { fontSize: fs(13, fontScale) },
    emptyTitle:       { fontSize: fs(18, fontScale) },
    emptySubtitle:    { fontSize: fs(13, fontScale) },
    startBtnText:     { fontSize: fs(15, fontScale) },
  };

  const condition = getPainCondition(onboardingData);
  const painColor = getPainColor(painIntensity);
  const recentSessions = useQuery(api.sessions.getRecentSessions, installId ? { installId } : 'skip');
  const sessions  = recentSessions?.filter((s) => s.completed)?.length ?? 0;
  const dayNumber = sessions + 1;

  return (
    <SafeAreaView style={styles.container} edges={[]}>
     <ScreenFrame>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.frame, dyn.frame]}>

        {/* ═══ Full-bleed gradient hero with progress ring ═══════════════════ */}
        <View style={dyn.heroWrap}>
          <GradientCard
            colors={Gradients.purpleHero}
            radius={Radius.hero}
            corners="bottom"
            blobs={[
              { x: '88%', y: '15%', r: 80, color: Colors.white, opacity: 0.10 },
              { x: '12%', y: '90%', r: 50, color: Colors.white, opacity: 0.06 },
            ]}
            style={[Shadows.purpleSoft, { paddingTop: insets.top }]}
          >
            <View style={styles.heroTopRow}>
              <View>
                <Text style={[styles.heroEyebrow, dyn.heroEyebrow]}>RECOVERY</Text>
                <Text style={[styles.heroTitle, dyn.heroTitle]}>Progress</Text>
              </View>
              <View style={styles.heroDayBadge}>
                <Text style={styles.heroDayBadgeText}>Day {dayNumber}</Text>
              </View>
            </View>
            <View style={{ alignItems: 'center', marginTop: 18 }}>
              <CircularProgress
                size={ringSize}
                strokeWidth={12}
                progress={Math.min(1, sessions / 30)}
                trackColor={Surfaces.onNavy08}
                gradient={[Colors.purpleLight, Colors.purple]}
                centerLabel="Sessions"
                centerValue={String(sessions)}
                centerValueColor={Colors.white}
                centerSub="of 30 day journey"
              />
            </View>
          </GradientCard>
        </View>

        {/* ── Your profile card ── */}
        <View style={[styles.profileCard, dyn.cardWrap, { marginTop: 14 }]}>
          <View style={styles.profileTop}>
            <View style={styles.conditionBlock}>
              <Text style={styles.profileEyebrow}>YOUR CONDITION</Text>
              <Text style={[styles.profileCondition, dyn.profileCondition]}>{condition.name}</Text>
              <View style={styles.locationRow}>
                <Ionicons name="location-outline" size={12} color={Colors.purple} />
                <Text style={styles.locationText}>{painLocations.map(formatLocation).join(', ') || 'General'}</Text>
              </View>
            </View>
            <View style={[styles.painBubble, { borderColor: painColor + '60' }]}>
              <Text style={[styles.painNum, { color: painColor }]}>{painIntensity}</Text>
              <Text style={styles.painDen}>/10</Text>
            </View>
          </View>

          {painTypes.length > 0 && (
            <View style={styles.symptomsRow}>
              {painTypes.map((type) => {
                const meta = PainTypePalette[type];
                if (!meta) return null;
                return (
                  <View key={type} style={[styles.symptomChip, { backgroundColor: meta.color + '18', borderColor: meta.color + '40' }]}>
                    <Text style={[styles.symptomChipText, { color: meta.color }]}>{meta.label}</Text>
                  </View>
                );
              })}
            </View>
          )}

          <View style={styles.goalRow}>
            <Ionicons name="flag-outline" size={13} color={Colors.green} />
            <Text style={styles.goalText}>Goal: reduce pain to ≤3/10 within {painIntensity >= 7 ? '6–12' : painIntensity >= 5 ? '3–6' : '1–3'} weeks</Text>
          </View>
        </View>

        {/* ── Pain reduction goal ── */}
        <View style={[styles.goalCard, dyn.cardWrap]}>
          <View style={styles.goalCardHeader}>
            <Text style={[styles.goalCardTitle, dyn.goalCardTitle]}>Pain Reduction Journey</Text>
            <Text style={[styles.goalCardSub, dyn.goalCardSub]}>{painIntensity}/10 → 3/10</Text>
          </View>
          <View style={styles.scaleBar}>
            <View style={[styles.scaleStart, { backgroundColor: painColor }]}>
              <Text style={styles.scaleEndText}>Start{'\n'}{painIntensity}/10</Text>
            </View>
            <View style={styles.scaleTrack}>
              <View style={[styles.scaleProgress, { width: sessions > 0 ? `${Math.min(95, (sessions / 30) * 100)}%` : '2%' }]} />
            </View>
            <View style={[styles.scaleEnd, { backgroundColor: Colors.green }]}>
              <Text style={styles.scaleEndText}>Goal{'\n'}3/10</Text>
            </View>
          </View>
          <Text style={styles.goalCardHint}>Complete daily sessions to see your progress chart here</Text>
        </View>

        {/* ── Milestones ── */}
        <View style={[styles.section, dyn.sectionWrap]}>
          <Text style={[styles.sectionTitle, dyn.sectionTitle]}>Milestones</Text>
          <View style={styles.milestonesGrid}>
            {MILESTONES.map((m) => {
              const unlocked = sessions >= m.sessions;
              return (
                <View key={m.sessions} style={[styles.milestone, unlocked && styles.milestoneUnlocked]}>
                  <Ionicons
                    name={unlocked ? m.icon.replace('-outline', '') : m.icon}
                    size={20}
                    color={unlocked ? Colors.amber : Colors.textDisabled}
                  />
                  <Text style={[styles.milestoneSessions, unlocked && styles.milestoneSessionsUnlocked]}>
                    {m.sessions} sessions
                  </Text>
                  <Text style={[styles.milestoneLabel, unlocked && styles.milestoneLabelUnlocked]}>
                    {m.label}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* ── Session history (empty) ── */}
        <View style={[styles.section, dyn.sectionWrap]}>
          <Text style={[styles.sectionTitle, dyn.sectionTitle]}>Session History</Text>
          <View style={styles.emptyCard}>
            <View style={styles.emptyIconRing}>
              <Ionicons name="calendar-outline" size={28} color={Colors.textMuted} />
            </View>
            <Text style={[styles.emptyTitle, dyn.emptyTitle]}>No sessions yet</Text>
            <Text style={[styles.emptySubtitle, dyn.emptySubtitle]}>
              After you complete your first recovery session, your history — pain level, exercises done, and duration — will automatically appear here.
            </Text>
            <TouchableOpacity
              style={styles.startBtn}
              onPress={() => navigation.navigate('RecoverySession')}
              activeOpacity={0.85}
            >
              <Ionicons name="play-circle-outline" size={18} color={Colors.white} />
              <Text style={[styles.startBtnText, dyn.startBtnText]}>Start Today's Session</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 24 }} />
        </View>
      </ScrollView>
     </ScreenFrame>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:  { flex: 1, backgroundColor: Colors.bg },
  scrollView: { flex: 1 },
  content:    { paddingTop: 4, paddingBottom: Spacing.tabBarClearance },
  frame:      { width: '100%', alignSelf: 'center' },

  // Hero
  heroTopRow:        { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  heroEyebrow:       { fontSize: 11, color: Surfaces.onNavy85, letterSpacing: 1.4, fontWeight: '800' },
  heroTitle:         { fontSize: 30, fontWeight: '800', color: Colors.white, letterSpacing: -0.6, marginTop: 3 },
  heroDayBadge:      { backgroundColor: Surfaces.onNavy22, borderRadius: Radius.pill, paddingHorizontal: Spacing.sm, paddingVertical: Spacing.xs },
  heroDayBadgeText:  { fontSize: 13, fontWeight: '800', color: Colors.white },

  profileCard: {
    backgroundColor: Colors.bgCard, marginBottom: 12,
    borderRadius: 22, padding: 18, borderWidth: 1, borderColor: Colors.border,
    ...Shadows.purpleSoft,
  },
  profileTop:      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 },
  conditionBlock:  { flex: 1, paddingRight: 12 },
  profileEyebrow:  { fontSize: 10, fontWeight: '700', color: Colors.purple, letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 5 },
  profileCondition:{ fontSize: 17, fontWeight: '800', color: Colors.textPrimary, letterSpacing: -0.3, marginBottom: 8, lineHeight: 22 },
  locationRow:     { flexDirection: 'row', alignItems: 'center', gap: 4 },
  locationText:    { fontSize: 12, color: Colors.textSecondary, fontWeight: '500' },
  painBubble:      { width: 56, height: 56, borderRadius: 28, borderWidth: 2, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.bgElevated },
  painNum:         { fontSize: 20, fontWeight: '800', lineHeight: 24 },
  painDen:         { fontSize: 11, color: Colors.textMuted, fontWeight: '600' },
  symptomsRow:     { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 12 },
  symptomChip:     { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20, borderWidth: 1 },
  symptomChipText: { fontSize: 11, fontWeight: '700' },
  goalRow:         { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: Colors.bgInput, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8, borderWidth: 1, borderColor: Colors.green + '30' },
  goalText:        { fontSize: 12, color: Colors.green, fontWeight: '600', flex: 1 },

  goalCard: {
    backgroundColor: Colors.bgCard, marginBottom: 12,
    borderRadius: 22, padding: 18, borderWidth: 1, borderColor: Colors.border,
    ...Shadows.card,
  },
  goalCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  goalCardTitle:  { fontSize: 15, fontWeight: '700', color: Colors.textPrimary },
  goalCardSub:    { fontSize: 13, color: Colors.purple, fontWeight: '700' },
  scaleBar:       { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  scaleStart:     { width: 52, height: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  scaleEnd:       { width: 52, height: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  scaleEndText:   { fontSize: 9, fontWeight: '700', color: Colors.white, textAlign: 'center', lineHeight: 13 },
  scaleTrack:     { flex: 1, height: 6, backgroundColor: Colors.border, marginHorizontal: 10, borderRadius: 3, overflow: 'hidden' },
  scaleProgress:  { height: '100%', backgroundColor: Colors.purple, borderRadius: 3 },
  goalCardHint:   { fontSize: 11, color: Colors.textMuted, textAlign: 'center' },

  section:      { marginBottom: 12 },
  sectionTitle: { fontSize: 17, fontWeight: '800', color: Colors.textPrimary, marginBottom: 12, letterSpacing: -0.3 },

  milestonesGrid: { flexDirection: 'row', gap: 10 },
  milestone: {
    flex: 1, backgroundColor: Colors.bgCard, borderRadius: 16, padding: 14,
    alignItems: 'center', gap: 5, borderWidth: 1, borderColor: Colors.border,
  },
  milestoneUnlocked:         { borderColor: Colors.amber + '60', backgroundColor: Colors.amber + '10' },
  milestoneSessions:         { fontSize: 11, color: Colors.textDisabled, fontWeight: '700' },
  milestoneSessionsUnlocked: { color: Colors.amber },
  milestoneLabel:            { fontSize: 10, color: Colors.textDisabled, textAlign: 'center' },
  milestoneLabelUnlocked:    { color: Colors.textSecondary },

  emptyCard: {
    backgroundColor: Colors.bgCard, borderRadius: 22, padding: 28,
    alignItems: 'center', borderWidth: 1, borderColor: Colors.border,
    ...Shadows.card,
  },
  emptyIconRing: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: Colors.bgElevated, borderWidth: 1, borderColor: Colors.border,
    alignItems: 'center', justifyContent: 'center', marginBottom: 16,
  },
  emptyTitle:    { fontSize: 18, fontWeight: '700', color: Colors.textPrimary, marginBottom: 10 },
  emptySubtitle: { fontSize: 13, color: Colors.textSecondary, textAlign: 'center', lineHeight: 20, marginBottom: 24 },
  startBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: Colors.purple, borderRadius: 16,
    paddingVertical: 14, paddingHorizontal: 24, ...Shadows.purpleSoft,
  },
  startBtnText: { fontSize: 15, fontWeight: '700', color: Colors.white },
});
