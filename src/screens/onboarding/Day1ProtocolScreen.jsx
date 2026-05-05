import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useOnboarding } from '../../context/OnboardingContext';
import { Colors, Shadows, Gradients, Radius, Spacing, Surfaces, PhasePalette } from '../../constants/brand';
import { selectExercises } from '../../constants/exerciseLibrary';
import GradientCard from '../../components/GradientCard';
import { useResponsive, fs, sp } from '../../utils/responsive';

function getRepsLabel(ex) {
  const reps = (ex.reps || '').trim();
  return reps || ex.duration || '';
}

export default function Day1ProtocolScreen({ navigation }) {
  const { onboardingData, completeOnboarding } = useOnboarding();
  const exercises = selectExercises(onboardingData);
  const totalMinutes = exercises.reduce((sum, e) => sum + (parseInt(e.duration) || 2), 0);
  const { width } = useWindowDimensions();
  const { isSmall, isTablet, isShort, horizPad, fontScale, gapScale } = useResponsive();
  const wideFrame = Math.min(width - horizPad * 2, 640);

  const dyn = {
    content:        { paddingBottom: 0 },
    hero:           { marginHorizontal: horizPad, marginTop: sp(16, gapScale), marginBottom: sp(16, gapScale) },
    frame:          { maxWidth: wideFrame },
    heroBadgeText:  { fontSize: fs(12, fontScale) },
    heroTitle:      { fontSize: fs(32, fontScale), lineHeight: fs(38, fontScale) },
    heroSub:        { fontSize: fs(13, fontScale), lineHeight: fs(19, fontScale) },
    statNum:        { fontSize: fs(22, fontScale) },
    statLabel:      { fontSize: fs(11, fontScale) },
    sectionTitle:   { fontSize: fs(20, fontScale) },
    sectionSub:     { fontSize: fs(13, fontScale) },
    list:           { paddingHorizontal: horizPad },
    phaseLabel:     { fontSize: fs(11, fontScale) },
    durationText:   { fontSize: fs(11, fontScale) },
    stepNumText:    { fontSize: fs(16, fontScale) },
    exName:         { fontSize: fs(16, fontScale) },
    repsText:       { fontSize: fs(13, fontScale) },
    nudgeCard:      { marginHorizontal: horizPad },
    nudgeText:      { fontSize: fs(13, fontScale), lineHeight: fs(20, fontScale) },
    startBtnText:   { fontSize: fs(17, fontScale) },
    dashBtnText:    { fontSize: fs(14, fontScale) },
    upgradeBtnText: { fontSize: fs(14, fontScale) },
    footer:         { paddingHorizontal: horizPad, paddingBottom: isShort ? 18 : 28 },
    footerInner:    { maxWidth: wideFrame },
  };

  return (
    <SafeAreaView style={s.container} edges={['top', 'bottom']}>

      <ScrollView
        style={s.scroll}
        contentContainerStyle={[s.content, dyn.content]}
        showsVerticalScrollIndicator={false}
      >
        {/* Centered frame wrapper for tablets */}
        <View style={[s.frame, dyn.frame]}>
          {/* ═══ Gradient hero ═══════════════════════════════════════════════ */}
          <GradientCard
            colors={Gradients.purpleHero}
            radius={Radius.hero}
            blobs={[
              { x: '88%', y: '15%', r: 80, color: '#FFFFFF', opacity: 0.12 },
              { x: '12%', y: '90%', r: 60, color: '#FFFFFF', opacity: 0.08 },
            ]}
            style={[s.hero, dyn.hero, Shadows.purple]}
          >
            <View style={s.heroTop}>
              <View style={s.heroBadge}>
                <Ionicons name="flash" size={12} color="#FFFFFF" />
                <Text style={[s.heroBadgeText, dyn.heroBadgeText]}>Day 1 · Ready to go</Text>
              </View>
            </View>

            <Text style={[s.heroTitle, dyn.heroTitle]}>Your recovery{'\n'}plan is ready.</Text>
            <Text style={[s.heroSub, dyn.heroSub]}>
              {exercises.length} targeted exercises · {totalMinutes} minutes · no equipment
            </Text>

            <View style={s.statRow}>
              <View style={[s.statBubble, { backgroundColor: Surfaces.onNavy22 }]}>
                <Text style={[s.statNum, dyn.statNum]}>{exercises.length}</Text>
                <Text style={[s.statLabel, dyn.statLabel]}>exercises</Text>
              </View>
              <View style={[s.statBubble, { backgroundColor: Surfaces.onNavy22 }]}>
                <Text style={[s.statNum, dyn.statNum]}>{totalMinutes}m</Text>
                <Text style={[s.statLabel, dyn.statLabel]}>total time</Text>
              </View>
              <View style={[s.statBubble, { backgroundColor: Surfaces.onNavy22 }]}>
                <Ionicons name="checkmark-circle" size={isTablet ? 26 : 22} color="#FFFFFF" />
                <Text style={[s.statLabel, dyn.statLabel]}>no gear</Text>
              </View>
            </View>
          </GradientCard>

          {/* ── Section label ── */}
          <View style={[s.sectionRow, { paddingHorizontal: horizPad }]}>
            <Text style={[s.sectionTitle, dyn.sectionTitle]}>Your exercises</Text>
            <Text style={[s.sectionSub, dyn.sectionSub]}>in order</Text>
          </View>

          {/* ── Exercise cards ── */}
          <View style={[s.list, dyn.list]}>
            {exercises.map((ex, i) => {
              const meta = PhasePalette[ex.phase] || PhasePalette.Mobility;
              const repsLabel = getRepsLabel(ex);

              return (
                <View key={i} style={[s.card, { borderLeftColor: meta.color }]}>
                  <View style={s.cardTop}>
                    <View style={[s.phasePill, { backgroundColor: meta.color + '18' }]}>
                      <Ionicons name={meta.icon} size={11} color={meta.color} />
                      <Text style={[s.phaseLabel, dyn.phaseLabel, { color: meta.color }]}>{meta.label}</Text>
                    </View>
                    <View style={[s.durationBadge, { backgroundColor: meta.color + '18' }]}>
                      <Ionicons name="time-outline" size={11} color={meta.color} />
                      <Text style={[s.durationText, dyn.durationText, { color: meta.color }]}>{ex.duration}</Text>
                    </View>
                  </View>

                  <View style={s.cardBody}>
                    <View style={[s.stepNum, { backgroundColor: meta.color }]}>
                      <Text style={[s.stepNumText, dyn.stepNumText]}>{i + 1}</Text>
                    </View>
                    <View style={s.cardInfo}>
                      <Text style={[s.exName, dyn.exName]}>{ex.name}</Text>
                      <Text style={[s.repsText, dyn.repsText]}>{repsLabel}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={16} color={meta.color + '60'} />
                  </View>
                </View>
              );
            })}
          </View>

          {/* ── Motivation nudge ── */}
          <View style={[s.nudgeCard, dyn.nudgeCard]}>
            <Text style={s.nudgeEmoji}>💡</Text>
            <Text style={[s.nudgeText, dyn.nudgeText]}>
              First session unlocks your full history and progress tracking. Takes less than {totalMinutes} minutes.
            </Text>
          </View>

          <View style={{ height: 220 }} />
        </View>
      </ScrollView>

      {/* ── Footer ── */}
      <View style={[s.footer, dyn.footer]}>
        <View style={[s.footerInner, dyn.footerInner]}>
          <TouchableOpacity
            style={s.startBtn}
            onPress={() => navigation.navigate('RecoverySession')}
            activeOpacity={0.85}
          >
            <Ionicons name="play-circle" size={22} color="#fff" />
            <Text style={[s.startBtnText, dyn.startBtnText]}>Start Now  ·  {totalMinutes} min</Text>
          </TouchableOpacity>

          <View style={s.footerRow}>
            <TouchableOpacity style={s.dashBtn} onPress={completeOnboarding} activeOpacity={0.82}>
              <Ionicons name="home-outline" size={15} color={Colors.purple} />
              <Text style={[s.dashBtnText, dyn.dashBtnText]}>Dashboard</Text>
            </TouchableOpacity>

            <TouchableOpacity style={s.upgradeBtn} onPress={() => navigation.navigate('Upgrade')} activeOpacity={0.82}>
              <Ionicons name="star-outline" size={15} color={Colors.amber} />
              <Text style={[s.upgradeBtnText, dyn.upgradeBtnText]}>Unlock Full Plan</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  scroll:    { flex: 1 },
  content:   {},
  frame:     { width: '100%', alignSelf: 'center' },

  hero: {},

  heroTop:        { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  heroBadge:      { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: Surfaces.onNavy22, borderRadius: Radius.pill, paddingHorizontal: Spacing.sm, paddingVertical: Spacing.xs },
  heroBadgeText:  { fontWeight: '800', color: '#FFFFFF' },

  heroTitle:      { fontWeight: '800', color: '#FFFFFF', letterSpacing: -0.8 },
  heroSub:        { color: Surfaces.onNavy92, fontWeight: '600', marginTop: 8, marginBottom: Spacing.md },

  statRow:        { flexDirection: 'row', gap: 10 },
  statBubble:     { flex: 1, borderRadius: 16, paddingVertical: 14, alignItems: 'center', gap: 4 },
  statNum:        { fontWeight: '800', color: '#FFFFFF' },
  statLabel:      { color: Surfaces.onNavy92, fontWeight: '700', letterSpacing: 0.4 },

  sectionRow: {
    flexDirection: 'row', alignItems: 'baseline', gap: 8, marginBottom: 12,
  },
  sectionTitle: { fontWeight: '800', color: Colors.textPrimary, letterSpacing: -0.3 },
  sectionSub:   { color: Colors.textMuted },

  list: { gap: 10 },
  card: {
    backgroundColor: Colors.bgCard,
    borderRadius: 20,
    borderWidth: 1, borderColor: Colors.border,
    borderLeftWidth: 4,
    padding: 16, gap: 12,
    ...Shadows.card,
  },

  cardTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  phasePill: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 9, paddingVertical: 4, borderRadius: 10,
  },
  phaseLabel: { fontWeight: '700', letterSpacing: 0.2 },
  durationBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10,
  },
  durationText: { fontWeight: '700' },

  cardBody: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  stepNum: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  stepNumText: { fontWeight: '800', color: '#fff' },
  cardInfo:   { flex: 1, gap: 4 },
  exName:     { fontWeight: '700', color: Colors.textPrimary, letterSpacing: -0.2 },
  repsText:   { color: Colors.textSecondary, fontWeight: '600' },

  nudgeCard: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 12,
    marginTop: 14,
    backgroundColor: Colors.bgCard,
    borderRadius: 18, padding: 16,
    borderWidth: 1, borderColor: Colors.border,
  },
  nudgeEmoji: { fontSize: 20 },
  nudgeText:  { flex: 1, color: Colors.textSecondary },

  footer: {
    paddingTop: 14,
    borderTopWidth: 1, borderTopColor: Colors.borderSubtle,
    backgroundColor: Colors.bg,
    alignItems: 'center',
  },
  footerInner: { width: '100%', alignSelf: 'center', gap: 10 },
  startBtn: {
    backgroundColor: Colors.purple, borderRadius: 20,
    paddingVertical: 18, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'center',
    gap: 10, ...Shadows.purple,
  },
  startBtnText: { fontWeight: '800', color: '#fff', letterSpacing: -0.3 },

  footerRow: { flexDirection: 'row', gap: 10 },
  dashBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 6,
    borderRadius: 16, paddingVertical: 13,
    backgroundColor: Colors.purpleDim,
    borderWidth: 1, borderColor: Colors.purple + '50',
  },
  dashBtnText: { fontWeight: '700', color: Colors.purple },

  upgradeBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 6,
    borderRadius: 16, paddingVertical: 13,
    backgroundColor: Colors.amber + '15',
    borderWidth: 1, borderColor: Colors.amber + '50',
  },
  upgradeBtnText: { fontWeight: '700', color: Colors.amber },
});
