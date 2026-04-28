import React from 'react';
import { ScrollView, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Colors, Shadows } from '../constants/brand';
import { useOnboarding } from '../context/OnboardingContext';
import { getPainCondition } from '../constants/exerciseLibrary';

const LOCATION_LABELS = {
  lower_back: 'Lower Back', upper_back: 'Upper Back', neck: 'Neck',
  shoulder: 'Shoulder', knee: 'Knee', hip: 'Hip', glute: 'Glutes',
  hamstring: 'Hamstring', calf: 'Calf', ankle: 'Ankle',
  achilles: 'Achilles', plantar: 'Plantar Fascia',
  chest: 'Chest', abdomen: 'Core', elbow: 'Elbow',
  quad: 'Quads', shin: 'Shin',
};

const PAIN_TYPE_META = {
  sharp:     { label: 'Sharp',     color: '#FF6B9D' },
  dull:      { label: 'Dull',      color: '#FBBF24' },
  burning:   { label: 'Burning',   color: '#FB923C' },
  stiff:     { label: 'Stiff',     color: '#818CF8' },
  radiating: { label: 'Radiating', color: '#7C5CF0' },
  numb:      { label: 'Numbness',  color: '#34D399' },
  cramping:  { label: 'Cramping',  color: '#60A5FA' },
  throbbing: { label: 'Throbbing', color: '#F472B6' },
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
  const { onboardingData } = useOnboarding();
  const { painLocations = [], painIntensity = 5, painTypes = [] } = onboardingData;

  const condition = getPainCondition(onboardingData);
  const painColor = getPainColor(painIntensity);
  const sessions  = 0; // TODO: replace with real Convex query
  const dayNumber = sessions + 1;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerEyebrow}>Recovery</Text>
          <Text style={styles.headerTitle}>Progress</Text>
        </View>
        <View style={styles.dayBadge}>
          <Text style={styles.dayBadgeText}>Day {dayNumber}</Text>
        </View>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* ── Your profile card ── */}
        <View style={styles.profileCard}>
          <View style={styles.profileTop}>
            <View style={styles.conditionBlock}>
              <Text style={styles.profileEyebrow}>YOUR CONDITION</Text>
              <Text style={styles.profileCondition}>{condition.name}</Text>
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
                const meta = PAIN_TYPE_META[type];
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
        <View style={styles.goalCard}>
          <View style={styles.goalCardHeader}>
            <Text style={styles.goalCardTitle}>Pain Reduction Journey</Text>
            <Text style={styles.goalCardSub}>{painIntensity}/10 → 3/10</Text>
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
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Milestones</Text>
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
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Session History</Text>
          <View style={styles.emptyCard}>
            <View style={styles.emptyIconRing}>
              <Ionicons name="calendar-outline" size={28} color={Colors.textMuted} />
            </View>
            <Text style={styles.emptyTitle}>No sessions yet</Text>
            <Text style={styles.emptySubtitle}>
              After you complete your first recovery session, your history — pain level, exercises done, and duration — will automatically appear here.
            </Text>
            <TouchableOpacity
              style={styles.startBtn}
              onPress={() => navigation.navigate('RecoverySession')}
              activeOpacity={0.85}
            >
              <Ionicons name="play-circle-outline" size={18} color={Colors.white} />
              <Text style={styles.startBtnText}>Start Today's Session</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:  { flex: 1, backgroundColor: Colors.bg },
  scrollView: { flex: 1 },
  content:    { paddingTop: 4, paddingBottom: 20 },

  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingTop: 14, paddingBottom: 16,
  },
  headerEyebrow: { fontSize: 12, color: Colors.textSecondary, letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 3, fontWeight: '600' },
  headerTitle:   { fontSize: 30, fontWeight: '800', color: Colors.textPrimary },
  dayBadge:      { backgroundColor: Colors.purpleDim, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, borderColor: Colors.purple + '50' },
  dayBadgeText:  { fontSize: 13, fontWeight: '700', color: Colors.purple },

  profileCard: {
    backgroundColor: Colors.bgCard, marginHorizontal: 20, marginBottom: 12,
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
    backgroundColor: Colors.bgCard, marginHorizontal: 20, marginBottom: 12,
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

  section:      { paddingHorizontal: 20, marginBottom: 12 },
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
